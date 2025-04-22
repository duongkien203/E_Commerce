<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép từ nguồn localhost:3000
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Phương thức POST
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Cho phép header Content-Type
header("Access-Control-Allow-Credentials: true"); // Xác thực cookies nếu cần

require_once '../config.php'; // Include file cấu hình cơ sở dữ liệu

try {
    $data = json_decode(file_get_contents('php://input'), true); // Lấy dữ liệu từ body request
    if (isset($data['category_id']) && isset($data['subcategory_name'])) {
        $categoryId = $data['category_id']; // ID danh mục cha
        $subCategoryName = $data['subcategory_name']; // Tên danh mục con

        $subCategoryId = addSubCategory($categoryId, $subCategoryName); // Gọi hàm thêm danh mục con

        echo json_encode([
            "status" => "success",
            "message" => "Subcategory added successfully",
            "subcategory_id" => $subCategoryId
        ], JSON_PRETTY_PRINT);
    } else {
        throw new Exception("category_id and subcategory_name are required");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>