<?php
header('Content-type: application/json'); // Định dạng JSON cho phản hồi
header('Access-Control-Allow-Origin: *'); // Cho phép tất cả nguồn truy cập
header('Access-Control-Allow-Methods: GET'); // Chỉ cho phép phương thức GET

require_once '../config.php'; // Include file cấu hình cơ sở dữ liệu

try {
    // Gọi hàm getInvoices để lấy dữ liệu
    $data = getInvoices();

    // Trả về kết quả
    echo json_encode([
        "status" => "success",
        "data" => $data
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    // Trả về thông báo lỗi
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>