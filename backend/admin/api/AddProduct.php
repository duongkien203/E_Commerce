<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép từ nguồn localhost:3000
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Phương thức POST
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Cho phép header Content-Type
header("Access-Control-Allow-Credentials: true"); // Xác thực cookies nếu cần

require_once '../config.php'; // Include file cấu hình cơ sở dữ liệu

try {
    $data = json_decode(file_get_contents('php://input'), true); // Lấy dữ liệu từ body request

    // Kiểm tra dữ liệu đầu vào
    if (isset($data['category_id'], $data['subcategory_id'], $data['product_name'], $data['price'], $data['sale'], $data['description'], $data['action_by'])) {
        $categoryId = $data['category_id'];
        $subCategoryId = $data['subcategory_id'];
        $productName = $data['product_name'];
        $price = $data['price'];
        $sale = $data['sale'];
        $description = $data['description'];
        $actionBy = $data['action_by'] ?? 'unknown_user';

        // Gọi hàm thêm sản phẩm
        $productId = addProduct($categoryId, $subCategoryId, $productName, $price, $sale, $description);

        // Ghi lại lịch sử hành động
        addProductActivity($productId, 'create', $actionBy);

        // Trả về kết quả
        echo json_encode([
            "status" => "success",
            "message" => "Product added successfully",
            "product_id" => $productId
        ], JSON_PRETTY_PRINT);
    } else {
        throw new Exception("category_id, subcategory_id, product_name, price, sale, description and action_by are required");
    }
} catch (Exception $e) {
    // Trả về lỗi
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>