<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
date_default_timezone_set('Asia/Ho_Chi_Minh');

require_once '../config.php'; // Kết nối database

// Lấy dữ liệu JSON từ request
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Kiểm tra dữ liệu hóa đơn và danh sách sản phẩm
if (!empty($data['invoiceId']) && !empty($data['accountId']) && !empty($data['itemTotal'])
    && isset($data['discount']) && !empty($data['amountSum']) && !empty($data['paymentStatus'])
    && !empty($data['shippingInformation']) && !empty($data['status']) && !empty($data['orderItems'])
    && is_array($data['orderItems'])) { 

    $orderDate = date("Y-m-d H:i:s"); // Định dạng: YYYY-MM-DD HH:MM:SS

    // Lấy thông tin hóa đơn
    $invoiceId = $data['invoiceId'];
    $accountId = $data['accountId'];
    $itemTotal = $data['itemTotal'];
    $discountId = isset($data['discountId']) ? $data['discountId'] : null;
    $discount = $data['discount'];
    $amountSum = $data['amountSum'];
    $paymentStatus = $data['paymentStatus'];
    $shippingInformation = $data['shippingInformation'];
    $status = $data['status'];
    $orderItems = $data['orderItems']; // Mảng sản phẩm

    // Thêm hóa đơn vào bảng invoices
    $invoiceResponse = json_decode(addInvoices($invoiceId, $accountId, $orderDate, $itemTotal, $discount, $amountSum, $paymentStatus, $shippingInformation, $status), true);

    if ($invoiceResponse['message'] !== 'Đơn hàng đã được thêm thành công!') {
        echo json_encode(['status' => 'error', 'message' => 'Thêm hóa đơn thất bại!']);
        exit();
    }

    // Duyệt qua danh sách sản phẩm và thêm vào bảng invoice_details
    $productResponses = [];
    foreach ($orderItems as $item) {
        if (!empty($item['productId']) && !empty($item['productDetailId']) && !empty($item['productName']) && !empty($item['colorName']) && !empty($item['sizeName']) 
            && !empty($item['purchaseQuantity']) && isset($item['price']) && isset($item['salePrice'])) {

            $productResponse = json_decode(addInvoiceDetails($invoiceId, $item['productId'],$item['productDetailId'], $item['productName'],
            $item['colorName'], $item['sizeName'], $item['purchaseQuantity'], $item['price'], $item['salePrice']), true);

            $productResponses[] = $productResponse;
        } else {
            $productResponses[] = ['message' => 'Dữ liệu sản phẩm không hợp lệ!'];
        }
    }

    if ($discountId !== null) {
        $result = updateQuantityDiscount($discountId);
        if (!$result['success']) {
            echo json_encode(['status' => 'error', 'message' => $result['message']]);
            exit();
        }
    }

    // Trả về phản hồi JSON
    echo json_encode([
        'status' => 'success',
        'message' => 'Hóa đơn và chi tiết sản phẩm đã được thêm!',
        'invoice' => $invoiceResponse,
        'products' => $productResponses
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Thiếu dữ liệu hoặc danh sách sản phẩm không hợp lệ!']);
}
?>