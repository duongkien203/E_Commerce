<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config.php'; // Kết nối database

// Lấy dữ liệu POST dạng thô
$jsonData = file_get_contents('php://input');
// Giải mã dữ liệu JSON thành mảng kết hợp PHP
$data = json_decode($jsonData, true);

// Kiểm tra xem có dữ liệu POST từ form không
if (!empty($data['id']) && !empty($data['addressId'])) {
    $accountId = $data['id'];
    $addressId = $data['addressId'];

    echo setDefaultAddress($accountId, $addressId);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Thiếu dữ liệu']);
}
?>