<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config.php';

try {
    if (isset($_GET['discount_id'])) {
        $response = deleteDiscountCode($_GET['discount_id']);
        echo $response;
    } else {
        throw new Exception("discount_id is required.");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>