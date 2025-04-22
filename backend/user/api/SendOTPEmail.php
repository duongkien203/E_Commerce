<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kiểm tra nếu request là POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Phương thức không được phép
    echo json_encode(['status' => 'error', 'message' => 'Chỉ hỗ trợ phương thức POST']);
    exit();
}

// Đọc dữ liệu đầu vào
$inputJSON = file_get_contents("php://input");
$data = json_decode($inputJSON, true);

// Kiểm tra dữ liệu đầu vào
if (!$data || !isset($data['account_id']) || !isset($data['email'])) {
    http_response_code(400); // Lỗi dữ liệu đầu vào
    echo json_encode(['status' => 'error', 'message' => 'Dữ liệu không hợp lệ. Vui lòng cung cấp account_id và email.']);
    exit();
}

$accountId = intval($data['account_id']); // Chuyển thành số nguyên
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL); // Lọc email

// Kiểm tra email hợp lệ
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Địa chỉ email không hợp lệ.']);
    exit();
}

// Gọi hàm xử lý OTP
$response = verifyEmailAndSendOTP($accountId, $email);

http_response_code(200);
echo json_encode($response);
?>