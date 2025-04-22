<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS'); // Cho phép GET và OPTIONS
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Cho phép Content-Type

// Nếu là request OPTIONS (Preflight request), trả về 200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config.php';

// Kiểm tra tham số GET
if (!isset($_GET['productId']) || !isset($_GET['colorId']) || !isset($_GET['sizeId'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Thiếu dữ liệu để lấy thông tin sản phẩm!'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

$productId = $_GET['productId'];
$colorId = $_GET['colorId'];
$sizeId = $_GET['sizeId'];

// Gọi hàm lấy dữ liệu và trả thẳng kết quả
echo getProductBuyNow($productId, $colorId, $sizeId);

exit;
?>