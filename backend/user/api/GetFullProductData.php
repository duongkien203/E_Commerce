<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once '../config.php';

if (isset($_GET['id'])) {
    $accountId = $_GET['id'];

    // Gọi hàm lấy dữ liệu
    $response = getFullProductData($accountId);

    if (empty($response)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Không tìm thấy dữ liệu trong bảng cart với ID: ' . $accountId
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    } else {
        echo json_encode([
            'status' => 'success',
            'data' => $response
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Thiếu ID tài khoản!'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
exit;
?>