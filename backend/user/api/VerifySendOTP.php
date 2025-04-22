<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../db.php';
require_once '../config.php';
require_once '../SendNotification.php';

try {
    // Nhận dữ liệu từ React
    $data = json_decode(file_get_contents("php://input"), true);

    // Kiểm tra dữ liệu đầu vào
    if (!isset($data['accountId']) || !isset($data['contact']) || !isset($data['contactType'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Thiếu thông tin contact hoặc contactType."
        ]);
        exit;
    }

    $accountId = intval($data['accountId']); // Đảm bảo số nguyên
    $contact = trim($data['contact']); // Xóa khoảng trắng 2 đầu
    $contactType = trim($data['contactType']); // Xóa khoảng trắng 2 đầu

    // Kết nối cơ sở dữ liệu
    $conn = connectDB();

    // Kiểm tra xem contact (email hoặc số điện thoại) đã tồn tại chưa
    if ($contactType !== 'email' && $contactType !== 'phone_number') {
        echo json_encode([
            "status" => "error",
            "message" => "Loại liên hệ không hợp lệ."
        ]);
        $conn->close();
        exit;
    }

    $contact = $conn->real_escape_string($contact); // Bảo vệ dữ liệu đầu vào
    $sqlCheckContact = "SELECT * FROM `accounts` WHERE `$contactType` = '$contact'";
    $resultContact = $conn->query($sqlCheckContact);

    if ($resultContact->num_rows > 0) {
        $conn->close();
        echo json_encode([
            "status" => "error",
            "message" => ($contactType === 'email') ? 'Email đã tồn tại' : 'Số điện thoại đã tồn tại'
        ]);
        exit;
    }

    // Nếu contact chưa tồn tại, gửi OTP
    $result = sendVerificationCode($contact, $contactType);

    // Chuẩn hóa phản hồi JSON
    if ($result === true) {
        echo json_encode([
            "status" => "success",
            "message" => "Gửi OTP thành công"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Gửi OTP thất bại"
        ]);
    }

    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Lỗi máy chủ: " . $e->getMessage()
    ]);
}
?>