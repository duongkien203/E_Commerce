<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
require_once '../config.php';

try {
    $data = json_decode(file_get_contents('php://input'), true); // Lấy dữ liệu từ body request
    if (isset($data['role_id']) && isset($data['role_name'])) {
        $roleId = $data['role_id'];
        $roleName = $data['role_name'];
        $affectedRows = updateRole($roleId, $roleName); // Gọi hàm cập nhật vai trò

        if ($affectedRows > 0) {
            echo json_encode(["status" => "success", "message" => "Role updated successfully"], JSON_PRETTY_PRINT);
        } else {
            throw new Exception("No role found with the given ID or no changes made");
        }
    } else {
        throw new Exception("role_id and role_name are required");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>