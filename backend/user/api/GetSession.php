<!-- 
session_start();
header('Content-Type: application/json');
require_once '../SendNotification.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['contact']) || !isset($data['type'])) {
    echo json_encode(['status' => 'error', 'message' => 'Thiếu thông tin contact hoặc type']);
    exit;
}

$contact = $data['contact'];
$type = $data['type'];

$result = sendVerificationCode($contact, $type);

// Trả về session để kiểm tra
echo json_encode($result); -->