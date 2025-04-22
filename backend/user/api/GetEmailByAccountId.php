<?php
header('Access-Control-Allow-Origin: *'); // Cho phép mọi nguồn truy cập
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Các phương thức được phép
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Các header được phép

require_once '../config.php'; // Kết nối cơ sở dữ liệu

// Kiểm tra tham số account_id
if (!isset($_GET['account_id'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing account_id parameter"
    ], JSON_PRETTY_PRINT);
    exit;
}

$account_id = intval($_GET['account_id']); // Chuyển đổi về kiểu số nguyên

try {
    $data = getEmailByAccountId($account_id);

    // Trả về dữ liệu
    echo json_encode([
        "status" => "success",
        "data" => $data
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    // Xử lý lỗi
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>