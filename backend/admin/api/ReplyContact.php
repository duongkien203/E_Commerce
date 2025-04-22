<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép từ nguồn localhost:3000
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Phương thức POST
header("Access-Control-Allow-Headers: Content-Type"); // Cho phép header Content-Type

require_once '../config.php'; // Include file cấu hình cơ sở dữ liệu
require_once '../SendNotification.php'; // Include file chứa hàm sendReplyEmail

try {
    // Lấy dữ liệu từ body request
    $data = json_decode(file_get_contents("php://input"), true);

    // Kiểm tra dữ liệu đầu vào
    if (
        isset($data["contact_id"], $data["to_email"], $data["full_name"], $data["subject"], $data["user_message"], $data["reply_message"])
    ) {
        $contact_id = intval($data["contact_id"]); // Chuyển contact_id thành kiểu số nguyên
        $to_email = $data["to_email"]; // Email người nhận
        $full_name = $data["full_name"]; // Tên người nhận
        $subject = $data["subject"]; // Chủ đề liên hệ
        $user_message = $data["user_message"]; // Nội dung yêu cầu của khách hàng
        $reply_message = $data["reply_message"]; // Nội dung phản hồi

        // Gửi email phản hồi
        if (sendReplyEmail($to_email, $full_name, $subject, $user_message, $reply_message)) {
            // Nếu gửi email thành công, cập nhật trạng thái liên hệ
            if (updateContactStatus($contact_id, "responded")) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Phản hồi đã được gửi và trạng thái liên hệ đã cập nhật."
                ], JSON_PRETTY_PRINT);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Email đã gửi nhưng không thể cập nhật trạng thái liên hệ."
                ], JSON_PRETTY_PRINT);
            }
        } else {
            // Lỗi khi gửi email
            echo json_encode([
                "status" => "error",
                "message" => "Không thể gửi email phản hồi."
            ], JSON_PRETTY_PRINT);
        }
    } else {
        // Trả về lỗi nếu thiếu tham số
        throw new Exception("contact_id, to_email, full_name, subject, user_message và reply_message là bắt buộc.");
    }
} catch (Exception $e) {
    // Xử lý lỗi chung
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>