<?php
require dirname(__DIR__) . '/vendor/autoload.php'; // Nạp tự động từ Composer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Twilio\Rest\Client;

function sendVerificationCode($contact, $type) {
    session_start();
    $otp = rand(100000, 999999); // Tạo mã OTP 6 chữ số

    $_SESSION['otp'][$contact] = $otp; // Lưu OTP vào session
    $_SESSION['otp_time'][$contact] = time(); // Lưu thời gian gửi OTP

    if ($type === 'email') {
        return sendVerificationEmail($contact, $otp);
    } elseif ($type === 'phone_number') {
        return sendVerificationSMS($contact, $otp);
    }

    return false;
}


// Gửi mã xác minh qua Email
function sendVerificationEmail($email, $otp) {
    $mail = new PHPMailer(true);

    try {
        // Cấu hình SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'duongvankiencv@gmail.com'; // Thay bằng email của bạn
        $mail->Password = 'yowq hksw mvml sfdh'; // Thay bằng mật khẩu ứng dụng
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Thiết lập email gửi đi
        $mail->setFrom('duongvankiencv@gmail.com', 'EMK Shop');
        $mail->addAddress($email);

        // Nội dung email
        $mail->isHTML(true);
        $mail->Subject = 'Xac minh Email';
        $mail->Body = "Mã xác minh của bạn là: <b>$otp</b>. Mã này có hiệu lực trong 2 phút.";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Không thể gửi email xác minh. Lỗi: {$mail->ErrorInfo}");
        return false;
    }
}

// Gửi mã xác minh qua SMS
function sendVerificationSMS($phoneNumber, $otp) {
    // Thông tin Twilio của bạn
    $sid = ""; 
    $token = ""; 
    $twilioPhoneNumber = "+18884108938"; 

    // Định dạng nội dung tin nhắn (loại bỏ <b>)
    $messageBody = "Mã xác minh của bạn là: $otp. Mã có hiệu lực trong 2 phút.";

    try {
        $client = new Client($sid, $token);

        // Gửi SMS
        $message = $client->messages->create(
            $phoneNumber, 
            [
                'from' => $twilioPhoneNumber,
                'body' => $messageBody
            ]
        );

        // Kiểm tra phản hồi từ Twilio
        if (!empty($message->sid)) {
            return true; // Thành công
        }
    } catch (Exception $e) {
        error_log("Không thể gửi SMS xác minh. Lỗi: " . $e->getMessage());
    }

    return false; // Thất bại
}



function sendResetPasswordEmail($email, $resetLink) {
    $mail = new PHPMailer(true);

    try {
        // Cấu hình SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'duongvankiencv@gmail.com'; // Thay bằng email của bạn
        $mail->Password = 'yowq hksw mvml sfdh'; // Thay bằng mật khẩu ứng dụng của bạn
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Gửi từ địa chỉ email
        $mail->setFrom('duongvankiencv@gmail.com', 'EMK Shop');
        $mail->addAddress($email);

        // Nội dung email
        $mail->isHTML(true);
        $mail->Subject = 'Rest Password';
        $mail->Body = "Nhấp vào liên kết sau để đặt lại mật khẩu: <a href='$resetLink'>$resetLink</a>";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Không thể gửi email. Lỗi: {$mail->ErrorInfo}");
        return false;
    }
}

function sendResetPasswordSMS($phoneNumber, $resetLink) {
    $sid = "YOUR_TWILIO_SID";
    $token = "YOUR_TWILIO_AUTH_TOKEN";
    $twilio = new Client($sid, $token);

    try {
        $message = "Nhấp vào đây để đặt lại mật khẩu: $resetLink";
        $twilio->messages->create($phoneNumber, [
            'from' => '+1234567890', // Số Twilio của bạn
            'body' => $message
        ]);
        return true;
    } catch (Exception $e) {
        error_log("Không thể gửi SMS. Lỗi: {$e->getMessage()}");
        return false;
    }
}


// Hàm tạo OTP 6 chữ số
function generateOTP($length = 6) {
    return rand(pow(10, $length - 1), pow(10, $length) - 1);
}

// Hàm gửi OTP qua Email
function sendOTPEmail($email, $otp) {
    $mail = new PHPMailer(true);

    try {
        // Cấu hình SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'duongvankiencv@gmail.com'; // Thay bằng email của bạn
        $mail->Password = 'yowq hksw mvml sfdh'; // Thay bằng mật khẩu ứng dụng Gmail
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Thiết lập email gửi đi
        $mail->setFrom('duongvankiencv@gmail.com', 'EMK Shop');
        $mail->addAddress($email);

        // Nội dung email
        $mail->isHTML(true);
        $mail->Subject = 'Ma OTP xac nhan doi mat khau';
        $mail->Body = "Mã OTP của bạn là <b>$otp</b>. Mã này có hiệu lực trong 2 phút.";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Không thể gửi email. Lỗi: {$mail->ErrorInfo}");
        return false;
    }
}

// Hàm gửi OTP qua SMS
function sendOTPSMS($phoneNumber, $otp) {
    // Thông tin Twilio của bạn
    $sid = ""; 
    $token = ""; 
    $twilioPhoneNumber = "+18884108938"; 

    // Định dạng nội dung tin nhắn (loại bỏ <b>)
    $messageBody = "Mã xác minh của bạn là: $otp. Mã có hiệu lực trong 2 phút.";

    try {
        $client = new Client($sid, $token);

        // Gửi SMS
        $message = $client->messages->create(
            $phoneNumber, 
            [
                'from' => $twilioPhoneNumber,
                'body' => $messageBody
            ]
        );

        // Kiểm tra phản hồi từ Twilio
        if (!empty($message->sid)) {
            return true; // Thành công
        }
    } catch (Exception $e) {
        error_log("Không thể gửi SMS xác minh. Lỗi: " . $e->getMessage());
    }

    return false; // Thất bại
}

function sendPaymentConfirmationEmail($email, $orderId, $amount, $paymentDate, $orderDate, $products) {
    $mail = new PHPMailer(true);

    try {
        // Cấu hình SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'duongvankiencv@gmail.com'; // Thay bằng email của bạn
        $mail->Password = 'yowq hksw mvml sfdh'; // Thay bằng mật khẩu ứng dụng của bạn
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Thiết lập email gửi đi
        $mail->setFrom('duongvankiencv@gmail.com', 'EMK Shop');
        $mail->addAddress($email);

        // Nội dung email
        $mail->isHTML(true);
        $mail->Subject = 'Xac nhan thanh toan don hang #' . $orderId;

        // Xây dựng nội dung bảng sản phẩm
        $productsTable = "
            <table border='1' cellpadding='10' cellspacing='0' style='border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;'>
                <thead>
                    <tr style='background-color: #f4f4f4;'>
                        <th style='text-align: left;'>Tên sản phẩm</th>
                        <th style='text-align: left;'>Màu sắc</th>
                        <th style='text-align: left;'>Kích thước</th>
                        <th style='text-align: center;'>Số lượng</th>
                        <th style='text-align: right;'>Giá</th>
                    </tr>
                </thead>
                <tbody>";

        foreach ($products as $product) {
            $productsTable .= "
                <tr>
                    <td style='vertical-align: top;'>" . htmlspecialchars($product['product_name']) . "</td>
                    <td style='vertical-align: top;'>" . htmlspecialchars($product['product_color']) . "</td>
                    <td style='vertical-align: top;'>" . htmlspecialchars($product['product_size']) . "</td>
                    <td style='text-align: center; vertical-align: top;'>" . $product['purchase_quantity'] . "</td>
                    <td style='text-align: right; vertical-align: top;'>" . number_format($product['sale_price'], 0, ',', '.') . " VND</td>
                </tr>";
        }

        $productsTable .= "
                </tbody>
            </table>";

        $mail->Body = "
            <h2 style='font-family: Arial, sans-serif;'>Cảm ơn bạn đã đặt hàng</h2>
            <p style='font-family: Arial, sans-serif;'>Đơn hàng của bạn đã được thanh toán thành công. Dưới đây là thông tin chi tiết:</p>
            <ul style='list-style-type: none; padding: 0;'>
                <li style='margin-bottom: 10px;'><b>Mã đơn hàng:</b> #$orderId</li>
                <li style='margin-bottom: 10px;'><b>Ngày đặt hàng:</b> " . date("d/m/Y H:i:s", strtotime($orderDate)) . "</li>
                <li style='margin-bottom: 10px;'><b>Số tiền:</b> " . number_format($amount, 0, ',', '.') . " VND</li>
                <li style='margin-bottom: 10px;'><b>Ngày thanh toán:</b> $paymentDate</li>
            </ul>
            <h3 style='font-family: Arial, sans-serif;'>Danh sách sản phẩm:</h3>
            $productsTable
            <p style='font-family: Arial, sans-serif;'>Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi!</p>
            <p style='font-family: Arial, sans-serif;'>Trân trọng,<br>EMK Shop</p>
        ";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Không thể gửi email xác nhận thanh toán. Lỗi: {$mail->ErrorInfo}");
        return false;
    }
}

?>