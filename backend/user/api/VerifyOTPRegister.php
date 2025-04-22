<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');


try {
    require_once '../config.php';

    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['contact'], $data['otp'], $data['fullname'], $data['username'], $data['password'], $data['password'])) {
        echo json_encode(['status' => 'error', 'message' => 'Thiếu dữ liệu đầu vào']);
        exit;
    }

    $contact = trim($data['contact']);
    $otp = $data['otp'];
    $fullName = $data['fullname'];
    $username = $data['username'];
    $password = $data['password'];
    $role = isset($_GET['role']) ? $_GET['role'] : '2';
    $contactType = $data['contactType'];

    $response = verifyOTPRegister($contact, $otp, $fullName , $username, $password, $role, $contactType);
    echo json_encode($response);
} catch (Exception $e) {
    // Nếu có lỗi, trả về JSON thay vì HTML
    echo json_encode(['status' => 'error', 'message' => 'Lỗi server: ' . $e->getMessage()]);
}
?>