<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once '../config.php';

try {
    // Kiểm tra xem product_id có được truyền vào hay không
    if (isset($_GET['product_id'])) {
        $productId = intval($_GET['product_id']); // Lấy product_id từ query params và chuyển thành số nguyên

        // Gọi hàm getProductDetails với product_id
        $data = getProductDetails($productId);
        
        // Trả về phản hồi JSON
        echo json_encode(["status" => "success", "data" => $data], JSON_PRETTY_PRINT);
    } else {
        // Trường hợp không có product_id trong request
        throw new Exception("product_id is required");
    }
} catch (Exception $e) {
    // Xử lý lỗi và trả về phản hồi lỗi
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>