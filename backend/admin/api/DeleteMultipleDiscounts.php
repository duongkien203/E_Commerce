<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config.php';

try {
    // Lấy dữ liệu từ request body
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["discount_ids"]) && is_array($data["discount_ids"])) {
        $discountIds = $data["discount_ids"];
        $successCount = 0;
        $errorCount = 0;

        foreach ($discountIds as $discountId) {
            $affectedRows = deleteDiscountCode($discountId); // Gọi hàm xóa discount

            if ($affectedRows > 0) {
                $successCount++;
            } else {
                $errorCount++;
            }
        }

        echo json_encode([
            "status" => "success",
            "message" => "Discount codes processed",
            "details" => [
                "deleted" => $successCount,
                "failed" => $errorCount
            ]
        ], JSON_PRETTY_PRINT);
    } else {
        throw new Exception("discount_ids must be a valid array.");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>