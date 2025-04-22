<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Bao gồm file chứa các hàm kết nối và lấy dữ liệu
require_once '../config.php';

// Kiểm tra xem tham số có được truyền vào không
if(isset($_GET['id'])) {
    $account_id = $_GET['id'];
    $columnName = $_GET['columnName'];
    $tableName = $_GET['tableName'];
    $condition = $_GET['condition'];
    
    // Gọi hàm lấy dữ liệu từ bảng
    $response = fetchDataColumnById($columnName, $tableName, $condition, $account_id);

    if (empty($response)) {
        // Nếu không có dữ liệu, trả về thông báo lỗi
        echo json_encode([
            'status' => 'error',
            'message' => 'Lấy dữ liệu thất bại!'
        ]);
    } else {
        // Nếu có dữ liệu, trả về kết quả
        echo json_encode([
            'status' => 'success',
            'data' => $response
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Lấy dữ liệu thất bại!'
    ]);
}
?>