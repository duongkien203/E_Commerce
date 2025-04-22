<?php

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

date_default_timezone_set('Asia/Ho_Chi_Minh');

$vnp_TmnCode = "10JOWESO"; // Mã website tại VNPAY
$vnp_HashSecret = "JZ0Q4SLK5HGVVEDF6G3XHWVSVXQ54LIU"; // Chuỗi bí mật
$vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
$vnp_Returnurl = "http://localhost:3000/order-result"; // URL trả về sau khi thanh toán

// Lấy dữ liệu từ request
$data = json_decode(file_get_contents("php://input"), true);
// file_put_contents("debug_log.txt", print_r($data, true));

$amount = $data['amount']; // Số tiền thanh toán
$orderId = strval($data['invoiceId']); // Ép kiểu về string

// Tạo request thanh toán
$vnp_TxnRef = $orderId;
$vnp_OrderInfo = "Thanh toán đơn hàng " . $orderId;
$vnp_OrderType = "billpayment";
$vnp_Amount = $amount * 100; // Đơn vị là VND x 100
$vnp_Locale = "vn";
$vnp_BankCode = "";
$vnp_IpAddr = $_SERVER['REMOTE_ADDR'];

$inputData = array(
    "vnp_Version" => "2.1.0",
    "vnp_TmnCode" => $vnp_TmnCode,
    "vnp_Amount" => $vnp_Amount,
    "vnp_Command" => "pay",
    "vnp_CreateDate" => date('YmdHis'),
    "vnp_CurrCode" => "VND",
    "vnp_IpAddr" => $vnp_IpAddr,
    "vnp_Locale" => $vnp_Locale,
    "vnp_OrderInfo" => $vnp_OrderInfo,
    "vnp_OrderType" => $vnp_OrderType,
    "vnp_ReturnUrl" => $vnp_Returnurl,
    "vnp_TxnRef" => $vnp_TxnRef
);

ksort($inputData);
$query = "";
$i = 0;
$hashdata = "";
foreach ($inputData as $key => $value) {
    if ($i == 1) {
        $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
    } else {
        $hashdata .= urlencode($key) . "=" . urlencode($value);
        $i = 1;
    }
    $query .= urlencode($key) . "=" . urlencode($value) . '&';
}

$vnp_Url .= "?" . $query;
if (isset($vnp_HashSecret)) {
    $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
    $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
}

// Trả về URL cho frontend
echo json_encode(["status" => "success", "payment_url" => $vnp_Url]);
?>