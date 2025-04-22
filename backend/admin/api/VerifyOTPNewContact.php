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
    if (!isset($data['accountId']) || !isset($data['contact']) || !isset($data['contactType']) || !isset($data['otp'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Thiếu thông tin accountId, contact, contactType hoặc otp."
        ]);
        exit;
    }

    $accountId = trim($data['accountId']); // ID tài khoản
    $contact = trim($data['contact']);     // Email hoặc số điện thoại
    $contactType = trim($data['contactType']); // Loại liên hệ: "email" hoặc "phone_number"
    $otp = trim($data['otp']);             // Mã OTP người dùng nhập

    // Kiểm tra OTP có hợp lệ không
    $otpResult = checkOTP($contact, $otp);
    if ($otpResult['status'] !== 'success') {
        echo json_encode($otpResult); // Trả về lỗi nếu OTP không hợp lệ
        exit;
    }

    // Nếu OTP hợp lệ, cập nhật thông tin dựa trên contactType
    if ($contactType === 'email') {
        $result = updateEmail($accountId, $contact);
    } elseif ($contactType === 'phone_number') {
        $result = updatePhoneNumber($accountId, $contact);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "contactType không hợp lệ. Chỉ chấp nhận 'email' hoặc 'phone_number'."
        ]);
        exit;
    }

    // Trả về kết quả từ hàm cập nhật
    echo json_encode($result);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Lỗi máy chủ: " . $e->getMessage()
    ]);
}
?>