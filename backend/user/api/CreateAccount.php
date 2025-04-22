<?php
// Cho phép tất cả các miền (hoặc chỉ miền cụ thể như "http://localhost:3000")
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Kiểm tra nếu là phương thức OPTIONS (yêu cầu preflight từ CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);  // Dừng ngay để không thực hiện thêm hành động
}

require_once '../config.php';

// Kiểm tra xem có dữ liệu POST từ form không
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Kiểm tra sự tồn tại của các giá trị cần thiết trong POST
    if (isset($_POST['contactType'], $_POST['contact'], $_POST['username'])) {
        // Lấy dữ liệu từ form
        $contactType = $_POST['contactType'];
        $contact = $_POST['contact'];
        $username = $_POST['username'];

        // Gọi hàm createAccount() để tạo tài khoản
        $result = createAccount($contactType, $contact,  $username);

        // Trả về kết quả cho frontend dưới dạng JSON
        echo json_encode($result);
    } else {
        // Trả về thông báo lỗi nếu thiếu dữ liệu
        echo json_encode(['status' => 'error', 'message' => 'Dữ liệu không hợp lệ']);
    }
} else {
    // Nếu không phải là POST, trả về lỗi 405
    echo json_encode(['status' => 'error', 'message' => 'Phương thức không hợp lệ']);
}
?>