<?php
header("Content-Type: application/json");
// Thêm header CORS
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép nguồn gốc từ localhost:3000
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Các phương thức được phép
header("Access-Control-Allow-Headers: Content-Type"); // Các header được phép

require_once "../db.php";

$searchKey = isset($_GET['searchKey']) ? $_GET['searchKey'] : '';
$searchKey = "%" . $searchKey . "%"; // Thêm wildcard để tìm kiếm gần đúng

$response = ['status' => 'success', 'data' => []];

try {
    // Tìm kiếm trong bảng accounts (Người dùng)
    $conn = connectDB();
    $stmt = $conn->prepare("SELECT account_id, username, email, full_name FROM accounts WHERE username LIKE ? OR email LIKE ? OR full_name LIKE ?");
    $stmt->bind_param("sss", $searchKey, $searchKey, $searchKey);
    $stmt->execute();
    $response['data']['accounts'] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // Tìm kiếm trong bảng roles (Phân quyền)
    $stmt = $conn->prepare("SELECT role_id, role_name FROM roles WHERE role_name LIKE ?");
    $stmt->bind_param("s", $searchKey);
    $stmt->execute();
    $response['data']['roles'] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // Tìm kiếm trong bảng product_categories (Danh mục lớn)
    $stmt = $conn->prepare("SELECT category_id, category_name FROM product_categories WHERE category_name LIKE ?");
    $stmt->bind_param("s", $searchKey);
    $stmt->execute();
    $response['data']['categories'] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // Tìm kiếm trong bảng product_subcategories (Danh mục nhỏ)
    $stmt = $conn->prepare("SELECT subcategory_id, subcategory_name FROM product_subcategories WHERE subcategory_name LIKE ?");
    $stmt->bind_param("s", $searchKey);
    $stmt->execute();
    $response['data']['subcategories'] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // Tìm kiếm trong bảng products (Sản phẩm)
    $stmt = $conn->prepare("SELECT product_id, product_name FROM products WHERE product_name LIKE ? OR description LIKE ?");
    $stmt->bind_param("ss", $searchKey, $searchKey);
    $stmt->execute();
    $response['data']['products'] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // Tìm kiếm trong bảng product_details (Chi tiết sản phẩm)
    $stmt = $conn->prepare("
        SELECT pd.product_detail_id, p.product_name, pc.color_name, ps.size_name 
        FROM product_details pd
        LEFT JOIN products p ON pd.product_id = p.product_id
        LEFT JOIN product_colors pc ON pd.color_id = pc.color_id
        LEFT JOIN product_sizes ps ON pd.size_id = ps.size_id
        WHERE p.product_name LIKE ? OR pc.color_name LIKE ? OR ps.size_name LIKE ?");
    $stmt->bind_param("sss", $searchKey, $searchKey, $searchKey);
    $stmt->execute();
    $response['data']['productDetails'] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // Tìm kiếm trong bảng product_images (Ảnh sản phẩm)
    $stmt = $conn->prepare("SELECT image_id, image AS image_url FROM product_images WHERE image LIKE ?");
    $stmt->bind_param("s", $searchKey);
    $stmt->execute();
    $response['data']['productImages'] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // Tìm kiếm trong bảng invoices (Hóa đơn)
    $stmt = $conn->prepare("
        SELECT invoice_id, order_date, amount_sum, payment_status 
        FROM invoices 
        WHERE order_date LIKE ? OR amount_sum LIKE ? OR payment_status LIKE ?");
    $stmt->bind_param("sss", $searchKey, $searchKey, $searchKey);
    $stmt->execute();
    $response['data']['invoices'] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // Tìm kiếm trong bảng contacts (Liên hệ)
    $stmt = $conn->prepare("SELECT contact_id, full_name, email, subject, message, status FROM contacts WHERE full_name LIKE ? OR email LIKE ? OR message LIKE ?");
    $stmt->bind_param("sss", $searchKey, $searchKey, $searchKey);
    $stmt->execute();
    $response['data']['contacts'] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // Tìm kiếm trong bảng notifications (Thông báo)
    $stmt = $conn->prepare("SELECT notification_id, title, message FROM notifications WHERE title LIKE ? OR message LIKE ?");
    $stmt->bind_param("ss", $searchKey, $searchKey);
    $stmt->execute();
    $response['data']['notifications'] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // Tìm kiếm trong bảng discount_codes (Giảm giá)
    $stmt = $conn->prepare("SELECT discount_id, code, description FROM discount_codes WHERE code LIKE ? OR description LIKE ?");
    $stmt->bind_param("ss", $searchKey, $searchKey);
    $stmt->execute();
    $response['data']['discounts'] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    $conn->close();

} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

// echo json_encode($response);
echo json_encode($response, JSON_PRETTY_PRINT);
?>