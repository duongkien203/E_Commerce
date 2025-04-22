<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../config.php'; // Gọi file kết nối DB

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['product_detail_id'], $data['product_id'], $data['color_id'], $data['size_id'], $data['quantity'])) {
        $productDetailId = intval($data['product_detail_id']);
        $productId = intval($data['product_id']);
        $colorId = intval($data['color_id']);
        $sizeId = intval($data['size_id']);
        $quantity = intval($data['quantity']);

        // Gọi hàm cập nhật
        $status = updateProductDetails($productDetailId, $productId, $colorId, $sizeId, $quantity);

        if ($status === "exists") {
            echo json_encode(["status" => "error", "message" => "Phân loại màu và size này đã tồn tại."], JSON_PRETTY_PRINT);
        } else {
            echo json_encode(["status" => "success", "message" => "Cập nhật thành công."], JSON_PRETTY_PRINT);
        }
    } else {
        throw new Exception("Thiếu thông tin: product_detail_id, product_id, color_id, size_id, quantity");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>