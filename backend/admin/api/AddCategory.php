<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép từ nguồn localhost:3000
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE"); // Cho phép các phương thức HTTP
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Cho phép header Content-Type, Authorization
header("Access-Control-Allow-Credentials: true"); // Nếu cần xác thực cookies

require_once '../config.php';

try {
    $data = json_decode(file_get_contents('php://input'), true); // Lấy dữ liệu từ body request
    if (isset($data['category_name'])) {
        $categoryName = $data['category_name'];
        $categoryId = addCategory($categoryName); // Gọi hàm thêm vai trò

        echo json_encode(["status" => "success", "message" => "Category added successfully", "category_id" => $categoryId], JSON_PRETTY_PRINT);
    } else {
        throw new Exception("category_name is required");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>