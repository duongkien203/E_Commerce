<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config.php';

// Kiểm tra nếu request là POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Kiểm tra dữ liệu từ $_POST
    if (!isset($_POST["password"]) || !isset($_POST["token"])) {
        echo json_encode(["status" => "error", "message" => "Thiếu dữ liệu"]);
        exit;
    }

    $password = trim($_POST["password"]);
    $token = trim($_POST["token"]);

    // Gọi hàm resetPassword
    $result = resetPassword($password, $token);

    // Trả về JSON response
    echo json_encode($result);
} else {
    echo json_encode(["status" => "error", "message" => "Chỉ hỗ trợ phương thức POST"]);
}

?>