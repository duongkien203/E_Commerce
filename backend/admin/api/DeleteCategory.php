<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../config.php';

try {
    if (isset($_GET["category_id"])) {
        $categoryId = intval($_GET["category_id"]);
        echo deleteCategory($categoryId);
    } else {
        throw new Exception("category_id is required");
    }    
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>