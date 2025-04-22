<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['code'], $data['description'], $data['discount_value'], $data['quantity'], $data['start_date'], $data['end_date'])) {
        $response = addDiscountCode(
            $data['code'], $data['description'], $data['discount_value'], 
            $data['quantity'], $data['start_date'], $data['end_date']
        );
        echo $response; // Phản hồi từ hàm addDiscountCode
    } else {
        throw new Exception("All fields are required.");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>