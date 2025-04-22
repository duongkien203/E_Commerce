<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config.php';

// Kiểm tra nếu request là POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Kiểm tra dữ liệu từ $_POST
    if (!isset($_POST["id"]) || !isset($_POST["password"]) || !isset($_POST["new_password"]) || !isset($_POST["password_confirmation"]) || !isset($_POST["otp"])) {
        echo json_encode(["status" => "error", "message" => "Thiếu dữ liệu"]);
        exit;
    }

    $accountId = trim($_POST["id"]);
    $password = trim($_POST["password"]);
    $newPassword = trim($_POST["new_password"]);
    $passwordConfirmation = trim($_POST["password_confirmation"]);
    $otp = trim($_POST["otp"]);

    // Kiểm tra xác nhận mật khẩu
    if ($newPassword !== $passwordConfirmation) {
        echo json_encode(["status" => "error", "message" => "Xác nhận mật khẩu không khớp"]);
        exit;
    }

    // Gọi hàm cập nhật mật khẩu
    $result = updatePassword($accountId, $password, $newPassword, $otp);

    // Trả về JSON response
    echo json_encode($result);
} else {
    echo json_encode(["status" => "error", "message" => "Chỉ hỗ trợ phương thức POST"]);
}
?>