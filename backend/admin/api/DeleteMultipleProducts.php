<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép từ nguồn localhost:3000
header("Access-Control-Allow-Methods: DELETE, OPTIONS"); // Phương thức DELETE
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Cho phép header Content-Type
header("Access-Control-Allow-Credentials: true"); // Xác thực cookies nếu cần

require_once '../config.php'; // Include file cấu hình cơ sở dữ liệu

try {
    // Lấy dữ liệu từ body của request
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["product_ids"]) && is_array($data["product_ids"])) {
        $productIds = $data["product_ids"];
        $successCount = 0;
        $errorCount = 0;

        foreach ($productIds as $productId) {
            $affectedRows = deleteProduct($productId); // Gọi hàm xóa sản phẩm

            if ($affectedRows > 0) {
                $successCount++;
            } else {
                $errorCount++;
            }
        }

        // Trả về phản hồi JSON
        echo json_encode([
            "status" => "success",
            "message" => "Products processed",
            "details" => [
                "deleted" => $successCount,
                "failed" => $errorCount
            ]
        ], JSON_PRETTY_PRINT);
    } else {
        throw new Exception("product_ids must be a valid array in the request body");
    }
} catch (Exception $e) {
    // Trả về lỗi trong trường hợp xảy ra ngoại lệ
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>