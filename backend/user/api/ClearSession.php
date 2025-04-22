<?php
session_start();
header('Content-Type: application/json');

// Xóa toàn bộ biến session
session_unset();

// Hủy session
session_destroy();

echo json_encode([
    'status' => 'success',
    'message' => 'Tất cả dữ liệu session đã bị xóa.'
]);