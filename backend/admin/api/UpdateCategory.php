<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../config.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["category_id"]) && isset($data["category_name"])) {
        $categoryId = $data["category_id"];
        $categoryName = $data["category_name"];

        $affectedRows = updateCategory($categoryId, $categoryName);

        if ($affectedRows > 0) {
            echo json_encode(["status" => "success", "message" => "category status updated successfully"], JSON_PRETTY_PRINT);
        } else {
            throw new Exception("No changes made or category not found");
        }
    } else {
        throw new Exception("category_id and status are required");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>