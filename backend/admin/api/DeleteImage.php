<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../config.php';

try {
    // Lấy dữ liệu JSON từ frontend
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["product_id"]) || !isset($data["image_id"])) {
        throw new Exception("Thiếu product_id hoặc image_id");
    }

    $productId = intval($data["product_id"]);
    $imageId = intval($data["image_id"]);
    $imagePath = isset($data["image_path"]) ? $data["image_path"] : null; // Có thể có hoặc không

    // Gọi hàm xóa ảnh
    $result = deleteImage($productId, $imageId, $imagePath);

    echo json_encode($result, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>