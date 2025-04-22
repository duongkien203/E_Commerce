<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../config.php'; // Gọi file config chứa hàm setDefaultImage

try {
    // Lấy dữ liệu từ request body
    $data = json_decode(file_get_contents('php://input'), true);

    // Kiểm tra dữ liệu đầu vào
    if (isset($data['product_id'], $data['image_id'])) {
        $productId = intval($data['product_id']);
        $imageId = intval($data['image_id']);

        // Gọi hàm SetDefaultImage
        $result = setDefaultImage($productId, $imageId);

        // Trả về kết quả
        echo json_encode($result, JSON_PRETTY_PRINT);
    } else {
        throw new Exception("Thiếu thông tin: product_id hoặc image_id.");
    }
} catch (Exception $e) {
    // Xử lý lỗi và trả về thông báo lỗi
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>