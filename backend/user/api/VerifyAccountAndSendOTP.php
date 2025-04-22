<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config.php';

try {
    // Nhận dữ liệu từ React
    $data = json_decode(file_get_contents("php://input"), true);

    // Kiểm tra dữ liệu đầu vào
    if (!isset($data['account_id']) || !isset($data['contact'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Thiếu thông tin account_id hoặc contact."
        ]);
        exit;
    }

    $account_id = intval($data['account_id']); // Đảm bảo account_id là số nguyên
    $contact = trim($data['contact']); // Xóa khoảng trắng 2 đầu

    // Gọi hàm xử lý OTP
    $response = verifyAccountAndSendOTP($account_id, $contact);

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Lỗi máy chủ: " . $e->getMessage()
    ]);
}
?>