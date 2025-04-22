<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config.php'; // Kết nối database

// Lấy dữ liệu POST dạng thô
$jsonData = file_get_contents('php://input');
// Giải mã dữ liệu JSON thành mảng kết hợp PHP
$data = json_decode($jsonData, true);

// Kiểm tra xem có dữ liệu POST từ form không
if (!empty($data['accountId']) && !empty($data['productId']) && !empty($data['colorId']) && !empty($data['sizeId']) && !empty($data['quantity'])) {
    $accountId = $data['accountId'];
    $productId = $data['productId'];
    $colorId = $data['colorId'];
    $sizeId = $data['sizeId'];
    $quantity = $data['quantity'];

    $response = addToCart($accountId, $productId, $colorId, $sizeId, $quantity);

    if (empty($response)) {
        // Nếu không có dữ liệu, trả về thông báo lỗi
        echo json_encode([
            'status' => 'error',
            'message' => 'Thêm sản phẩm thất bại!'
        ]);
    } else {
        // Nếu có dữ liệu, trả về kết quả
        echo json_encode([
            'status' => 'success',
            'data' => $response
        ]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Thiếu dữ liệu']);
}
?>