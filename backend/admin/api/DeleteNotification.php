<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép từ nguồn localhost:3000
header("Access-Control-Allow-Methods: DELETE, OPTIONS"); // Phương thức DELETE
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Cho phép header Content-Type
header("Access-Control-Allow-Credentials: true"); // Xác thực cookies nếu cần

require_once '../config.php'; // Include file cấu hình cơ sở dữ liệu

try {
    if (isset($_GET["notification_id"])) {
        $notificationId = intval($_GET["notification_id"]); // Lấy ID thông báo từ query params
        $response = deleteNotification($notificationId); // Gọi hàm xóa thông báo
        echo $response; // Trả về phản hồi từ hàm
    } else {
        throw new Exception("notification_id is required");
    }    
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>