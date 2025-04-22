<?php
header("Access-Control-Allow-Origin: *"); 
header("Content-Type: application/json; charset=UTF-8");

require_once '../config.php';

try {
    $data = getDiscountCodes(); // Gọi hàm lấy danh sách
    echo json_encode(["status" => "success", "data" => $data], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>