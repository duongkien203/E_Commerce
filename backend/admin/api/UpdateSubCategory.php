<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép từ nguồn localhost:3000
header("Access-Control-Allow-Methods: PUT, OPTIONS"); // Phương thức PUT
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Cho phép header Content-Type
header("Access-Control-Allow-Credentials: true"); // Xác thực cookies nếu cần

require_once '../config.php'; // Include file cấu hình cơ sở dữ liệu

try {
    $data = json_decode(file_get_contents("php://input"), true); // Lấy dữ liệu từ body request
    if (isset($data["subcategory_id"]) && isset($data["category_id"]) && isset($data["subcategory_name"])) {
        $subCategoryId = $data["subcategory_id"]; // ID danh mục con
        $categoryId = $data["category_id"]; // ID danh mục cha
        $subCategoryName = $data["subcategory_name"]; // Tên danh mục con

        $affectedRows = updateSubCategory($subCategoryId, $categoryId, $subCategoryName); // Gọi hàm cập nhật danh mục con

        if ($affectedRows > 0) {
            echo json_encode([
                "status" => "success",
                "message" => "Subcategory updated successfully"
            ], JSON_PRETTY_PRINT);
        } else {
            throw new Exception("No changes made or subcategory not found");
        }
    } else {
        throw new Exception("subcategory_id, category_id, and subcategory_name are required");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>