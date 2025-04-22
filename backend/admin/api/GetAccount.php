<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Bao gồm file chứa các hàm kết nối và lấy dữ liệu
require_once '../config.php';

// Lấy dữ liệu JSON từ request body
$input = json_decode(file_get_contents('php://input'), true);

// Kiểm tra xem tham số có được truyền vào không
if(isset($input['loginType'])) {
    $loginType = $input['loginType'];
    $username = $input['username'];
    $password = $input['password'];
    $role = '1';
    
    // Gọi hàm lấy dữ liệu từ bảng
    $response = fetchAccount($loginType, $username, $password, $role);

    if (empty($response)) {
        // Nếu không có dữ liệu, trả về thông báo lỗi
        echo json_encode([
            'status' => 'error',
            'message' => 'Lấy tài khoản thất bại!'
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
        'message' => 'Lấy tài khoản thất bại!'
    ]);
}

?>