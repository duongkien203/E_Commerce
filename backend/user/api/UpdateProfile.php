<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config.php';

// Kiểm tra nếu request là POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Kiểm tra dữ liệu từ $_POST
    if (!isset($_POST["id"])) {
        echo json_encode(["status" => "error", "message" => "Thiếu dữ liệu"]);
        exit;
    }

    $account_id = trim($_POST["id"]);
    $fullName = trim($_POST["fullName"]);
    $address = trim($_POST["address"]);

    // Kiểm tra xem có file avatar được gửi lên không
    if (isset($_FILES["avatar"])) {
        // Lấy thông tin file ảnh
        $avatarTmpName = $_FILES["avatar"]["tmp_name"];
        $avatarName = $_FILES["avatar"]["name"];
        $uploadDir = "../../../frontend/public/uploads/avatars/"; // Đường dẫn thư mục lưu ảnh
        $avatarFilePath = $uploadDir . uniqid() . "_" . $avatarName; // Tạo tên file mới để tránh trùng lặp

        // Di chuyển file ảnh vào thư mục uploads/avatars
        if (!move_uploaded_file($avatarTmpName, $avatarFilePath)) {
            echo json_encode(["status" => "error", "message" => "Lỗi khi tải ảnh lên"]);
            exit;
        }
        $avatarPath = "/uploads/avatars/" . basename($avatarFilePath); // Lưu đường dẫn ảnh
    } else {
        $avatarPath = null; // Nếu không có avatar mới, giữ nguyên avatar cũ
    }

    // Gọi hàm cập nhật thông tin người dùng
    $result = updateProfile($account_id, $avatarPath, $fullName, $address);

    // Trả về JSON response
    echo json_encode($result);
} else {
    echo json_encode(["status" => "error", "message" => "Chỉ hỗ trợ phương thức POST"]);
}
?>