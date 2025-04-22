<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép từ nguồn localhost:3000
header("Access-Control-Allow-Methods: DELETE, OPTIONS"); // Phương thức DELETE
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Cho phép header Content-Type
header("Access-Control-Allow-Credentials: true"); // Xác thực cookies nếu cần

require_once '../config.php'; // Include file cấu hình cơ sở dữ liệu

try {
    // Lấy dữ liệu JSON từ body của request
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["subcategory_ids"]) && is_array($data["subcategory_ids"])) {
        $subCategoryIds = $data["subcategory_ids"];
        $successCount = 0;
        $errorCount = 0;

        foreach ($subCategoryIds as $subCategoryId) {
            $affectedRows = deleteSubCategory($subCategoryId); // Gọi hàm xóa danh mục con

            if ($affectedRows > 0) {
                $successCount++;
            } else {
                $errorCount++;
            }
        }

        // Trả về kết quả JSON
        echo json_encode([
            "status" => "success",
            "message" => "Subcategories processed",
            "details" => [
                "deleted" => $successCount,
                "failed" => $errorCount
            ]
        ], JSON_PRETTY_PRINT);
    } else {
        throw new Exception("subcategory_ids must be a valid array in the request body.");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>