<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../config.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["role_id"])) {
        $roleId = $data["role_id"];
        $affectedRows = deleteRole($roleId);

        if ($affectedRows > 0) {
            echo json_encode(["status" => "success", "message" => "Role deleted successfully"], JSON_PRETTY_PRINT);
        } else {
            throw new Exception("Role not found or already deleted");
        }
    } else {
        throw new Exception("role_id is required");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>