<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Bao gồm file chứa các hàm kết nối và lấy dữ liệu
require_once '../config.php';

// Kiểm tra xem tham số 'id' có được truyền vào không
if(isset($_GET['id'])) {
    $id = $_GET['id'];
    
    // Gọi hàm lấy dữ liệu từ bảng
    $response = fetchDefaultImage($id);

    if (empty($response)) {
        // Nếu không có dữ liệu, trả về thông báo lỗi
        echo json_encode([
            'status' => 'error',
            'message' => 'Lấy ảnh thất bại!'
        ]);
    } else {
        // Nếu có dữ liệu, trả về kết quả
        echo json_encode([
            'status' => 'success',
            'data' => $response
        ]);
    }
} else {
    // Trường hợp không có tham số 'table'
    echo json_encode([
        'status' => 'error',
        'message' => 'Lấy ảnh thất bại!'
    ]);
}
?>