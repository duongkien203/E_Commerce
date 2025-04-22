<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép từ nguồn localhost:3000
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Phương thức POST
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Cho phép header Content-Type
header("Access-Control-Allow-Credentials: true"); // Xác thực cookies nếu cần

require_once '../config.php'; // Include file cấu hình cơ sở dữ liệu

try {
    $data = json_decode(file_get_contents('php://input'), true); // Lấy dữ liệu từ body request
    if (isset($data['title']) && isset($data['message']) && isset($data['created_at'])) {
        $title = $data['title']; // Tiêu đề
        $message = $data['message']; // Nội dung
        $createdAt = $data['created_at']; // Ngày hiệu lực

        $notificationId = addNotification($title, $message, $createdAt); // Gọi hàm thêm thông báo

        echo json_encode([
            "status" => "success",
            "message" => "Notification added successfully",
            "notification_id" => $notificationId
        ], JSON_PRETTY_PRINT);
    } else {
        throw new Exception("title, message, and created_at are required");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>