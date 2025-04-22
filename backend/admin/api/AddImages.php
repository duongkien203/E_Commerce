<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($_POST["product_id"])) {
        echo json_encode(["status" => "error", "message" => "Thiếu thông tin sản phẩm."]);
        exit;
    }

    $productId = intval($_POST["product_id"]);
    $isDefault = isset($_POST["is_default"]) ? intval($_POST["is_default"]) : 0;
    $imagePath = null;

    // Kiểm tra nếu file ảnh được tải lên
    if (isset($_FILES["image_file"])) {
        $imageTmpName = $_FILES["image_file"]["tmp_name"];
        $imageName = $_FILES["image_file"]["name"];
        $uploadDir = "../../../frontend/public/uploads/product_images/"; // Thư mục lưu trữ ảnh
        $imageFilePath = $uploadDir . uniqid() . "_" . $imageName;

        // Di chuyển file ảnh vào thư mục uploads
        if (move_uploaded_file($imageTmpName, $imageFilePath)) {
            $imagePath = "/uploads/product_images/" . basename($imageFilePath); // Đường dẫn ảnh
        } else {
            echo json_encode(["status" => "error", "message" => "Lỗi khi tải ảnh lên."]);
            exit;
        }
    } elseif (isset($_POST["image_link"]) && !empty(trim($_POST["image_link"]))) {
        // Nếu nhận được link ảnh
        $imagePath = trim($_POST["image_link"]);
    }

    if (!$imagePath) {
        echo json_encode(["status" => "error", "message" => "Không có ảnh hoặc link ảnh hợp lệ."]);
        exit;
    }

    // Gọi hàm thêm ảnh
    $result = addImage($productId, $imagePath, $isDefault);

    echo json_encode($result);
} else {
    echo json_encode(["status" => "error", "message" => "Chỉ hỗ trợ phương thức POST"]);
}
?>