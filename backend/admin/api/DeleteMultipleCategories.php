<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../config.php';

try {
    // Lấy dữ liệu từ yêu cầu
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["category_ids"]) && is_array($data["category_ids"])) {
        $categoryIds = $data["category_ids"];
        $successCount = 0;
        $errorCount = 0;

        foreach ($categoryIds as $categoryId) {
            $affectedRows = deleteCategory($categoryId); // Gọi hàm xóa danh mục

            if ($affectedRows > 0) {
                $successCount++;
            } else {
                $errorCount++;
            }
        }

        echo json_encode([
            "status" => "success",
            "message" => "Categories processed",
            "details" => [
                "deleted" => $successCount,
                "failed" => $errorCount
            ]
        ], JSON_PRETTY_PRINT);
    } else {
        throw new Exception("category_ids must be a valid array");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>