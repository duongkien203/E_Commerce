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

function createAccount($fullName, $username, $password, $role) {
    $conn = connectDB(); // Giả sử connectDB() trả về đối tượng kết nối mysqli

    // Kiểm tra xem username đã tồn tại chưa
    $username = $conn->real_escape_string($username);
    $sqlCheckUsername = "SELECT * FROM `accounts` WHERE `username` = '$username'";
    $resultUsername = $conn->query($sqlCheckUsername);

    if ($resultUsername->num_rows > 0) {
        $conn->close();
        return ['status' => 'error', 'message' => 'Tên đăng nhập đã tồn tại'];
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $fullName = $conn->real_escape_string($fullName);

    $sql = "INSERT INTO `accounts` (`full_name`, `username`, `password`, `status`, `role_id`) 
                VALUES ('$fullName', '$username', '$hashedPassword', 'active', '$role')";

    if ($conn->query($sql) === TRUE) {
        $conn->close();
        return ['status' => 'success', 'message' => 'Tài khoản đã được tạo thành công'];
    } else {
        $conn->close();
        return ['status' => 'error', 'message' => 'Lỗi tạo tài khoản: ' . $conn->error];
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
        $resetLink = "http://localhost:3000/admin/reset-password/" . $token;

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

function getRevenueByYear() {
    $conn = connectDB();
    
    $query = "SELECT YEAR(order_date) AS year, SUM(amount_sum) AS total_revenue
              FROM invoices
              WHERE payment_status = 'paid' AND status != 'cancelled'
              GROUP BY YEAR(order_date)
              ORDER BY year";
    
    $stmt = $conn->prepare($query);
    
    try {
        $stmt->execute();
        $result = $stmt->get_result();
        
        $revenues = [];
        while ($row = $result->fetch_assoc()) {
            $revenues[] = $row;
        }
        
        return $revenues;
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function getOrdersByYear() {
    $conn = connectDB();
    
    $query = "SELECT YEAR(order_date) AS year, COUNT(*) AS total_orders
              FROM invoices
              WHERE status != 'cancelled'
              GROUP BY YEAR(order_date)
              ORDER BY year";
    
    $stmt = $conn->prepare($query);
    
    try {
        $stmt->execute();
        $result = $stmt->get_result();
        
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
        
        return $orders;
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function getRevenueByMonth() {
    $conn = connectDB();
    
    $query = "SELECT YEAR(order_date) AS year, MONTH(order_date) AS month, SUM(amount_sum) AS total_revenue
              FROM invoices
              WHERE status != 'cancelled' 
              GROUP BY YEAR(order_date), MONTH(order_date)
              ORDER BY year, month";
    
    $stmt = $conn->prepare($query);

    try {
        $stmt->execute();
        $result = $stmt->get_result();
        
        $revenues = [];
        while ($row = $result->fetch_assoc()) {
            $revenues[] = $row;
        }
        
        return $revenues;
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function getRoles() {
    $conn = connectDB();

    $query = "SELECT * FROM roles";
    
    $stmt = $conn->prepare($query);

    try {
        $stmt->execute();
        $result = $stmt->get_result();
        
        $roles = [];
        while ($row = $result->fetch_assoc()) {
            $roles[] = $row;
        }
        
        return $roles;
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function addRole($roleName) {
    $conn = connectDB();

    $query = "INSERT INTO roles (role_name) VALUES (?)";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $roleName); // "s" là kiểu dữ liệu string
    
    try {
        $stmt->execute();
        return $stmt->insert_id; // Trả về ID của vai trò vừa thêm
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function updateRole($roleId, $roleName) {
    $conn = connectDB();

    $query = "UPDATE roles SET role_name = ? WHERE role_id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $roleName, $roleId); // "si" là string và integer
    
    try {
        $stmt->execute();
        return $stmt->affected_rows; // Trả về số dòng bị ảnh hưởng
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function deleteRole($roleId) {
    $conn = connectDB();

    $query = "DELETE FROM roles WHERE role_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $roleId);

    try {
        $stmt->execute();
        return $stmt->affected_rows; // Số dòng bị ảnh hưởng (1 nếu xóa thành công, 0 nếu không tìm thấy)
    } finally {
        $stmt->close();
        $conn->close();
    }
}


function getAllAccounts() {
    $conn = connectDB();

    // Query để lấy tài khoản cùng với tên vai trò
    $query = "SELECT accounts.account_id, accounts.avatar, accounts.username, accounts.full_name, 
                     accounts.phone_number, accounts.address, accounts.email, accounts.status, 
                     accounts.role_id, roles.role_name
              FROM accounts
              LEFT JOIN roles ON accounts.role_id = roles.role_id";

    $stmt = $conn->prepare($query);

    try {
        $stmt->execute();
        $result = $stmt->get_result();

        $accounts = [];
        while ($row = $result->fetch_assoc()) {
            $accounts[] = $row; // Thêm từng bản ghi vào mảng
        }

        return $accounts; // Trả về danh sách tài khoản
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function updateAccountStatus($accountId, $status) {
    $conn = connectDB();

    $query = "UPDATE accounts SET status = ? WHERE account_id = ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $status, $accountId);

    try {
        $stmt->execute();
        return $stmt->affected_rows; // Trả về số dòng bị ảnh hưởng
    } finally {
        $stmt->close();
        $conn->close();
    }
}


function deleteAccount($accountId) {
    $conn = connectDB();
    $response = array();

    // Thực hiện lệnh xóa
    $sqlDelete = "DELETE FROM accounts WHERE account_id = '$accountId'";
    if ($conn->query($sqlDelete) === TRUE) {
        $response['status'] = 'success';
        $response['message'] = 'Xóa tài khoản thành công';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Lỗi trong quá trình xóa tài khoản: ' . $conn->error;
    }

    $conn->close();
    return json_encode($response);
}


function getCategories() {
    $conn = connectDB();

    $query = "SELECT * FROM product_categories";
    
    $stmt = $conn->prepare($query);

    try {
        $stmt->execute();
        $result = $stmt->get_result();
        
        $roles = [];
        while ($row = $result->fetch_assoc()) {
            $roles[] = $row;
        }
        
        return $roles;
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function addCategory($categoryName) {
    $conn = connectDB();

    $query = "INSERT INTO product_categories (category_name) VALUES (?)";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $categoryName); // "s" là kiểu dữ liệu string
    
    try {
        $stmt->execute();
        return $stmt->insert_id; // Trả về ID danh mục vừa thêm
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function updateCategory($categoryId, $categoryName) {
    $conn = connectDB();

    $query = "UPDATE product_categories SET category_name = ? WHERE category_id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $categoryName, $categoryId); // "si" là string và integer
    
    try {
        $stmt->execute();
        return $stmt->affected_rows; // Trả về số dòng bị ảnh hưởng
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function deleteCategory($categoryId) {
    $conn = connectDB();
    $response = array();

    // Thực hiện lệnh xóa
    $sqlDelete = "DELETE FROM product_categories WHERE category_id = '$categoryId'";
    if ($conn->query($sqlDelete) === TRUE) {
        $response['status'] = 'success';
        $response['message'] = 'Xóa danh mục thành công';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Lỗi trong quá trình xóa danh mục: ' . $conn->error;
    }

    $conn->close();
    return json_encode($response);
}


function getSubCategories($categoryId) {
    $conn = connectDB();

    // Câu truy vấn chỉ lấy danh mục con dựa trên category_id
    $query = "SELECT * FROM product_subcategories WHERE category_id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $categoryId); // "i" là kiểu dữ liệu integer (category_id)

    try {
        $stmt->execute();
        $result = $stmt->get_result();
        
        $subCategories = [];
        while ($row = $result->fetch_assoc()) {
            $subCategories[] = $row;
        }
        
        return $subCategories; // Trả về danh sách danh mục con
    } finally {
        $stmt->close();
        $conn->close();
    }
}


function addSubCategory($categoryId, $subCategoryName) {
    $conn = connectDB();

    $query = "INSERT INTO product_subcategories (category_id, subcategory_name) VALUES (?, ?)";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("is", $categoryId, $subCategoryName); // "i" là kiểu dữ liệu integer, "s" là string

    try {
        $stmt->execute();
        return $stmt->insert_id; // Trả về ID danh mục con vừa thêm
    } finally {
        $stmt->close();
        $conn->close();
    }
}


function updateSubCategory($subCategoryId, $categoryId, $subCategoryName) {
    $conn = connectDB();

    $query = "UPDATE product_subcategories SET category_id = ?, subcategory_name = ? WHERE subcategory_id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("isi", $categoryId, $subCategoryName, $subCategoryId); // "i" là integer, "s" là string

    try {
        $stmt->execute();
        return $stmt->affected_rows; // Trả về số dòng bị ảnh hưởng
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function deleteSubCategory($subCategoryId) {
    $conn = connectDB();
    $response = array();

    // Thực hiện lệnh xóa
    $query = "DELETE FROM product_subcategories WHERE subcategory_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $subCategoryId); // "i" là kiểu dữ liệu integer

    try {
        if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = 'Xóa danh mục con thành công';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Lỗi trong quá trình xóa danh mục con: ' . $conn->error;
        }
    } finally {
        $stmt->close();
        $conn->close();
    }

    return json_encode($response);
}

function getProductActivityHistory($product_id) {
    $conn = connectDB();

    $query = "SELECT * FROM product_activity_history WHERE product_id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $product_id);

    try {
        $stmt->execute();
        $result = $stmt->get_result();
        
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        
        return $data;
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function addProductActivity($productId, $actionType, $actionBy) {
    $conn = connectDB();

    // Câu truy vấn chèn lịch sử hoạt động
    $query = "INSERT INTO product_activity_history (product_id, action_type, action_by, action_date) 
              VALUES (?, ?, ?,NOW())";

    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Gắn các tham số vào truy vấn
    $stmt->bind_param("iss", $productId, $actionType, $actionBy);

    try {
        // Thực thi truy vấn
        $stmt->execute();

        // Trả về ID của bản ghi vừa thêm
        return $stmt->insert_id;

    } catch (Exception $e) {
        // Xử lý lỗi
        die("Error executing query: " . $e->getMessage());

    } finally {
        // Đóng statement và kết nối
        $stmt->close();
        $conn->close();
    }
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

function addProduct($categoryId, $subCategoryId, $productName, $price, $sale, $description) {
    // Kết nối đến cơ sở dữ liệu
    $conn = connectDB();

    // Câu truy vấn chèn sản phẩm
    $query = "INSERT INTO products (category_id, subcategory_id, product_name, price, sale, description) 
              VALUES (?, ?, ?, ?, ?, ?)";

    // Chuẩn bị truy vấn
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Gắn các tham số vào truy vấn
    $stmt->bind_param("iisdis", $categoryId, $subCategoryId, $productName, $price, $sale, $description);

    try {
        // Thực thi truy vấn
        $stmt->execute();

        // Trả về ID của sản phẩm vừa thêm
        return $stmt->insert_id;

    } catch (Exception $e) {
        // Xử lý lỗi khi thực thi truy vấn
        die("Error executing query: " . $e->getMessage());

    } finally {
        // Đóng statement và kết nối
        $stmt->close();
        $conn->close();
    }
}


function updateProduct($productId, $categoryId, $subCategoryId, $productName, $price, $sale, $description) {
    // Kết nối đến cơ sở dữ liệu
    $conn = connectDB();

    // Câu truy vấn cập nhật sản phẩm
    $query = "UPDATE products SET category_id = ?, subcategory_id = ?, product_name = ?, price = ?, sale = ?, description = ? 
              WHERE product_id = ?";

    // Chuẩn bị câu truy vấn
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Gắn các tham số vào truy vấn
    $stmt->bind_param("iisdisi", $categoryId, $subCategoryId, $productName, $price, $sale, $description, $productId);

    try {
        // Thực thi truy vấn
        $stmt->execute();

        // Trả về số dòng bị ảnh hưởng
        return $stmt->affected_rows;

    } catch (Exception $e) {
        // Xử lý lỗi nếu gặp lỗi
        die("Error executing query: " . $e->getMessage());

    } finally {
        // Đóng statement và kết nối
        $stmt->close();
        $conn->close();
    }
}


function deleteProduct($productId) {
    // Kết nối đến cơ sở dữ liệu
    $conn = connectDB();
    $response = array();

    // Câu truy vấn xóa sản phẩm
    $query = "DELETE FROM products WHERE product_id = ?";

    // Chuẩn bị câu truy vấn
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Gắn tham số vào truy vấn
    $stmt->bind_param("i", $productId);

    try {
        // Thực thi truy vấn
        if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = 'Xóa sản phẩm thành công';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Lỗi trong quá trình xóa sản phẩm: ' . $conn->error;
        }

    } finally {
        // Đóng statement và kết nối
        $stmt->close();
        $conn->close();
    }

    // Trả về phản hồi dưới dạng JSON
    return json_encode($response);
}

function getProductDetails($productId) {
    $conn = connectDB();
    $data = [];

    $sql = "SELECT 
                pd.product_detail_id, 
                pd.product_id, 
                p.product_name,
                pd.color_id, 
                pc.color_name, 
                pd.size_id, 
                ps.size_name, 
                pd.quantity, 
                pd.sold_quantity
            FROM product_details pd
            LEFT JOIN products p 
                ON pd.product_id = p.product_id
            LEFT JOIN product_colors pc 
                ON pd.color_id = pc.color_id
            LEFT JOIN product_sizes ps 
                ON pd.size_id = ps.size_id
            WHERE pd.product_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $productId);

    try {
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }

    } finally {
        $stmt->close();
        $conn->close();
    }

    return $data; // Trả về mảng kết quả
}

function addProductDetails($productId, $colorId, $sizeId, $quantity) {
    $conn = connectDB();

    // Kiểm tra nếu bản ghi tồn tại với product_id, color_id và size_id
    $checkQuery = "SELECT product_detail_id, quantity FROM product_details 
                   WHERE product_id = ? AND color_id = ? AND size_id = ?";
    $stmt = $conn->prepare($checkQuery);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("iii", $productId, $colorId, $sizeId);

    try {
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Nếu đã tồn tại, cập nhật quantity
            $row = $result->fetch_assoc();
            $existingQuantity = $row['quantity'];
            $productDetailId = $row['product_detail_id'];

            $updateQuery = "UPDATE product_details 
                            SET quantity = ? 
                            WHERE product_detail_id = ?";
            $updateStmt = $conn->prepare($updateQuery);
            if ($updateStmt === false) {
                die("Error preparing statement: " . $conn->error);
            }

            $newQuantity = $existingQuantity + $quantity;
            $updateStmt->bind_param("ii", $newQuantity, $productDetailId);

            $updateStmt->execute();
            $updateStmt->close();

            return "updated"; // Trả về trạng thái cập nhật
        } else {
            // Nếu chưa tồn tại, thêm mới
            $insertQuery = "INSERT INTO product_details (product_id, color_id, size_id, quantity, sold_quantity) 
                            VALUES (?, ?, ?, ?, 0)";
            $insertStmt = $conn->prepare($insertQuery);
            if ($insertStmt === false) {
                die("Error preparing statement: " . $conn->error);
            }

            $insertStmt->bind_param("iiii", $productId, $colorId, $sizeId, $quantity);
            $insertStmt->execute();
            $insertStmt->close();

            return "inserted"; // Trả về trạng thái thêm mới
        }
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function updateProductDetails($productDetailId, $productId, $colorId, $sizeId, $quantity) {
    $conn = connectDB();

    // Kiểm tra nếu đã có sản phẩm với cùng màu và size khác product_detail_id hiện tại
    $checkQuery = "SELECT product_detail_id FROM product_details 
                   WHERE product_id = ? AND color_id = ? AND size_id = ? AND product_detail_id != ?";
    $stmt = $conn->prepare($checkQuery);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("iiii", $productId, $colorId, $sizeId, $productDetailId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Nếu đã tồn tại phân loại (màu + size) khác product_detail_id hiện tại
        $stmt->close();
        $conn->close();
        return "exists"; // Trả về trạng thái đã tồn tại
    } 

    // Nếu chưa có phân loại đó, tiến hành cập nhật
    $updateQuery = "UPDATE product_details 
                    SET color_id = ?, size_id = ?, quantity = ?
                    WHERE product_detail_id = ?";
    $updateStmt = $conn->prepare($updateQuery);
    if ($updateStmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    $updateStmt->bind_param("iiii", $colorId, $sizeId, $quantity, $productDetailId);
    $updateStmt->execute();
    $updateStmt->close();
    $stmt->close();
    $conn->close();

    return "updated"; // Trả về trạng thái đã cập nhật
}


function deleteProductDetails($productDetailId) {
    $conn = connectDB();
    $response = array();

    $query = "DELETE FROM product_details WHERE product_detail_id = ?";

    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("i", $productDetailId);

    try {
        if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = 'Xóa chi tiết sản phẩm thành công';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Lỗi trong quá trình xóa chi tiết sản phẩm: ' . $conn->error;
        }
    } finally {
        $stmt->close();
        $conn->close();
    }

    return json_encode($response); // Trả về phản hồi dưới dạng JSON
}

function getIdAndNameProducts() {
    $conn = connectDB();

    $query = "SELECT product_id, product_name FROM products";
    
    $stmt = $conn->prepare($query);

    try {
        $stmt->execute();
        $result = $stmt->get_result();
        
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        
        return $data;
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function getColors() {
    $conn = connectDB();

    $query = "SELECT * FROM product_colors";
    
    $stmt = $conn->prepare($query);

    try {
        $stmt->execute();
        $result = $stmt->get_result();
        
        $colors = [];
        while ($row = $result->fetch_assoc()) {
            $colors[] = $row;
        }
        
        return $colors;
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function getSizes() {
    $conn = connectDB();

    $query = "SELECT * FROM product_sizes";
    
    $stmt = $conn->prepare($query);

    try {
        $stmt->execute();
        $result = $stmt->get_result();
        
        $sizes = [];
        while ($row = $result->fetch_assoc()) {
            $sizes[] = $row;
        }
        
        return $sizes;
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function getImages($productId) {
    $conn = connectDB();
    $data = [];

    $sql = "SELECT * FROM product_images WHERE product_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $productId);

    try {
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }

    } finally {
        $stmt->close();
        $conn->close();
    }

    return $data; // Trả về mảng kết quả
}

function addImage($productId, $imagePath, $isDefault = 0) {
    $conn = connectDB();
    $result = [
        "status" => "error",
        "message" => "Có lỗi xảy ra khi thêm ảnh."
    ];

    $sql = "INSERT INTO product_images (product_id, image, is_default) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isi", $productId, $imagePath, $isDefault); // "i" for integer, "s" for string

    try {
        if ($stmt->execute()) {
            $result = [
                "status" => "success",
                "message" => "Thêm ảnh thành công.",
                "image_id" => $stmt->insert_id // ID của ảnh vừa thêm
            ];
        }
    } catch (Exception $e) {
        $result["message"] = "Lỗi: " . $e->getMessage();
    } finally {
        $stmt->close();
        $conn->close();
    }

    return $result;
}

function setDefaultImage($productId, $imageId) {
    $conn = connectDB();
    $result = [
        "status" => "error",
        "message" => "Có lỗi xảy ra khi cập nhật ảnh mặc định."
    ];

    try {
        // Bắt đầu transaction
        $conn->begin_transaction();

        // Đặt tất cả is_default của product_id đó = 0
        $sqlReset = "UPDATE product_images SET is_default = 0 WHERE product_id = ?";
        $stmtReset = $conn->prepare($sqlReset);
        $stmtReset->bind_param("i", $productId);
        $stmtReset->execute();

        // Kiểm tra nếu reset thành công
        if ($stmtReset->affected_rows < 0) {
            throw new Exception("Không thể reset trạng thái mặc định của ảnh.");
        }

        // Đặt ảnh cần sửa is_default = 1
        $sqlSetDefault = "UPDATE product_images SET is_default = 1 WHERE product_id = ? AND image_id = ?";
        $stmtSetDefault = $conn->prepare($sqlSetDefault);
        $stmtSetDefault->bind_param("ii", $productId, $imageId);
        $stmtSetDefault->execute();

        // Kiểm tra nếu cập nhật thành công
        if ($stmtSetDefault->affected_rows <= 0) {
            throw new Exception("Không thể cập nhật trạng thái mặc định cho ảnh.");
        }

        // Commit transaction nếu không có lỗi
        $conn->commit();

        $result = [
            "status" => "success",
            "message" => "Cập nhật ảnh mặc định thành công."
        ];
    } catch (Exception $e) {
        // Rollback transaction nếu có lỗi
        $conn->rollback();
        $result["message"] = "Lỗi: " . $e->getMessage();
    } finally {
        // Đóng các statement và kết nối
        if (isset($stmtReset)) $stmtReset->close();
        if (isset($stmtSetDefault)) $stmtSetDefault->close();
        $conn->close();
    }

    return $result;
}

function deleteImage($productId, $imageId, $imagePath = null) {
    $conn = connectDB();
    $result = [
        "status" => "error",
        "message" => "Có lỗi xảy ra khi xóa ảnh."
    ];

    try {
        // Nếu chưa có sẵn imagePath, lấy từ database
        if (!$imagePath) {
            $sqlGetImagePath = "SELECT image FROM product_images WHERE product_id = ? AND image_id = ?";
            $stmtGetImagePath = $conn->prepare($sqlGetImagePath);
            $stmtGetImagePath->bind_param("ii", $productId, $imageId);
            $stmtGetImagePath->execute();
            $stmtGetImagePath->bind_result($imagePath);
            $stmtGetImagePath->fetch();
            $stmtGetImagePath->close();
        }

        // Kiểm tra nếu có đường dẫn ảnh hợp lệ
        if ($imagePath) {
            $fullImagePath = "../../../frontend/public" . $imagePath;
            if (file_exists($fullImagePath)) {
                unlink($fullImagePath); // Xóa tệp ảnh
            }
        } else {
            throw new Exception("Không tìm thấy đường dẫn ảnh.");
        }

        // Xóa ảnh trong database
        $sqlDelete = "DELETE FROM product_images WHERE product_id = ? AND image_id = ?";
        $stmtDelete = $conn->prepare($sqlDelete);
        $stmtDelete->bind_param("ii", $productId, $imageId);
        $stmtDelete->execute();

        if ($stmtDelete->affected_rows > 0) {
            $result = [
                "status" => "success",
                "message" => "Xóa ảnh thành công."
            ];
        } else {
            throw new Exception("Không tìm thấy ảnh để xóa trong database.");
        }

        $stmtDelete->close();
    } catch (Exception $e) {
        $result["message"] = "Lỗi: " . $e->getMessage();
    } finally {
        $conn->close();
    }

    return $result;
}

function getInvoices() {
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
            ON i.account_id = a.account_id;
        ";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    $conn->close();
    return $data; // Trả về mảng chứa các hóa đơn
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

    // Câu truy vấn cập nhật trạng thái hóa đơn
    $query = "UPDATE invoices SET status = ? WHERE invoice_id = ?";

    // Chuẩn bị câu truy vấn
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Gắn các tham số vào truy vấn
    $stmt->bind_param("si", $status, $invoiceId);

    try {
        // Thực thi truy vấn
        $stmt->execute();

        // Trả về số dòng bị ảnh hưởng
        return $stmt->affected_rows;

    } catch (Exception $e) {
        // Xử lý lỗi nếu gặp lỗi
        die("Error executing query: " . $e->getMessage());

    } finally {
        // Đóng statement và kết nối
        $stmt->close();
        $conn->close();
    }
}

function updatePaymentStatusAndStatus($invoiceId, $paymentStatus, $status) {
    // Kết nối đến cơ sở dữ liệu
    $conn = connectDB();

    // Câu truy vấn cập nhật cả status và payment_status
    $query = "UPDATE invoices SET status = ?, payment_status = ? WHERE invoice_id = ?";

    // Chuẩn bị câu truy vấn
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        $error = "Error preparing statement: " . $conn->error;
        $conn->close();
        die($error);
    }

    // Gắn các tham số vào truy vấn
    $stmt->bind_param("sss", $status, $paymentStatus, $invoiceId);

    try {
        // Thực thi truy vấn
        $stmt->execute();

        // Lấy số dòng bị ảnh hưởng
        $affectedRows = $stmt->affected_rows;

        // Đóng statement và kết nối
        $stmt->close();
        $conn->close();

        // Trả về số dòng bị ảnh hưởng (thường là 1 nếu thành công, 0 nếu không có thay đổi)
        return $affectedRows;

    } catch (Exception $e) {
        // Ghi log lỗi và trả về false thay vì die để hàm có thể tái sử dụng
        error_log("Error executing query: " . $e->getMessage());
        $stmt->close();
        $conn->close();
        return false;
    }
}

function getContacts() {
    $conn = connectDB(); // Kết nối cơ sở dữ liệu
    $data = [];

    $sql = "SELECT * FROM contacts";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row; // Thêm từng dòng kết quả vào mảng
        }
    }

    $conn->close(); // Đóng kết nối cơ sở dữ liệu
    return $data; // Trả về mảng chứa danh sách các liên hệ
}

function updateContactStatus($contact_id, $new_status) {
    $conn = connectDB(); // Kết nối cơ sở dữ liệu

    // Sử dụng prepared statement để bảo vệ chống SQL Injection
    $stmt = $conn->prepare("UPDATE contacts SET status = ? WHERE contact_id = ?");
    $stmt->bind_param("si", $new_status, $contact_id);

    $result = $stmt->execute();

    $stmt->close();
    $conn->close();

    return $result; // Trả về true nếu thành công, false nếu thất bại
}

function getNotifications() {
    $conn = connectDB(); // Kết nối cơ sở dữ liệu
    $data = [];

    $sql = "SELECT * FROM notifications";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row; // Thêm từng dòng kết quả vào mảng
        }
    }

    $conn->close(); // Đóng kết nối cơ sở dữ liệu
    return $data; // Trả về mảng chứa danh sách các liên hệ
}

function addNotification($title, $message, $createdAt) {
    $conn = connectDB(); // Kết nối đến cơ sở dữ liệu

    $query = "INSERT INTO notifications (title, message, created_at) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Gắn tham số vào câu truy vấn
    $stmt->bind_param("sss", $title, $message, $createdAt);

    try {
        $stmt->execute();
        return $stmt->insert_id; // Trả về ID của thông báo vừa thêm
    } catch (Exception $e) {
        die("Error executing query: " . $e->getMessage());
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function updateNotification($notificationId, $title, $message, $createdAt) {
    $conn = connectDB(); // Kết nối đến cơ sở dữ liệu

    $query = "UPDATE notifications SET title = ?, message = ?, created_at = ? WHERE notification_id = ?";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Gắn tham số vào câu truy vấn
    $stmt->bind_param("sssi", $title, $message, $createdAt, $notificationId);

    try {
        $stmt->execute();
        return $stmt->affected_rows; // Trả về số dòng bị ảnh hưởng
    } catch (Exception $e) {
        die("Error executing query: " . $e->getMessage());
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function deleteNotification($notificationId) {
    $conn = connectDB(); // Kết nối đến cơ sở dữ liệu

    $response = array();
    $query = "DELETE FROM notifications WHERE notification_id = ?";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Gắn tham số vào câu truy vấn
    $stmt->bind_param("i", $notificationId);

    try {
        if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = 'Xóa thông báo thành công';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Lỗi trong quá trình xóa thông báo: ' . $conn->error;
        }
    } finally {
        $stmt->close();
        $conn->close();
    }

    return json_encode($response); // Trả về phản hồi dưới dạng JSON
}

function getDiscountCodes() {
    $conn = connectDB(); // Kết nối cơ sở dữ liệu
    $data = [];

    $sql = "SELECT * FROM discount_codes";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row; // Thêm từng dòng kết quả vào mảng
        }
    }

    $conn->close(); // Đóng kết nối cơ sở dữ liệu
    return $data; // Trả về mảng danh sách các mã giảm giá
}

function checkDiscountCodeExists($code) {
    $conn = connectDB(); // Kết nối đến cơ sở dữ liệu

    $query = "SELECT COUNT(*) FROM discount_codes WHERE code = ?";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("s", $code);

    try {
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        return $count > 0; // Trả về true nếu mã tồn tại, ngược lại false
    } catch (Exception $e) {
        die("Error executing query: " . $e->getMessage());
    } finally {
        $stmt->close();
        $conn->close();
    }
}



function addDiscountCode($code, $description, $discountValue, $quantity, $startDate, $endDate) {
    // Kiểm tra xem mã giảm giá đã tồn tại chưa
    if (checkDiscountCodeExists($code)) {
        return json_encode(["status" => "error", "message" => "Mã giảm giá đã tồn tại"]);
    }

    $conn = connectDB(); // Kết nối đến cơ sở dữ liệu
    $query = "INSERT INTO discount_codes (code, description, discount_value, quantity, start_date, end_date) 
              VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("ssdiss", $code, $description, $discountValue, $quantity, $startDate, $endDate);

    try {
        $stmt->execute();
        return json_encode(["status" => "success", "discount_id" => $stmt->insert_id]);
    } catch (Exception $e) {
        die("Error executing query: " . $e->getMessage());
    } finally {
        $stmt->close();
        $conn->close();
    }
}

function checkDiscountCodeExistsForUpdate($discountId, $code) {
    $conn = connectDB(); // Kết nối cơ sở dữ liệu

    // Truy vấn kiểm tra mã giảm giá, loại trừ bản ghi hiện tại
    $query = "SELECT COUNT(*) FROM discount_codes WHERE code = ? AND discount_id != ?";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("si", $code, $discountId);

    try {
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        return $count > 0; // Trả về true nếu trùng mã, ngược lại false
    } catch (Exception $e) {
        die("Error executing query: " . $e->getMessage());
    } finally {
        $stmt->close();
        $conn->close();
    }
}



function updateDiscountCode($discountId, $code, $description, $discountValue, $quantity, $startDate, $endDate) {
    // Kiểm tra nếu mã tồn tại nhưng không phải của discountId hiện tại
    if (checkDiscountCodeExistsForUpdate($discountId, $code)) {
        return ["status" => "error", "message" => "Mã giảm giá này đã tồn tại"];
    }

    $conn = connectDB(); // Kết nối đến cơ sở dữ liệu

    // Câu truy vấn cập nhật
    $query = "UPDATE discount_codes SET code = ?, description = ?, discount_value = ?, quantity = ?, 
              start_date = ?, end_date = ? WHERE discount_id = ?";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Gắn tham số vào truy vấn
    $stmt->bind_param("ssdissi", $code, $description, $discountValue, $quantity, $startDate, $endDate, $discountId);

    try {
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            return ["status" => "success", "affected_rows" => $stmt->affected_rows];
        } else {
            return ["status" => "error", "message" => "Không có thay đổi nào được thực hiện hoặc bản ghi không tồn tại"];
        }
    } catch (Exception $e) {
        return ["status" => "error", "message" => $e->getMessage()];
    } finally {
        $stmt->close();
        $conn->close();
    }
}



function deleteDiscountCode($discountId) {
    $conn = connectDB(); // Kết nối đến cơ sở dữ liệu

    $response = array();
    $query = "DELETE FROM discount_codes WHERE discount_id = ?";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Gắn tham số vào câu truy vấn
    $stmt->bind_param("i", $discountId);

    try {
        if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = 'Xóa mã giảm giá thành công';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Lỗi trong quá trình xóa mã giảm giá: ' . $conn->error;
        }
    } finally {
        $stmt->close();
        $conn->close();
    }

    return json_encode($response); // Trả về phản hồi dưới dạng JSON
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