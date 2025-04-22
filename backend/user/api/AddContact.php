<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config.php'; // Kết nối database

// Lấy dữ liệu POST dạng thô
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Kiểm tra xem có đủ dữ liệu không
if (!empty($data['id']) && !empty($data['fullName']) && !empty($data['email']) && !empty($data['subject']) && !empty($data['message'])) {
    $accountId = (int) $data['id']; // Chuyển id thành số nguyên
    $fullName = trim($data['fullName']);
    $email = trim($data['email']);
    $subject = trim($data['subject']);
    $message = trim($data['message']);

    echo createContact($accountId, $fullName, $email, $subject, $message);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Thiếu dữ liệu']);
}
?>