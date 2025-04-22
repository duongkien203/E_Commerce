<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config.php'; // Kết nối database

// Lấy dữ liệu POST dạng thô
$jsonData = file_get_contents('php://input');
// Giải mã dữ liệu JSON thành mảng kết hợp PHP
$data = json_decode($jsonData, true);

// Kiểm tra xem có dữ liệu POST từ form không
if (!empty($data['id'])) {

    $accountId = $data['id'];
    $contactName = $data['contact_name'];
    $contactPhone = $data['contact_phone'];
    $address = $data['address'];
    $addressDetails = $data['address_details'];
    $addressDefault = $data['address_default'];

    $response = addAddress($accountId, $contactName, $contactPhone, $address, $addressDetails, $addressDefault);

    if (empty($response)) {
        // Nếu không có dữ liệu, trả về thông báo lỗi
        echo json_encode([
            'status' => 'error',
            'message' => 'Thêm địa chỉ thất bại!'
        ]);
    } else {
        // Nếu có dữ liệu, trả về kết quả
        echo json_encode([
            'status' => 'success',
            'data' => $response
        ]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Thiếu dữ liệu']);
}
?>