<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../config.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["account_id"]) && isset($data["status"])) {
        $accountId = $data["account_id"];
        $status = $data["status"];

        $affectedRows = updateAccountStatus($accountId, $status);

        if ($affectedRows > 0) {
            echo json_encode(["status" => "success", "message" => "Account status updated successfully"], JSON_PRETTY_PRINT);
        } else {
            throw new Exception("No changes made or account not found");
        }
    } else {
        throw new Exception("account_id and status are required");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>