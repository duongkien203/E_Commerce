<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

if (!empty($data['id'])) {

    $response = fetchNotifications();

    if (empty($response)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Lấy thông báo thất bại'
        ]);
    } else {
        echo json_encode([
            'status' => 'success',
            'data' => $response
        ]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Thiếu dữ liệu']);
}
?>