<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép từ nguồn localhost:3000
header("Access-Control-Allow-Methods: DELETE, OPTIONS"); // Phương thức DELETE
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Cho phép header Content-Type
header("Access-Control-Allow-Credentials: true"); // Xác thực cookies nếu cần

require_once '../config.php'; // Include file cấu hình cơ sở dữ liệu

try {
    // Nhận dữ liệu từ body
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["notification_ids"]) && is_array($data["notification_ids"])) {
        $notificationIds = $data["notification_ids"];
        $successCount = 0;
        $errorCount = 0;

        foreach ($notificationIds as $notificationId) {
            $affectedRows = deleteNotification($notificationId); // Gọi hàm xóa thông báo

            if ($affectedRows > 0) {
                $successCount++;
            } else {
                $errorCount++;
            }
        }

        // Trả về phản hồi JSON
        echo json_encode([
            "status" => "success",
            "message" => "Notifications processed",
            "details" => [
                "deleted" => $successCount,
                "failed" => $errorCount
            ]
        ], JSON_PRETTY_PRINT);
    } else {
        throw new Exception("notification_ids must be a valid array.");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>