<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once '../config.php';

if(isset($_GET['id'])) {
    $accountId = $_GET['id'];

    $response = countCartItems( $accountId);

    if ($response === 0) {
        // Nếu không có dữ liệu, trả về thông báo lỗi
        echo json_encode([
            'status' => 'error',
            'message' => 'Không tìm thấy dữ liệu trong giỏ hàng với account_id: ' . $accountId
        ]);
    } else {
        // Nếu có dữ liệu, trả về kết quả
        echo json_encode([
            'status' => 'success',
            'data' => $response
        ]);
    }
} else {
    // Trường hợp không có tham số 'id'
    echo json_encode([
        'status' => 'error',
        'message' => 'ID không được cung cấp!'
    ]);
}
?>