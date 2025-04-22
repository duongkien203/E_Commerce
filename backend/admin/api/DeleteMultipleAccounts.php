<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../config.php';

try {
    // Nhận dữ liệu từ yêu cầu
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["account_ids"]) && is_array($data["account_ids"])) {
        $accountIds = $data["account_ids"];
        $successCount = 0;
        $errorCount = 0;

        foreach ($accountIds as $accountId) {
            $affectedRows = deleteAccount($accountId); // Hàm này thực hiện việc xóa tài khoản

            if ($affectedRows > 0) {
                $successCount++;
            } else {
                $errorCount++;
            }
        }

        echo json_encode([
            "status" => "success",
            "message" => "Accounts processed",
            "details" => [
                "deleted" => $successCount,
                "failed" => $errorCount
            ]
        ], JSON_PRETTY_PRINT);
    } else {
        throw new Exception("account_ids must be a valid array");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>