<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../config.php'; // Gọi file kết nối và chứa hàm xử lý DB

try {
    $data = json_decode(file_get_contents('php://input'), true); // Lấy dữ liệu từ body request

    // Kiểm tra dữ liệu đầu vào
    if (isset($data['product_id'], $data['color_id'], $data['size_id'], $data['quantity'])) {
        $productId = intval($data['product_id']);
        $colorId = intval($data['color_id']);
        $sizeId = intval($data['size_id']);
        $quantity = intval($data['quantity']);

        $result = addProductDetails($productId, $colorId, $sizeId, $quantity);

        // Trả về phản hồi
        $response = ["status" => "success"];

        if ($result === "updated") {
            $response["message"] = "Cập nhật sản phẩm thành công";
        } else {
            $response["message"] = "Thêm sản phẩm thành công";
        }

        echo json_encode($response, JSON_PRETTY_PRINT);

    } else {
        throw new Exception("Thiếu thông tin: product_id, color_id, size_id, quantity");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>