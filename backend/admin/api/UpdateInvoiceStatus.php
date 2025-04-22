<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép từ nguồn localhost:3000
header("Access-Control-Allow-Methods: PUT, OPTIONS"); // Phương thức PUT
header("Access-Control-Allow-Headers: Content-Type"); // Cho phép header Content-Type

require_once '../config.php'; // Include file cấu hình cơ sở dữ liệu

try {
    // Lấy dữ liệu từ body request
    $data = json_decode(file_get_contents("php://input"), true);

    // Kiểm tra dữ liệu đầu vào
    if (isset($data["invoice_id"], $data["status"])) {
        $invoiceId = intval($data["invoice_id"]); // Chuyển invoice_id thành kiểu số nguyên
        $status = $data["status"]; // Trạng thái mới

        // Gọi hàm cập nhật trạng thái hóa đơn
        $affectedRows = updateInvoiceStatus($invoiceId, $status);

        if ($affectedRows > 0) {
            echo json_encode([
                "status" => "success",
                "message" => "Invoice status updated successfully"
            ], JSON_PRETTY_PRINT);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "No changes made or invoice not found"
            ], JSON_PRETTY_PRINT);
        }
    } else {
        // Trả về lỗi nếu thiếu tham số
        throw new Exception("invoice_id and status are required");
    }
} catch (Exception $e) {
    // Trả về lỗi
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_PRETTY_PRINT);
}
?>