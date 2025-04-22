<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once '../config.php';

try {
    // Lấy product_id từ tham số GET của URL
    if (!isset($_GET['product_id'])) {
        throw new Exception('Missing product_id parameter');
    }

    $product_id = intval($_GET['product_id']);
    $data = getProductActivityHistory($product_id);

    echo json_encode(["status" => "success", "data" => $data], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>