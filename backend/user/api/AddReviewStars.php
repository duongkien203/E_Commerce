<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "status" => "error",
        "message" => "Phương thức không được hỗ trợ. Vui lòng sử dụng POST."
    ], JSON_PRETTY_PRINT);
    http_response_code(405);
    exit;
}

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['account_id']) || !isset($data['product_id']) || !isset($data['reviewStars']) || !isset($data['invoice_id'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Thiếu các tham số bắt buộc: account_id, product_id, reviewStars hoặc invoice_id"
        ], JSON_PRETTY_PRINT);
        http_response_code(400);
        exit;
    }

    $account_id = intval($data['account_id']);
    $product_id = intval($data['product_id']);
    $rating = intval($data['reviewStars']);
    $invoice_id = intval($data['invoice_id']);

    if ($rating < 1 || $rating > 5) {
        echo json_encode([
            "status" => "error",
            "message" => "Điểm đánh giá phải nằm trong khoảng từ 1 đến 5"
        ], JSON_PRETTY_PRINT);
        http_response_code(400);
        exit;
    }

    // Thêm đánh giá vào product_ratings
    $addResult = addProductRating($account_id, $product_id, $rating);

    if ($addResult['status'] === "success") {
        // Nếu thêm đánh giá thành công, xóa bản ghi trong pending_ratings
        $deleteResult = deletePendingRating($account_id, $product_id, $invoice_id);

        if ($deleteResult['status'] === "success") {
            echo json_encode([
                "status" => "success",
                "message" => "Đánh giá đã được thêm và bản ghi chờ đánh giá đã được xóa thành công"
            ], JSON_PRETTY_PRINT);
            http_response_code(200);
        } else {
            // Nếu xóa thất bại, vẫn báo thành công nhưng ghi log lỗi (tùy chọn)
            echo json_encode([
                "status" => "success",
                "message" => "Đánh giá đã được thêm nhưng không thể xóa bản ghi chờ đánh giá: " . $deleteResult['message']
            ], JSON_PRETTY_PRINT);
            http_response_code(200);
        }
    } else {
        echo json_encode($addResult, JSON_PRETTY_PRINT);
        http_response_code(500);
    }

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Lỗi hệ thống: " . $e->getMessage()
    ], JSON_PRETTY_PRINT);
    http_response_code(500);
}

?>