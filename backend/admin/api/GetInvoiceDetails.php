<?php
header('Content-type: application/json'); // Định dạng JSON cho phản hồi
header('Access-Control-Allow-Origin: *'); // Cho phép tất cả nguồn truy cập
header('Access-Control-Allow-Methods: GET'); // Chỉ cho phép phương thức GET

require_once '../config.php'; // Include file cấu hình cơ sở dữ liệu

try {
    // Kiểm tra tham số đầu vào
    if (!isset($_GET['invoice_id'])) {
        throw new Exception('Missing invoice_id parameter'); // Nếu thiếu invoice_id thì báo lỗi
    }

    $invoice_id = intval($_GET['invoice_id']); // Chuyển invoice_id thành kiểu số nguyên

    // Gọi hàm getInvoiceDetails để lấy dữ liệu
    $data = getInvoiceDetails($invoice_id);

    // Kiểm tra nếu không có dữ liệu trả về
    if (empty($data)) {
        echo json_encode([
            "status" => "success",
            "message" => "No invoice details found for the provided invoice_id",
            "data" => []
        ], JSON_PRETTY_PRINT);
    } else {
        // Trả về kết quả nếu có dữ liệu
        echo json_encode([
            "status" => "success",
            "data" => $data
        ], JSON_PRETTY_PRINT);
    }

} catch (Exception $e) {
    // Trả về thông báo lỗi
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>