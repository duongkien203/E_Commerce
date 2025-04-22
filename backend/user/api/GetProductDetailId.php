<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once '../config.php';

if(isset($_GET['id'])) {
    $tableName = 'product_details';
    $columnName = 'product_detail_id';
    $productDetailId = $_GET['id'];

    $response = fetchDataById($tableName, $columnName, $productDetailId);

    if (empty($response)) {
        // Nếu không có dữ liệu, trả về thông báo lỗi
        echo json_encode([
            'status' => 'error',
            'message' => 'Không tìm thấy dữ liệu trong bảng: ' . $tableName . ' với ID: ' . $id
        ]);
    } else {
        // Nếu có dữ liệu, trả về kết quả
        echo json_encode([
            'status' => 'success',
            'data' => $response
        ]);
    }
} else {
    // Trường hợp không có tham số 'table', 'columnName' hoặc 'id'
    echo json_encode([
        'status' => 'error',
        'message' => 'Tên bảng, tên cột hoặc ID không được cung cấp!'
    ]);
}
?>