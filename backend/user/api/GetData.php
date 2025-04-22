<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Bao gồm file chứa các hàm kết nối và lấy dữ liệu
require_once '../config.php';

// Kiểm tra xem tham số 'table' có được truyền vào không
if(isset($_GET['table'])) {
    $tableName = $_GET['table'];
    
    // Gọi hàm lấy dữ liệu từ bảng
    $response = fetchDataFromTable($tableName);

    if (empty($response)) {
        // Nếu không có dữ liệu, trả về thông báo lỗi
        echo json_encode([
            'status' => 'error',
            'message' => 'Không tìm thấy dữ liệu trong bảng: ' . $tableName
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
        'message' => 'Tên bảng không được cung cấp!'
    ]);
}
?>