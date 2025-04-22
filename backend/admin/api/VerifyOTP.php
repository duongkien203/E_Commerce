<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config.php'; // Kết nối database

// Lấy dữ liệu từ body của POST request
$data = json_decode(file_get_contents("php://input"), true);

if(isset($data['account_id']) && isset($data['otp'])) {
    $account_id = $data['account_id'];
    $otp = $data['otp'];

    // Lấy reset_token từ database
    $reset_token = fetchDataColumnById('reset_token', 'accounts', 'account_id', $account_id);

    if (empty($reset_token)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Không tìm thấy OTP!'
        ]);
        exit();
    }


    // Kiểm tra xem OTP có khớp không
if ($otp === $reset_token) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Xác thực OTP thành công!'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Mã OTP không chính xác!',
        'otp' => $otp,
        'reset_token' => $reset_token
    ]);
}

} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Thiếu tham số account_id hoặc otp!'
    ]);
}
?>