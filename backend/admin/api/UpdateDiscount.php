<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['discount_id'], $data['code'], $data['description'], $data['discount_value'], $data['quantity'], $data['start_date'], $data['end_date'])) {
        $response = updateDiscountCode(
            $data['discount_id'], $data['code'], $data['description'], $data['discount_value'], 
            $data['quantity'], $data['start_date'], $data['end_date']
        );
        
        // Phản hồi trực tiếp từ hàm
        echo json_encode($response, JSON_PRETTY_PRINT);
    } else {
        throw new Exception("All fields are required.");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>