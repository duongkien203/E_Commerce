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
    $sid = "YOUR_TWILIO_SID"; // Nhập Twilio SID
    $token = "YOUR_TWILIO_AUTH_TOKEN"; // Nhập Twilio Auth Token
    $twilio = new Client($sid, $token);

    try {
        $message = "Mã OTP của bạn là $otp. Mã có hiệu lực trong 2 phút.";
        $twilio->messages->create($phoneNumber, [
            'from' => '+1234567890', // Thay bằng số Twilio của bạn
            'body' => $message
        ]);
        return true;
    } catch (Exception $e) {
        error_log("Không thể gửi SMS. Lỗi: {$e->getMessage()}");
        return false;
    }
}

function sendReplyEmail($to_email, $full_name, $subject, $user_message, $reply_message) {
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

        // Thiết lập email
        $mail->setFrom('duongvankiencv@gmail.com', 'EMK Shop');
        $mail->addAddress($to_email);

        // Nội dung email
        $mail->isHTML(true);
        $mail->Subject = 'Ho tro khach hang';
        $mail->Body = "
            <p>Xin chào $full_name,</p>
            <p>Bạn đã yêu cầu chúng tôi hỗ trợ về chủ đề: <strong>$subject</strong>.</p>
            <p>Nội dung yêu cầu của bạn như sau:</p>
            <blockquote><em>$user_message</em></blockquote>
            <p>Chúng tôi xin phản hồi lại như sau:</p>
            <blockquote><em>$reply_message</em></blockquote>
            <p>Trân trọng,</p>
            <p>Đội ngũ hỗ trợ EMK Shop</p>
        ";

        $mail->send();
        return true; // Gửi thành công
    } catch (Exception $e) {
        error_log("Lỗi gửi email: {$mail->ErrorInfo}");
        return false; // Gửi thất bại
    }
}

?>