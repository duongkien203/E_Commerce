<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

date_default_timezone_set('Asia/Ho_Chi_Minh');

// Nhận dữ liệu từ frontend
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['amount']) || !is_numeric($data['amount'])) {
    echo json_encode(["error" => "Số tiền không hợp lệ"]);
    exit();
}

if (!isset($data['invoiceId'])) {
    echo json_encode(["error" => "Thiếu mã đơn hàng"]);
    exit();
}

$amount = strval($data['amount']); // Ép kiểu về string
$orderId = strval($data['invoiceId']); // Ép kiểu về string

// Thông tin Merchant (Môi trường test)
$partnerCode = "MOMO";
$accessKey = "F8BBA842ECF85";
$secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
$requestId = time() . "";
$orderInfo = "Thanh toán đơn hàng " . $orderId;
$redirectUrl = "http://localhost:3000/order-result"; // URL khách sẽ quay về sau khi thanh toán
$ipnUrl = "http://localhost:3000/ipn"; // URL MoMo sẽ gửi kết quả thanh toán
$extraData = "";



// Tạo chữ ký (signature)
$rawData = "accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=payWithATM";
$signature = hash_hmac("sha256", $rawData, $secretKey);

// Chuẩn bị dữ liệu gửi MoMo
$requestData = [
    "partnerCode" => $partnerCode,
    "accessKey" => $accessKey,
    "requestId" => $requestId,
    "amount" => $amount,
    "orderId" => $orderId,
    "orderInfo" => $orderInfo,
    "redirectUrl" => $redirectUrl,
    "ipnUrl" => $ipnUrl,
    "extraData" => $extraData,
    "requestType" => "payWithATM",
    // "requestType" => "captureWallet",
    // "requestType" => "payWithCC",
    "signature" => $signature,
    "lang" => "vi"
];

// Gửi request đến MoMo
$ch = curl_init("https://test-payment.momo.vn/v2/gateway/api/create");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));

$response = curl_exec($ch);
curl_close($ch);

// Trả kết quả về frontend
echo $response;

?>