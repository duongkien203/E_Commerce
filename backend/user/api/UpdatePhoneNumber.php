<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
date_default_timezone_set('Asia/Ho_Chi_Minh');

require_once '../config.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

if (!isset($data['account_id']) || !isset($data['new_phone_number'])) {
    echo json_encode(['status' => 'error', 'message' => 'Thiếu thông tin cần thiết']);
    exit;
}

$accountId = $data['account_id'];
$newPhoneNumber = $data['new_phone_number'];

$response = updatePhoneNumber($accountId, $newPhoneNumber);
echo json_encode($response);