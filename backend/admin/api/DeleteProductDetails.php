<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép từ nguồn localhost:3000
header("Access-Control-Allow-Methods: DELETE, OPTIONS"); // Phương thức DELETE
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Cho phép header Content-Type
header("Access-Control-Allow-Credentials: true"); // Xác thực cookies nếu cần

require_once '../config.php'; // Include file cấu hình cơ sở dữ liệu

try {
    // Lấy dữ liệu từ body của request
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["product_detail_id"])) {
        $productDetailId = intval($data["product_detail_id"]); // Lấy ID chi tiết sản phẩm từ body
        $response = deleteProductDetails($productDetailId); // Gọi hàm xóa sản phẩm
        echo $response; // Trả về phản hồi từ hàm
    } else {
        throw new Exception("product_detail_id is required in the request body");
    }
} catch (Exception $e) {
    // Trả về lỗi trong trường hợp xảy ra ngoại lệ
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>