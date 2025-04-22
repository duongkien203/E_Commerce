<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once '../config.php';

try {
    // Kiểm tra xem `category_id` có được truyền không
    if (isset($_GET['category_id'])) {
        $categoryId = intval($_GET['category_id']); // Lấy giá trị category_id và ép thành số nguyên
        $data = getSubCategories($categoryId); // Gọi hàm getSubCategories với category_id
        echo json_encode(["status" => "success", "data" => $data], JSON_PRETTY_PRINT);
    } else {
        throw new Exception("category_id is required");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>