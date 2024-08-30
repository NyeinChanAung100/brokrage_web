<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");


// Include the database connection
include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['item_id'], $data['quantity'], $data['status'], $data['user_id'])) {
        echo json_encode(["success" => false, "message" => "Missing required parameters."]);
        exit;
    }

    $item_id = intval($data['item_id']);
    $quantity = intval($data['quantity']);
    $trade_type = $data['trade_type']a; // "buy" or "sell"
    $user_id = intval($data['user_id']);

    

    

    } else {
        echo json_encode(["success" => false, "message" => "Invalid transaction type."]);
    }

    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
