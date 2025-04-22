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

if (!empty($data['accountId']) && !empty($data['productDetailIds']) && is_array($data['productDetailIds'])) {
    $accountId = $data['accountId'];
    $productDetailIds = $data['productDetailIds'];

    $response = [];
    $allSuccess = true;

    foreach ($productDetailIds as $productDetailId) {
        $result = removeProductFromCart($accountId, $productDetailId);
        $response[] = json_decode($result, true);
        if (json_decode($result, true)['status'] !== 'success') {
            $allSuccess = false;
        }
    }

    if ($allSuccess) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Tất cả sản phẩm đã được xóa khỏi giỏ hàng thành công!',
            'data' => $response
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Có lỗi xảy ra trong quá trình xóa sản phẩm!',
            'data' => $response
        ]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Thiếu dữ liệu hoặc dữ liệu không hợp lệ']);
}
?>