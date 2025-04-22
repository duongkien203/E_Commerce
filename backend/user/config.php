<?php
require_once 'db.php';
require_once 'SendNotification.php';

function fetchAccount($loginType, $username, $password, $role) {
    $conn = connectDB();
    $stmt = $conn->prepare("SELECT * FROM `accounts` WHERE `$loginType` = ? AND `role_id` = ?");
    $stmt->bind_param('ss', $username, $role);

    try {
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $account = $result->fetch_assoc(); // Lấy thông tin tài khoản từ cơ sở dữ liệu

            // So sánh mật khẩu người dùng nhập vào với mật khẩu đã mã hóa trong cơ sở dữ liệu
            if (password_verify($password, $account['password'])) {
                // Nếu mật khẩu đúng, trả về thông tin tài khoản
                return $account;
            } else {
                // Nếu mật khẩu không đúng
                return ['status' => 'error', 'message' => 'Mật khẩu không đúng'];
            }
        } else {
            // Nếu không tìm thấy tài khoản
            return ['status' => 'error', 'message' => 'Tài khoản không tồn tại'];
        }
    } finally {
        // Đảm bảo rằng câu lệnh và kết nối luôn được đóng
        $stmt->close();
        $conn->close();
    }
}

function createAccount($contactType, $contactValue, $username) {
    $conn = connectDB();

    // Kiểm tra xem contact (email hoặc số điện thoại) đã tồn tại chưa
    $contactValue = $conn->real_escape_string($contactValue); // Bảo vệ dữ liệu đầu vào
    $sqlCheckContact = "SELECT * FROM `accounts` WHERE `$contactType` = '$contactValue'";
    $resultContact = $conn->query($sqlCheckContact);

    if ($resultContact->num_rows > 0) {
        $errorMessage = ($contactType === 'email') ? 'Email đã tồn tại' : 'Số điện thoại đã tồn tại';
        $conn->close();
        return ['status' => 'error', 'message' => $errorMessage];
    }

    // Kiểm tra xem username đã tồn tại chưa
    $username = $conn->real_escape_string($username);
    $sqlCheckUsername = "SELECT * FROM `accounts` WHERE `username` = '$username'";
    $resultUsername = $conn->query($sqlCheckUsername);

    if ($resultUsername->num_rows > 0) {
        $conn->close();
        return ['status' => 'error', 'message' => 'Tên đăng nhập đã tồn tại'];
    }

    // Gửi OTP cho email hoặc số điện thoại (bắt buộc)
    if ($contactType === 'email' || $contactType === 'phone_number') {
        $otpSent = sendVerificationCode($contactValue, $contactType);
        if ($otpSent) {
            $conn->close();
            return ['status' => 'pending', 'message' => 'Mã OTP đã được gửi. Vui lòng xác minh để hoàn tất đăng ký.', 'contact' => $contactValue, 'session_data' => $_SESSION];
        } else {
            $conn->close();
            return ['status' => 'error', 'message' => 'Không thể gửi mã OTP. Vui lòng thử lại.', 'contact' => $contactValue];
        }
    }

    // Không có trường hợp nào khác (ví dụ: không tạo tài khoản ngay mà không có OTP)
    $conn->close();
    return ['status' => 'error', 'message' => 'Loại liên hệ không hợp lệ. Vui lòng kiểm tra lại.'];
}

function checkOTP($contact, $otp) {
    session_start();

    if (!isset($_SESSION['otp'][$contact])) {
        echo json_encode(['status' => 'error', 'message' => 'Contact không tồn tại.', 'session' => $_SESSION, 'contact' => $contact, 'session_id' => session_id()]);
        exit;
    }

    $otpSaved = $_SESSION['otp'][$contact];
    $otpTime = $_SESSION['otp_time'][$contact];

    // Kiểm tra thời gian hợp lệ (2 phút)
    if (time() - $otpTime > 120) {
        unset($_SESSION['otp'][$contact]); // Xóa OTP đã hết hạn
        unset($_SESSION['otp_time'][$contact]);
        return ['status' => 'error', 'message' => 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.'];
    }

    // Kiểm tra OTP có đúng không
    if ($otpSaved != $otp) {
        return ['status' => 'error', 'message' => 'Mã OTP không đúng.'];
    }

    // Nếu đúng, xóa OTP khỏi session sau khi sử dụng
    unset($_SESSION['otp'][$contact]);
    unset($_SESSION['otp_time'][$contact]);

    return ['status' => 'success', 'message' => 'Mã OTP hợp lệ.'];
}


function verifyOTPRegister($contact, $otp, $fullName, $username, $password, $role, $contactType) {
    $conn = connectDB();

    // Kiểm tra xem OTP có hợp lệ không
    $otpResult = checkOTP($contact, $otp);
    if ($otpResult['status'] !== 'success') {
        return $otpResult; // Trả về lỗi OTP thay vì tiếp tục tạo tài khoản
    }
    

    // Nếu OTP hợp lệ, tiến hành tạo tài khoản
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $fullName = $conn->real_escape_string($fullName);
    $sql = "INSERT INTO `accounts` (`full_name`, `username`, `$contactType`, `password`, `status`, `role_id`) 
            VALUES ('$fullName', '$username', '$contact', '$hashedPassword', 'active', '$role')";

    if ($conn->query($sql) === TRUE) {
        $conn->close();
        return ['status' => 'success', 'message' => 'Xác minh thành công! Tài khoản đã được tạo.'];
    } else {
        $conn->close();
        return ['status' => 'error', 'message' => 'Đã xảy ra lỗi khi tạo tài khoản.'];
    }
}


function updateProfile($id, $avatar, $fullName, $address) {
    $conn = connectDB();

    // Bảo vệ dữ liệu đầu vào để tránh SQL Injection
    $id = $conn->real_escape_string($id);
    $fullName = $conn->real_escape_string($fullName);
    $address = $conn->real_escape_string($address);
    $avatar = $conn->real_escape_string($avatar);

    // Kiểm tra xem tài khoản có tồn tại không
    $sql = "SELECT * FROM `accounts` WHERE `account_id` = '$id'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Cập nhật thông tin tài khoản
        $sql = "UPDATE `accounts` SET 
                `full_name` = '$fullName',
                `address` = '$address'";

        if (!empty($avatar)) {
        $sql .= ", `avatar` = '$avatar'";
        }

        $sql .= " WHERE `account_id` = '$id'";

        if ($conn->query($sql) === TRUE) {
            $conn->close();
            return ['status' => 'success', 'message' => 'Cập nhật thông tin thành công'];
        } else {
            $conn->close();
            return ['status' => 'error', 'message' => 'Đã xảy ra lỗi khi cập nhật tài khoản'];
        }
    } else {
        $conn->close();
        return ['status' => 'error', 'message' => 'Tài khoản không tồn tại'];
    }
}


function forgotPassword($userType, $username) {
    date_default_timezone_set('Asia/Ho_Chi_Minh');

    $conn = connectDB();

    // Bảo vệ dữ liệu đầu vào
    $username = $conn->real_escape_string($username);
    
    // Tạo câu truy vấn kiểm tra tài khoản
    $sql = "SELECT * FROM `accounts` WHERE `$userType` = '$username'";
    
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $account = $result->fetch_assoc();
        $accountId = $account['account_id'];

        // 🔥 Tạo token ngẫu nhiên
        $token = bin2hex(random_bytes(32));

        // ⏳ Lưu thời gian tạo token (hiện tại)
        $tokenCreatedAt = date("Y-m-d H:i:s");

        // Cập nhật token và thời gian vào database
        $updateQuery = "UPDATE `accounts` 
                        SET `reset_token` = '$token', `token_expiry` = '$tokenCreatedAt' 
                        WHERE `account_id` = '$accountId'";
        $conn->query($updateQuery);

        // Tạo link đặt lại mật khẩu
        $resetLink = "http://localhost:3000/reset-password/" . $token;

        // Gửi email hoặc SMS
        if ($userType === "email") {
            sendResetPasswordEmail($username, $resetLink);
        } else if ($userType === "phone_number") {
            sendResetPasswordSMS($username, $resetLink);
        }

        $conn->close();
        return [
            'status' => 'success',
            'message' => 'Đã gửi đường dẫn đặt lại mật khẩu vào thông tin liên lạc của bạn.'
        ];
    } else {
        // Không tìm thấy tài khoản
        $conn->close();
        return [
            'status' => 'error',
            'message' => 'Email hoặc số điện thoại không tồn tại.'
        ];
    }
}

function resetPassword($password, $token) {
    date_default_timezone_set('Asia/Ho_Chi_Minh');

    $conn = connectDB();

    // Kiểm tra xem token có hợp lệ không
    $token = $conn->real_escape_string($token);
    $sql = "SELECT * FROM `accounts` WHERE `reset_token` = '$token'";
    $result = $conn->query($sql);

    if ($result->num_rows === 0) {
        $conn->close();
        return ['status' => 'error', 'message' => 'Token không hợp lệ'];
    }

    // Lấy thông tin tài khoản
    $account = $result->fetch_assoc();
    $tokenCreatedAt = strtotime($account['token_expiry']); // Chuyển sang timestamp
    $currentTimestamp = time(); // Thời gian hiện tại

    // Kiểm tra thời gian hợp lệ (120 giây)
    if (($currentTimestamp - $tokenCreatedAt) > 120) {
        $conn->close();
        return ['status' => 'error', 'message' => 'Token đã hết hạn'];
    }

    // Mã hóa mật khẩu mới
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Cập nhật mật khẩu mới và xóa token
    $sqlUpdate = "UPDATE `accounts` 
                  SET `password` = '$hashedPassword', `reset_token` = NULL, `token_expiry` = NULL 
                  WHERE `reset_token` = '$token'";

    if ($conn->query($sqlUpdate) === TRUE) {
        $conn->close();
        return ['status' => 'success', 'message' => 'Mật khẩu đã được cập nhật thành công'];
    } else {
        $conn->close();
        return ['status' => 'error', 'message' => 'Lỗi cập nhật mật khẩu'];
    }
}

function updatePassword($accountId, $password, $newPassword, $otp) {
    date_default_timezone_set('Asia/Ho_Chi_Minh');

    $conn = connectDB();

    // Kiểm tra xem otp có hợp lệ không
    $otp = $conn->real_escape_string($otp);
    $sql = "SELECT * FROM `accounts` WHERE `reset_token` = '$otp'";
    $result = $conn->query($sql);

    if ($result->num_rows === 0) {
        $conn->close();
        return ['status' => 'error', 'message' => 'OTP không hợp lệ'];
    }

    // Lấy thông tin tài khoản
    $account = $result->fetch_assoc();
    $otpCreatedAt = strtotime($account['token_expiry']); // Chuyển sang timestamp
    $currentTimestamp = time(); // Thời gian hiện tại

    // Kiểm tra thời gian hợp lệ (120 giây)
    if (($currentTimestamp - $otpCreatedAt) > 120) {
        $conn->close();
        return ['status' => 'error', 'message' => 'OTP đã hết hạn'];
    }

    // Lấy mật khẩu đã băm từ database
    $sql = "SELECT `password` FROM `accounts` WHERE `account_id` = '$accountId' AND `reset_token` = '$otp'";
    $result = $conn->query($sql);

    if ($result->num_rows === 0) {
        $conn->close();
        return ['status' => 'error', 'message' => 'Lấy mật khẩu thất bại'];
    }

    $storedPassword = $account['password']; // Mật khẩu đã lưu trong DB

    // Kiểm tra mật khẩu nhập vào có đúng không
    if (!password_verify($password, $storedPassword)) {
        $conn->close();
        return ['status' => 'error', 'message' => 'Mật khẩu cũ không đúng'];
    }

    // Mã hóa mật khẩu mới
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

    // Cập nhật mật khẩu mới và xóa token
    $sqlUpdate = "UPDATE `accounts` 
                  SET `password` = '$hashedPassword', `reset_token` = NULL, `token_expiry` = NULL 
                  WHERE `account_id` = '$accountId' AND `reset_token` = '$otp'";

    if ($conn->query($sqlUpdate) === TRUE) {
        $conn->close();
        return ['status' => 'success', 'message' => 'Mật khẩu đã được cập nhật thành công'];
    } else {
        $conn->close();
        return ['status' => 'error', 'message' => 'Lỗi cập nhật mật khẩu'];
    }
}

// Hàm kiểm tra email có đúng với account_id không, nếu đúng thì gửi OTP
function verifyEmailAndSendOTP($accountId, $email) {
    date_default_timezone_set('Asia/Ho_Chi_Minh');

    $conn = connectDB();

    // Truy vấn kiểm tra email có khớp với account_id không
    $sql = "SELECT email FROM accounts WHERE account_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $accountId);
    $stmt->execute();
    $stmt->bind_result($storedEmail);
    $stmt->fetch();
    $stmt->close();

    if ($storedEmail === $email) {
        // Tạo mã OTP 6 số
        $otp = rand(100000, 999999);
        $expiry = date("Y-m-d H:i:s");

        // ✅ SỬA: Sử dụng UPDATE thay vì INSERT
        $updateOTPQuery = "UPDATE accounts SET reset_token = ?, token_expiry = ? WHERE account_id = ?";
        $stmt = $conn->prepare($updateOTPQuery);
        $stmt->bind_param("ssi", $otp, $expiry, $accountId);
        $stmt->execute();
        $stmt->close();

        // Gửi OTP qua email
        if (sendOTPEmail($email, $otp)) {
            $conn->close();
            return ['status' => 'success', 'message' => 'Mã OTP đã được gửi đến email của bạn.'];
        } else {
            $conn->close();
            return ['status' => 'error', 'message' => 'Không thể gửi email, vui lòng thử lại.'];
        }
    } else {
        $conn->close();
        return ['status' => 'error', 'message' => 'Email không khớp với tài khoản.'];
    }
}


function fetchDataFromTable($tableName) {
    $conn = connectDB();
    
    $tableName = $conn->real_escape_string($tableName);
    
    $sql = "SELECT * FROM `$tableName`";
    
    $result = $conn->query($sql);

    $data = [];
    
    if($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    
    $conn->close();

    return $data;
}

function fetchDataById($tableName, $columnName, $id, $fetchType = 'single') {
    $conn = connectDB();
    
    // Bảo vệ tên bảng và ID
    $tableName = $conn->real_escape_string($tableName);
    $id = intval($id); // Chuyển ID thành số nguyên để tránh SQL Injection
    $columnName = $conn->real_escape_string($columnName); // Bảo vệ tên cột (column name)

    // Tạo câu lệnh SQL linh hoạt dựa vào tên cột và ID
    $sql = "SELECT * FROM `$tableName` WHERE `$columnName` = $id";
    
    $result = $conn->query($sql);

    $data = [];

    if ($fetchType === 'single') {
        // Trả về 1 bản ghi duy nhất
        if ($result->num_rows > 0) {
            $data = $result->fetch_assoc();
        }
    } elseif ($fetchType === 'all') {
        // Trả về tất cả bản ghi
        if ($result->num_rows > 0) {
            $data = $result->fetch_all(MYSQLI_ASSOC);
        }
    }
    
    $conn->close();

    return $data;
}

function fetchDataColumnById($columnName, $tableName, $condition, $id) {
    $conn = connectDB();

    // Tạo câu lệnh SQL linh hoạt dựa vào tên cột và ID
    $sql = "SELECT `$columnName` FROM `$tableName` WHERE `$condition` = $id";
    
    $result = $conn->query($sql);

    $data = null;

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $data = $row[$columnName]; // Trả về đúng giá trị của cột
    }
    
    $conn->close();

    return $data;
}

function countCartItems($accountId) {
    $conn = connectDB();

    // Tạo câu lệnh SQL linh hoạt dựa vào tên cột và account_id
    $sql = "SELECT COUNT(*) as count FROM `cart` WHERE `account_id` = $accountId";
    
    $result = $conn->query($sql);

    $count = 0;

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $count = $row['count'];
    }
    
    $conn->close();

    return $count;
}


function fetchDefaultImage($id) {
    $conn = connectDB();

    // Tạo câu lệnh SQL linh hoạt dựa vào tên cột và ID
    $sql = "SELECT * FROM `product_images` WHERE `product_id` = $id AND `is_default` = 1";
    
    $result = $conn->query($sql);

    $data = '';

    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
    }
    
    $conn->close();

    return $data;
}

function addToCart($accountId, $productId, $colorId, $sizeId, $quantity) {

    $conn = connectDB();

    // Tìm thông tin chi tiết sản phẩm
    $sql = "SELECT * FROM `product_details` WHERE `product_id` = '$productId' AND `color_id` = '$colorId' AND `size_id` = '$sizeId'";
    $result = $conn->query($sql);

    $response = [];

    if ($result->num_rows > 0) {
        $product = $result->fetch_assoc();
        $productDetailId = $product['product_detail_id'];

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        $sqlCheckCart = "SELECT * FROM `cart` WHERE `account_id` = '$accountId' AND `product_detail_id` = '$productDetailId'";
        $resultCheckCart = $conn->query($sqlCheckCart);

        if ($resultCheckCart->num_rows > 0) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng
            $sqlUpdate = "UPDATE `cart` SET `purchase_quantity` = `purchase_quantity` + '$quantity' WHERE `account_id` = '$accountId' AND `product_detail_id` = '$productDetailId'";
            if ($conn->query($sqlUpdate) === TRUE) {
                $response['status'] = 'success';
                $response['message'] = 'Cập nhật số lượng thành công';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'error: ' . $sqlUpdate . ' - ' . $conn->error;
            }
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
            $sqlInsert = "INSERT INTO cart(`account_id`, `product_detail_id`, `purchase_quantity`) VALUES('$accountId', '$productDetailId', '$quantity')";
            if ($conn->query($sqlInsert) === TRUE) {
                $response['status'] = 'success';
                $response['message'] = 'Thêm sản phẩm thành công';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'error: ' . $sqlInsert . ' - ' . $conn->error;
            }
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Không tìm thấy sản phẩm!';
    }

    $conn->close();
    return json_encode($response);
}

function getProducts() {
    $conn = connectDB();
    $data = [];

    $sql = "SELECT 
            p.product_id, 
            p.category_id,
            pc.category_name, 
            p.subcategory_id,
            psc.subcategory_name,
            p.product_name,
            p.price, 
            p.sale,
            p.sale_price,
            p.sold_quantity_sum,
            p.average_rating,
            p.description,
            pi.image AS image_url,
            pi.is_default
        FROM products p
        LEFT JOIN product_images pi 
            ON p.product_id = pi.product_id AND pi.is_default = 1
        LEFT JOIN product_categories pc 
            ON p.category_id = pc.category_id
        LEFT JOIN product_subcategories psc 
            ON p.subcategory_id = psc.subcategory_id;
        ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    $conn->close();
    return $data; // Trả về mảng thay vì JSON string
}

function getProductBuyNow($productId, $colorId, $sizeId) {
    $conn = connectDB();

    // Tìm thông tin chi tiết sản phẩm
    $sql = "SELECT 
                pd.product_detail_id, 
                p.product_id,
                p.product_name,
                p.price, 
                p.sale_price,
                pd.quantity,
                pd.color_id, 
                pc.color_name, 
                pd.size_id, 
                ps.size_name,
                pi.image AS image_url
            FROM product_details pd
            LEFT JOIN products p ON pd.product_id = p.product_id
            LEFT JOIN product_colors pc ON pd.color_id = pc.color_id
            LEFT JOIN product_sizes ps ON pd.size_id = ps.size_id
            LEFT JOIN product_images pi ON pd.product_id = pi.product_id AND pi.is_default = 1
            WHERE pd.product_id = '$productId' AND pd.color_id = '$colorId' AND pd.size_id = '$sizeId'";

    $result = $conn->query($sql);
    $response = [];

    if ($result->num_rows > 0) {
        $product = $result->fetch_assoc();

        $response['status'] = 'success';
        $response['message'] = 'Lấy sản phẩm thành công!';
        $response['data'] = $product;
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Không tìm thấy sản phẩm!';
    }

    $conn->close();
    return json_encode($response);
}


function getFullProductData($accountId) {
    $conn = connectDB();
    $data = [];

    $sql = "SELECT 
                c.cart_id, 
                c.product_detail_id, 
                c.purchase_quantity, 
                pd.product_id,
                p.product_name,
                p.price, 
                p.sale_price,
                pd.quantity,
                pd.color_id, 
                pc.color_name, 
                pd.size_id, 
                ps.size_name,
                pi.image AS image_url
            FROM cart c
            LEFT JOIN product_details pd ON c.product_detail_id = pd.product_detail_id
            LEFT JOIN products p ON pd.product_id = p.product_id
            LEFT JOIN product_colors pc ON pd.color_id = pc.color_id
            LEFT JOIN product_sizes ps ON pd.size_id = ps.size_id
            LEFT JOIN product_images pi ON pd.product_id = pi.product_id AND pi.is_default = 1
            WHERE c.account_id = '$accountId'";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    $conn->close();
    return $data; // Trả về mảng thay vì JSON string
}


function updateCartQuantity($cartId, $newQuantity) {
    $conn = connectDB();

    // Tìm thông tin chi tiết sản phẩm
    $sql = "SELECT * FROM `cart` WHERE `cart_id` = '$cartId'";
    $result = $conn->query($sql);

    $response = array();

    if ($result->num_rows > 0) {
        // Cập nhật số lượng sản phẩm
        $sqlUpdate = "UPDATE `cart` SET `purchase_quantity` = '$newQuantity' WHERE `cart_id` = '$cartId'";
        if ($conn->query($sqlUpdate) === TRUE) {
            $response['status'] = 'success';
            $response['message'] = 'Số lượng sản phẩm đã được cập nhật thành công!';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Lỗi trong quá trình cập nhật!';
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Không tìm thấy sản phẩm trong giỏ hàng!';
    }

    $conn->close();
    return json_encode($response);
}

function removeProductFromCart($accountId, $productDetailId) {
    $conn = connectDB();
    $response = array();

    // Thực hiện lệnh xóa
    $sqlDelete = "DELETE FROM `cart` WHERE `account_id` = '$accountId' AND `product_detail_id` = '$productDetailId'";
    if ($conn->query($sqlDelete) === TRUE) {
        $response['status'] = 'success';
        $response['message'] = 'Sản phẩm đã được xóa khỏi giỏ hàng thành công!';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Lỗi trong quá trình xóa sản phẩm: ' . $conn->error;
    }

    $conn->close();
    return json_encode($response);
}

function fetchAddresses($accountId) {
    $conn = connectDB();
    $sql = "SELECT * FROM `shipping_addresses` WHERE `account_id` = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $accountId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $addresses = $result->fetch_all(MYSQLI_ASSOC);
    
    $stmt->close();
    $conn->close();
    
    if (count($addresses) > 0) {
        return [
            'status' => 'success',
            'data' => $addresses
        ];
    } else {
        return [
            'status' => 'error',
            'message' => 'Không tìm thấy địa chỉ nào!'
        ];
    }
}

function addAddress($accountId, $contactName, $contactPhone, $address, $addressDetails, $addressDefault) {
    $conn = connectDB();
    $sql = "INSERT INTO `shipping_addresses` (`account_id`, `contact_name`, `contact_phone`, `address`, `address_details`, `address_default`) 
            VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issssi", $accountId, $contactName, $contactPhone, $address, $addressDetails, $addressDefault);

    if ($stmt->execute()) {
        $response = [
            'message' => 'Địa chỉ đã được thêm thành công!'
        ];
    } else {
        $response = [
            'message' => 'Lỗi trong quá trình thêm địa chỉ!',
        ];
    }

    $stmt->close();
    $conn->close();

    return json_encode($response);
}

function updateAddress($accountId, $addressId, $contactName, $contactPhone, $address, $addressDetails, $addressDefault) {
    $conn = connectDB();

    // Nếu đặt làm mặc định, reset tất cả địa chỉ khác của account đó về 0
    if ($addressDefault == 1) {
        $resetSql = "UPDATE `shipping_addresses` SET `address_default` = 0 WHERE `account_id` = ?";
        $resetStmt = $conn->prepare($resetSql);
        $resetStmt->bind_param("i", $accountId);
        $resetStmt->execute();
        $resetStmt->close();
    }

    // Cập nhật địa chỉ
    $sql = "UPDATE `shipping_addresses` 
            SET `contact_name` = ?, `contact_phone` = ?, `address` = ?, `address_details` = ?, `address_default` = ? 
            WHERE `address_id` = ? AND `account_id` = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssiii", $contactName, $contactPhone, $address, $addressDetails, $addressDefault, $addressId, $accountId);
    
    $response = [
        'status' => $stmt->execute() ? 'success' : 'error',
        'message' => $stmt->affected_rows > 0 ? 'Địa chỉ đã được cập nhật thành công!' : 'Lỗi trong quá trình cập nhật hoặc không có thay đổi!',
    ];
    
    $stmt->close();
    $conn->close();
    
    return json_encode($response);
}
function deleteAddress($addressId, $accountId) {
    $conn = connectDB();
    
    // Xóa địa chỉ
    $sql = "DELETE FROM `shipping_addresses` WHERE `address_id` = ? AND `account_id` = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $addressId, $accountId);

    // Thực thi câu lệnh SQL
    $executionResult = $stmt->execute();

    // Xây dựng phản hồi dựa trên kết quả thực thi
    if ($executionResult) {
        if ($stmt->affected_rows > 0) {
            $response = [
                'status' => 'success',
                'message' => 'Địa chỉ đã được xóa thành công!',
            ];
        } else {
            $response = [
                'status' => 'error',
                'message' => 'Địa chỉ không tồn tại hoặc!',
            ];
        }
    } else {
        $response = [
            'status' => 'error',
            'message' => 'Lỗi trong quá trình xóa!',
        ];
    }
    
    // Đóng kết nối và trả về phản hồi dưới dạng JSON
    $stmt->close();
    $conn->close();
    
    return json_encode($response);
}

function setDefaultAddress($accountId, $addressId) {
    $conn = connectDB();

    // Bước 1: Reset tất cả địa chỉ của account_id về 0
    $resetSql = "UPDATE `shipping_addresses` SET `address_default` = 0 WHERE `account_id` = ?";
    $resetStmt = $conn->prepare($resetSql);
    $resetStmt->bind_param("i", $accountId);
    $resetStmt->execute();
    $resetStmt->close();

    // Bước 2: Đặt địa chỉ mới làm mặc định
    $updateSql = "UPDATE `shipping_addresses` SET `address_default` = 1 WHERE `address_id` = ? AND `account_id` = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("ii", $addressId, $accountId);
    $executeSuccess = $updateStmt->execute();

    if ($executeSuccess) {
        if ($updateStmt->affected_rows > 0) {
            $response = [
                'status' => 'success',
                'message' => 'Đã cập nhật địa chỉ mặc định!',
            ];
        } else {
            $response = [
                'status' => 'error',
                'message' => 'Không tìm thấy địa chỉ hoặc cập nhật thất bại!',
            ];
        }
    } else {
        $response = [
            'status' => 'error',
            'message' => 'Lỗi trong quá trình thực hiện truy vấn!',
        ];
    }

    $updateStmt->close();
    $conn->close();


    return json_encode($response);
}


function fetchDiscountCodes() {
    $conn = connectDB();
    $sql = "SELECT * FROM `discount_codes`";

    $result = $conn->query($sql);
    $discountCodes = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $discountCodes[] = $row; // Lưu từng bản ghi vào mảng
        }
    } 
    return $discountCodes;
}

function addInvoices($invoiceId, $accountId, $orderDate, $itemTotal, $discount, $AmountSum, $paymentStatus, $shippingInformation, $status) {
    $conn = connectDB();
    $sql = "INSERT INTO `invoices` (`invoice_id`, `account_id`, `order_date`, `item_total`, `discount`, `amount_sum`, `payment_status`, `shipping_information`, `status`) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iisiddsss", $invoiceId, $accountId, $orderDate, $itemTotal, $discount, $AmountSum, $paymentStatus, $shippingInformation, $status);

    if ($stmt->execute()) {
        $response = [
            'message' => 'Đơn hàng đã được thêm thành công!'
        ];
    } else {
        $response = [
            'message' => 'Lỗi trong quá trình thêm đơn hàng!',
        ];
    }

    $stmt->close();
    $conn->close();

    return json_encode($response);
}

function decreaseProductStock($conn, $productDetailId, $purchaseQuantity) {
    $updateSql = "UPDATE `product_details` 
                  SET `quantity` = `quantity` - ?, 
                      `sold_quantity` = `sold_quantity` + ? 
                  WHERE `product_detail_id` = ? AND `quantity` >= ?";

    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("iiii", $purchaseQuantity, $purchaseQuantity, $productDetailId, $purchaseQuantity);

    if ($updateStmt->execute() && $updateStmt->affected_rows > 0) {
        $updateStmt->close();
        return ['success' => true];
    } else {
        $updateStmt->close();
        return ['success' => false, 'message' => 'Lỗi giảm số lượng hoặc số lượng không đủ!'];
    }
}

function updateQuantityDiscount($discountId) {
    $conn = connectDB();
    $updateSql = "UPDATE `discount_codes` 
                  SET `quantity` = `quantity` - 1
                  WHERE `discount_id` = ?";

    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("i", $discountId);

    if ($updateStmt->execute()) {
        $updateStmt->close();
        return ['success' => true];
    } else {
        $updateStmt->close();
        return ['success' => false, 'message' => 'Lỗi khi cập nhật số lượng mã giảm giá'];
    }
}


function increaseProductStock($conn, $productDetailId, $returnQuantity) {
    $updateSql = "UPDATE `product_details` 
                  SET `quantity` = `quantity` + ?, 
                      `sold_quantity` = `sold_quantity` - ? 
                  WHERE `product_detail_id` = ? AND `sold_quantity` >= ?";

    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("iiii", $returnQuantity, $returnQuantity, $productDetailId, $returnQuantity);

    if ($updateStmt->execute() && $updateStmt->affected_rows > 0) {
        $updateStmt->close();
        return ['success' => true];
    } else {
        $updateStmt->close();
        return ['success' => false, 'message' => 'Lỗi tăng số lượng hoặc số lượng đã bán không đủ!'];
    }
}

function restoreStockOnCancel($invoiceId) {
    $conn = connectDB();

    // Truy vấn để lấy product_detail_id và purchase_quantity từ invoice_details
    $query = "SELECT product_detail_id, purchase_quantity FROM invoice_details WHERE invoice_id = ?";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        $conn->close();
        return ['success' => false, 'message' => 'Error preparing statement: ' . $conn->error];
    }

    $stmt->bind_param("s", $invoiceId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        $conn->close();
        return ['success' => false, 'message' => 'No invoice details found for invoice_id: ' . $invoiceId];
    }

    $success = true;
    $errorMessage = '';

    // Lặp qua từng chi tiết hóa đơn để tăng số lượng tồn kho
    while ($row = $result->fetch_assoc()) {
        $productDetailId = $row['product_detail_id'];
        $purchaseQuantity = $row['purchase_quantity'];

        // Gọi hàm increaseProductStock để tăng số lượng tồn kho
        $stockResult = increaseProductStock($conn, $productDetailId, $purchaseQuantity);

        if (!$stockResult['success']) {
            $success = false;
            $errorMessage .= $stockResult['message'] . ' (product_detail_id: ' . $productDetailId . '); ';
        }
    }

    $stmt->close();
    $conn->close();

    if ($success) {
        return ['success' => true, 'message' => 'Stock restored successfully for invoice_id: ' . $invoiceId];
    } else {
        return ['success' => false, 'message' => 'Failed to restore stock: ' . $errorMessage];
    }
}

function removeFromCart($conn, $productDetailId) {
    $sql = "DELETE FROM `cart` WHERE `product_detail_id` = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $productDetailId);

    if ($stmt->execute()) {
        return ['success' => true, 'message' => 'Sản phẩm đã được xóa khỏi giỏ hàng.'];
    } else {
        return ['success' => false, 'message' => 'Lỗi khi xóa sản phẩm khỏi giỏ hàng!'];
    }
}


function addInvoiceDetails($invoiceId, $productId, $productDetailId, $productName, $productColor, $productSize, $purchaseQuantity, $price, $salePrice) {
    $conn = connectDB();

    // Bắt đầu transaction để đảm bảo dữ liệu đồng bộ
    $conn->begin_transaction();

    try {
        // Thêm chi tiết đơn hàng vào bảng invoice_details
        $sql = "INSERT INTO `invoice_details` (`invoice_id`, `product_id`, `product_detail_id`, `product_name`, `product_color`, `product_size`, `purchase_quantity`, `price`, `sale_price`) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iiisssidd", $invoiceId, $productId, $productDetailId, $productName, $productColor, $productSize, $purchaseQuantity, $price, $salePrice);

        if (!$stmt->execute()) {
            throw new Exception("Lỗi khi thêm chi tiết đơn hàng!");
        }

        // Cập nhật số lượng tồn kho
        $updateResult = decreaseProductStock($conn, $productDetailId, $purchaseQuantity);
        if (!$updateResult['success']) {
            throw new Exception($updateResult['message']);
        }

        // Xóa sản phẩm khỏi giỏ hàng sau khi thêm vào invoice_details thành công
        $removeResult = removeFromCart($conn, $productDetailId);
        if (!$removeResult['success']) {
            throw new Exception($removeResult['message']);
        }

        // Commit transaction nếu mọi thứ thành công
        $conn->commit();

        $response = ['message' => 'Chi tiết đơn hàng đã được thêm, số lượng sản phẩm đã cập nhật và sản phẩm đã bị xóa khỏi giỏ hàng!'];
    } catch (Exception $e) {
        $conn->rollback(); // Hoàn tác nếu có lỗi xảy ra
        $response = [
            'message' => $e->getMessage()
        ];
    }

    $stmt->close();
    $conn->close();

    return json_encode($response);
}


function updatePaymentStatus($invoiceId, $status) {
    $conn = connectDB();
    $updateSql = "UPDATE `invoices` 
                  SET `payment_status` = ?
                  WHERE `invoice_id` = ?";

    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("si", $status, $invoiceId);

    if ($updateStmt->execute()) {
        $updateStmt->close();
        return ['success' => true];
    } else {
        $updateStmt->close();
        return ['success' => false, 'message' => 'Lỗi giảm số lượng hoặc số lượng không đủ!'];
    }
}

function updateOrderStatusAfterPayment($invoiceId, $status) {
    $conn = connectDB();
    $updateSql = "UPDATE `invoices` 
                  SET `status` = ?
                  WHERE `invoice_id` = ?";

    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("si", $status, $invoiceId);

    if ($updateStmt->execute()) {
        $updateStmt->close();
        return ['success' => true];
    } else {
        $updateStmt->close();
        return ['success' => false, 'message' => 'Cập nhật trạng thái đơn hàng thất bại!'];
    }
}

function createContact($accountId, $fullName, $email, $subject, $message) {
    $conn = connectDB();

    if (!$conn) {
        return json_encode(['status' => 'error', 'message' => 'Lỗi kết nối database']);
    }

    // Sử dụng prepared statement để tránh SQL Injection
    $sql = "INSERT INTO `contacts` (`account_id`, `full_name`, `email`, `subject`, `message`) 
            VALUES (?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        return json_encode(['status' => 'error', 'message' => 'Lỗi SQL']);
    }

    $stmt->bind_param("issss", $accountId, $fullName, $email, $subject, $message);
    
    if ($stmt->execute()) {
        $stmt->close();
        $conn->close();
        return json_encode(['status' => 'success', 'message' => 'Tạo liên hệ thành công']);
    } else {
        $stmt->close();
        $conn->close();
        return json_encode(['status' => 'error', 'message' => 'Đã xảy ra lỗi, vui lòng thử lại']);
    }
}

function fetchNotifications() {
    $conn = connectDB();
    $sql = "SELECT * FROM `notifications`";

    $result = $conn->query($sql);
    $notifications = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $notifications[] = $row; // Lưu từng bản ghi vào mảng
        }
    } 
    return $notifications;
}

function getInvoices($account_id) {
    $conn = connectDB();
    $data = [];

    $sql = "SELECT 
            i.invoice_id, 
            i.account_id, 
            a.full_name, 
            i.order_date, 
            i.item_total, 
            i.discount, 
            i.amount_sum, 
            i.payment_status, 
            i.shipping_information, 
            i.status
        FROM invoices i
        LEFT JOIN accounts a 
            ON i.account_id = a.account_id
        WHERE i.account_id = ?";

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Bind tham số account_id
    $stmt->bind_param("i", $account_id);

    try {
        // Thực thi câu lệnh SQL
        $stmt->execute();
        $result = $stmt->get_result();

        // Lưu từng dòng dữ liệu vào mảng $data
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    } finally {
        // Đóng statement và kết nối
        $stmt->close();
        $conn->close();
    }

    return $data; // Trả về mảng chứa các hóa đơn của user
}

function getInvoiceDetails($invoice_id) {
    $conn = connectDB();
    $data = [];

    // Câu truy vấn để lấy thông tin hóa đơn và các chi tiết liên quan
    $sql = "SELECT 
                i.invoice_id, 
                i.account_id, 
                a.full_name, 
                i.order_date, 
                i.item_total, 
                i.discount, 
                i.amount_sum, 
                i.payment_status, 
                i.shipping_information, 
                i.status,
                id.invoice_detail_id,
                id.product_name,
                id.product_color,
                id.product_size,
                id.purchase_quantity,
                id.price,
                id.sale_price
            FROM invoices i
            LEFT JOIN accounts a 
                ON i.account_id = a.account_id
            LEFT JOIN invoice_details id 
                ON i.invoice_id = id.invoice_id
            WHERE i.invoice_id = ?";

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Bind tham số invoice_id
    $stmt->bind_param("i", $invoice_id);

    try {
        // Thực thi câu lệnh SQL
        $stmt->execute();
        $result = $stmt->get_result();

        // Lưu từng dòng dữ liệu vào mảng $data
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    } finally {
        // Đóng statement và kết nối
        $stmt->close();
        $conn->close();
    }

    return $data; // Trả về mảng chi tiết hóa đơn
}

function updateInvoiceStatus($invoiceId, $status) {
    // Kết nối đến cơ sở dữ liệu
    $conn = connectDB();

    // Cập nhật trạng thái hóa đơn
    $query = "UPDATE invoices SET status = ? WHERE invoice_id = ?";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die(json_encode(["status" => "error", "message" => $conn->error]));
    }
    $stmt->bind_param("si", $status, $invoiceId);
    $stmt->execute();
    $affectedRows = $stmt->affected_rows;
    $stmt->close();

    if ($affectedRows > 0 && $status === "completed") {
        // Lấy danh sách product_id từ invoice_details
        $query = "SELECT product_id FROM invoice_details WHERE invoice_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $invoiceId);
        $stmt->execute();
        $result = $stmt->get_result();

        // Chèn product_id vào bảng pending_ratings
        $insertQuery = "INSERT INTO pending_ratings (account_id, product_id, invoice_id) VALUES (?, ?, ?)";
        $stmtInsert = $conn->prepare($insertQuery);

        while ($row = $result->fetch_assoc()) {
            $productId = $row['product_id'];

            // Lấy account_id từ invoices
            $queryAccount = "SELECT account_id FROM invoices WHERE invoice_id = ?";
            $stmtAccount = $conn->prepare($queryAccount);
            $stmtAccount->bind_param("i", $invoiceId);
            $stmtAccount->execute();
            $resultAccount = $stmtAccount->get_result();
            $accountId = $resultAccount->fetch_assoc()['account_id'];
            $stmtAccount->close();

            // Chèn từng sản phẩm vào pending_ratings
            $stmtInsert->bind_param("iii", $accountId, $productId, $invoiceId);
            $stmtInsert->execute();
        }

        $stmtInsert->close();
    }

    $conn->close();

    return json_encode(["status" => "success", "message" => "Cập nhật trạng thái hóa đơn thành công"]);
}


function getPendingRatings($account_id) {
    $conn = connectDB();
    $data = [];

    // Câu truy vấn để lấy danh sách sản phẩm chờ đánh giá của tài khoản
    $sql = "SELECT 
                pr.pending_rating_id,
                pr.invoice_id,
                pr.created_at,
                p.product_id,
                p.product_name,
                pi.image, 
                p.price
            FROM pending_ratings pr
            JOIN products p ON pr.product_id = p.product_id
            LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_default = 1
            WHERE pr.account_id = ?";

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Gán tham số account_id
    $stmt->bind_param("i", $account_id);

    try {
        // Thực thi câu lệnh SQL
        $stmt->execute();
        $result = $stmt->get_result();

        // Lưu từng dòng dữ liệu vào mảng $data
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    } finally {
        // Đóng statement và kết nối
        $stmt->close();
        $conn->close();
    }

    return $data; // Trả về danh sách sản phẩm chờ đánh giá
}

function addProductRating($account_id, $product_id, $rating) {
    $conn = connectDB();
    $response = [];

    // Câu truy vấn để thêm đánh giá vào bảng product_ratings
    $sql = "INSERT INTO product_ratings (account_id, product_id, rating, created_at) 
            VALUES (?, ?, ?, NOW())";

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Gán tham số cho câu truy vấn
    $stmt->bind_param("iii", $account_id, $product_id, $rating);

    try {
        // Thực thi câu lệnh SQL
        if ($stmt->execute()) {
            $response = [
                "status" => "success",
                "message" => "Đánh giá đã được thêm thành công"
            ];
        } else {
            $response = [
                "status" => "error",
                "message" => "Không thể thêm đánh giá"
            ];
        }
    } catch (Exception $e) {
        $response = [
            "status" => "error",
            "message" => "Đã xảy ra lỗi: " . $e->getMessage()
        ];
    } finally {
        // Đóng statement và kết nối
        $stmt->close();
        $conn->close();
    }

    return $response; // Trả về phản hồi
}

function deletePendingRating($account_id, $product_id, $invoice_id) {
    $conn = connectDB();
    $response = [];

    // Câu truy vấn để xóa bản ghi trong pending_ratings
    $sql = "DELETE FROM pending_ratings WHERE account_id = ? AND product_id = ? AND invoice_id = ?";

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Gán tham số cho câu truy vấn
    $stmt->bind_param("iii", $account_id, $product_id, $invoice_id);

    try {
        // Thực thi câu lệnh SQL
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                $response = [
                    "status" => "success",
                    "message" => "Bản ghi trong pending_ratings đã được xóa thành công"
                ];
            } else {
                $response = [
                    "status" => "success",
                    "message" => "Không tìm thấy bản ghi để xóa trong pending_ratings"
                ];
            }
        } else {
            $response = [
                "status" => "error",
                "message" => "Không thể xóa bản ghi trong pending_ratings"
            ];
        }
    } catch (Exception $e) {
        $response = [
            "status" => "error",
            "message" => "Đã xảy ra lỗi: " . $e->getMessage()
        ];
    } finally {
        // Đóng statement và kết nối
        $stmt->close();
        $conn->close();
    }

    return $response; // Trả về phản hồi
}

function getEmailByAccountId($account_id) {
    $conn = connectDB();
    $email = null; // Khởi tạo biến email

    $sql = "SELECT full_name, email FROM accounts WHERE account_id = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Gán tham số account_id
    $stmt->bind_param("i", $account_id);

    try {
        // Thực thi câu lệnh SQL
        $stmt->execute();
        $result = $stmt->get_result();

        // Lấy email duy nhất
        if ($row = $result->fetch_assoc()) {
            $email = $row['email'];
        }
    } finally {
        // Đóng statement và kết nối
        $stmt->close();
        $conn->close();
    }

    return $email; // Trả về email
}

function getPhoneNumberByAccountId($account_id) {
    $conn = connectDB();
    $phone_number = null; // Khởi tạo biến phone_number

    $sql = "SELECT phone_number FROM accounts WHERE account_id = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Gán tham số account_id
    $stmt->bind_param("i", $account_id);

    try {
        // Thực thi câu lệnh SQL
        $stmt->execute();
        $result = $stmt->get_result();

        // Lấy phone_number duy nhất
        if ($row = $result->fetch_assoc()) {
            $phone_number = $row['phone_number'];
        }
    } finally {
        // Đóng statement và kết nối
        $stmt->close();
        $conn->close();
    }

    return $phone_number; // Trả về phone_number
}

function verifyAccountAndSendOTP($account_id, $contact) {
    $conn = connectDB();

    // Kiểm tra xem account_id có tồn tại không
    $sql = "SELECT email, phone_number FROM accounts WHERE account_id = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        return ["status" => "error", "message" => "Lỗi chuẩn bị truy vấn: " . $conn->error];
    }

    $stmt->bind_param("i", $account_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    $stmt->close();
    $conn->close();

    if (!$user) {
        return ["status" => "error", "message" => "Tài khoản không tồn tại."];
    }

    // Xác định kiểu xác minh (email hoặc phone)
    if ($contact === $user['email']) {
        $sent = sendVerificationCode($contact, 'email');
        return $sent 
            ? ["status" => "success", "message" => "Mã OTP đã được gửi đến email của bạn"]
            : ["status" => "error", "message" => "Lỗi khi gửi email."];
    } elseif ($contact === $user['phone_number']) {
        $sent = sendVerificationCode($contact, 'phone_number');
        return $sent 
            ? ["status" => "success", "message" => "Mã OTP đã được gửi đến số điện thoại của bạn"]
            : ["status" => "error", "message" => "Lỗi khi gửi SMS."];
    } else {
        return ["status" => "error", "message" => "Thông tin không khớp."];
    }
}

function verifyOTPBeforeUpdate($contact, $otp) {
    // Gọi hàm checkOTP để xác minh
    $otpResult = checkOTP($contact, $otp);
    
    // Trả về kết quả xác minh
    return $otpResult;
}



function updateEmail($accountId, $newEmail) {
    $conn = connectDB();

    // Escape dữ liệu để tránh SQL Injection
    $newEmail = $conn->real_escape_string($newEmail);

    // Cập nhật email trong bảng accounts
    $sql = "UPDATE accounts SET email = '$newEmail' WHERE account_id = '$accountId'";

    if ($conn->query($sql) === TRUE) {
        $conn->close();
        return ['status' => 'success', 'message' => 'Email đã được cập nhật thành công'];
    } else {
        $conn->close();
        return ['status' => 'error', 'message' => 'Lỗi khi cập nhật email. Vui lòng thử lại.'];
    }
}

function updatePhoneNumber($accountId, $newPhoneNumber) {
    $conn = connectDB();

    // Escape dữ liệu để tránh SQL Injection
    $newPhoneNumber = $conn->real_escape_string($newPhoneNumber);

    // Cập nhật số điện thoại trong bảng accounts
    $sql = "UPDATE accounts SET phone_number = '$newPhoneNumber' WHERE account_id = '$accountId'";

    if ($conn->query($sql) === TRUE) {
        $conn->close();
        return ['status' => 'success', 'message' => 'Số điện thoại đã được cập nhật thành công'];
    } else {
        $conn->close();
        return ['status' => 'error', 'message' => 'Lỗi khi cập nhật số điện thoại. Vui lòng thử lại.'];
    }
}



?>