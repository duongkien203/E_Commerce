<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Bao gồm file chứa các hàm kết nối và lấy dữ liệu
require_once '../config.php';

// Kiểm tra xem tham số có được truyền vào không
if (isset($_GET['userType']) && isset($_GET['username'])) {
    $userType = $_GET['userType'];
    $username = $_GET['username'];

    // Gọi hàm kiểm tra tài khoản
    $response = forgotPassword($userType, $username);

    if ($response) {
        echo json_encode($response);
    } else {
        // Trả về thông báo lỗi nếu thiếu dữ liệu
        echo json_encode(['status' => 'error', 'message' => 'Dữ liệu không hợp lệ']);
    }
} else {
    // Nếu không phải là POST, trả về lỗi 405
    echo json_encode(['status' => 'error', 'message' => 'Phương thức không hợp lệ']);
}
?>