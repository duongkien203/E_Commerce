<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Thay đổi từ DELETE thành POST
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../config.php';

try {
    // Lấy dữ liệu JSON từ body của request
    $data = json_decode(file_get_contents("php://input"), true);

    // Kiểm tra và lấy `account_id` từ dữ liệu POST
    if (isset($data["account_id"])) {
        $accountId = intval($data["account_id"]);
        echo deleteAccount($accountId); // Gọi hàm và trả về JSON
    } else {
        throw new Exception("account_id is required");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>