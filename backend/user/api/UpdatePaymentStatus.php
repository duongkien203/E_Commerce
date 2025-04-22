<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
date_default_timezone_set('Asia/Ho_Chi_Minh');

require_once '../config.php'; // Kết nối database
require_once '../SendNotification.php'; // Import hàm gửi email xác nhận thanh toán

// Lấy dữ liệu POST dạng thô
$jsonData = file_get_contents('php://input');
// Giải mã dữ liệu JSON thành mảng kết hợp PHP
$data = json_decode($jsonData, true);

// Kiểm tra dữ liệu đầu vào
if (!empty($data['invoiceId']) && !empty($data['status']) && !empty($data['email']) && isset($data['amount'])) {
    $invoiceId = $data['invoiceId'];
    $status = $data['status'];
    $email = $data['email'];
    $amount = $data['amount'];

    // Gọi hàm updatePaymentStatus để cập nhật trạng thái thanh toán
    $updateSuccess = updatePaymentStatus($invoiceId, $status);

    if (!$updateSuccess) {
        // Nếu cập nhật thanh toán thất bại
        echo json_encode([
            'status' => 'error',
            'message' => 'Cập nhật trạng thái thanh toán thất bại!'
        ]);
    } else {
        // Nếu cập nhật thanh toán thành công
        if ($status === 'paid') {
            // Lấy ngày thanh toán hiện tại
            $paymentDate = date("d/m/Y H:i:s");

            // Cập nhật trạng thái đơn hàng sang "pending confirmation"
            $orderStatusUpdated = updateOrderStatusAfterPayment($invoiceId, "pending confirmation");

            // Kết nối database
            $conn = connectDB();

            // Lấy thông tin đơn hàng từ bảng invoices
            $invoiceQuery = "SELECT order_date, amount_sum FROM invoices WHERE invoice_id = ?";
            $stmt = $conn->prepare($invoiceQuery);
            $stmt->bind_param("i", $invoiceId);
            $stmt->execute();
            $invoiceResult = $stmt->get_result();

            if ($invoiceResult->num_rows > 0) {
                $invoiceData = $invoiceResult->fetch_assoc();
                $orderDate = $invoiceData['order_date'];
                $totalAmount = $invoiceData['amount_sum'];

                // Lấy chi tiết sản phẩm từ bảng invoice_details
                $productsQuery = "SELECT product_name, product_color, product_size, purchase_quantity, sale_price 
                                 FROM invoice_details WHERE invoice_id = ?";
                $stmtProducts = $conn->prepare($productsQuery);
                $stmtProducts->bind_param("i", $invoiceId);
                $stmtProducts->execute();
                $productsResult = $stmtProducts->get_result();
                $products = [];

                while ($product = $productsResult->fetch_assoc()) {
                    $products[] = $product;
                }

                // Gọi hàm gửi email với thông tin bổ sung
                $emailSent = sendPaymentConfirmationEmail(
                    $email,
                    $invoiceId,
                    $totalAmount,
                    $paymentDate,
                    $orderDate,
                    $products
                );

                // Xử lý phản hồi dựa trên trạng thái gửi email và cập nhật đơn hàng
                if ($orderStatusUpdated['success'] && $emailSent) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Cập nhật trạng thái thanh toán, trạng thái đơn hàng và gửi email thành công!'
                    ]);
                } elseif ($orderStatusUpdated['success']) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Cập nhật trạng thái thanh toán và đơn hàng thành công, nhưng gửi email thất bại!'
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Cập nhật trạng thái thanh toán thành công nhưng cập nhật trạng thái đơn hàng hoặc gửi email thất bại!'
                    ]);
                }
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Không tìm thấy thông tin đơn hàng!'
                ]);
            }

            $stmt->close();
            $stmtProducts->close();
            $conn->close();
        } else {
            // Nếu trạng thái không phải "paid", chỉ trả về thông báo thành công
            echo json_encode([
                'status' => 'success',
                'message' => 'Cập nhật trạng thái thanh toán thành công!'
            ]);
        }
    }
} else {
    // Trả về thông báo lỗi nếu thiếu dữ liệu
    echo json_encode([
        'status' => 'error',
        'message' => 'Thiếu dữ liệu (invoiceId, status, email hoặc amount)'
    ]);
}
?>