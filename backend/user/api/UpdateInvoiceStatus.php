<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép từ nguồn localhost:3000
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Phương thức POST
header("Access-Control-Allow-Headers: Content-Type"); // Cho phép header Content-Type
header("Content-Type: application/json");

require_once '../config.php'; // Include file cấu hình cơ sở dữ liệu

try {
    // Lấy dữ liệu từ body request
    $data = json_decode(file_get_contents("php://input"), true);

    // Kiểm tra dữ liệu đầu vào
    if (isset($data["invoice_id"], $data["status"])) {
        $invoiceId = $data["invoice_id"]; // Giữ nguyên kiểu chuỗi nếu invoice_id là chuỗi trong DB
        $status = $data["status"]; // Trạng thái mới

        // Gọi hàm cập nhật trạng thái hóa đơn
        $affectedRows = updateInvoiceStatus($invoiceId, $status);

        if ($affectedRows > 0) {
            // Nếu trạng thái là "completed", cập nhật payment_status
            if ($status === "completed") {
                $paymentStatus = "paid";
                $paymentResult = updatePaymentStatus($invoiceId, $paymentStatus);

                if (!$paymentResult) { // Giả sử updatePaymentStatus trả về true/false
                    echo json_encode([
                        "status" => "error",
                        "message" => "Failed to update payment status"
                    ], JSON_PRETTY_PRINT);
                    exit;
                }
            }
            // Nếu trạng thái là "cancelled", khôi phục số lượng tồn kho
            elseif ($status === "cancelled") {
                $restoreResult = restoreStockOnCancel($invoiceId);

                if (!$restoreResult['success']) {
                    echo json_encode([
                        "status" => "error",
                        "message" => "Invoice status updated but failed to restore stock: " . $restoreResult['message']
                    ], JSON_PRETTY_PRINT);
                    exit;
                }
            }

            echo json_encode([
                "status" => "success",
                "message" => "Invoice status updated successfully" . 
                    ($status === "cancelled" ? " and stock restored" : "")
            ], JSON_PRETTY_PRINT);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "No changes made or invoice not found"
            ], JSON_PRETTY_PRINT);
        }
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Missing required fields (invoice_id or status)"
        ], JSON_PRETTY_PRINT);
    }
} catch (Exception $e) {
    // Trả về lỗi
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>