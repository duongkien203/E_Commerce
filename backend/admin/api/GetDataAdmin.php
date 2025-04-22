<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once '../config.php';

// Kiểm tra xem tham số 'table', 'columnName' và 'id' có được truyền vào không
if(isset($_GET['id'])) {
    $tableName ='accounts';
    $columnName = 'account_id';
    $id = $_GET['id'];

    $response = fetchDataById($tableName, $columnName, $id);

    if (empty($response)) {
        // Nếu không có dữ liệu, trả về thông báo lỗi
        echo json_encode([
            'status' => 'error',
            'message' => 'Không tìm thấy dữ liệu trong bảng: tài khoản'. ' với ID: ' . $id
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
        'message' => 'Tên ID không được cung cấp!'
    ]);
}
?>