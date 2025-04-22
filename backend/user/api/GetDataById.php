<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once '../config.php';

// Kiểm tra xem tham số 'table', 'columnName' và 'id' có được truyền vào không
if(isset($_GET['table']) && isset($_GET['columnName']) && isset($_GET['id'])) {
    $tableName = $_GET['table'];
    $columnName = $_GET['columnName'];
    $id = $_GET['id'];
    $fetchType = isset($_GET['fetchType']) ? $_GET['fetchType'] : null; // Kiểm tra fetchType

    if($fetchType === 'all') {
        // Gọi hàm lấy tất cả dữ liệu từ bảng
        $response = fetchDataById($tableName, $columnName, $id, 'all');
    } else {
        // Gọi hàm lấy dữ liệu từ bảng theo id
        $response = fetchDataById($tableName, $columnName, $id);
    }

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