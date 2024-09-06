<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Include the database connection
include './../dbconnect/config.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate required parameters
    if (!isset($data['item_id']) || !isset($data['quantity']) || !isset($data['trade_type']) || !isset($data['user_id'])) {
        echo json_encode(["success" => false, "message" => "Missing required parameters."]);
        exit;
    }

    $item_id = intval($data['item_id']);
    $quantity = intval($data['quantity']);
    $trade_type = $data['trade_type']; // "buy" or "sell"
    $user_id = intval($data['user_id']);

    if (!in_array($trade_type, ['buy', 'sell'])) {
        echo json_encode(["success" => false, "message" => "Invalid trade type."]);
        exit;
    }

    // Check if the item exists
    $sql = "SELECT * FROM items WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $item_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Item not found."]);
        exit;
    }

    // Check if the user exists
    $sql = "SELECT * FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "User not found."]);
        exit;
    }

    // Insert transaction
    // $log_query = "INSERT INTO transactions (user_id, item_id, quantity, trade_type) VALUES (?, ?, ?, ?)";
    // $stmt = $conn->prepare($log_query);
    // $stmt->bind_param("iiis", $user_id, $item_id, $quantity, $trade_type);
    // $stmt->execute();
    if($trade_type == "buy") {
        // Check if user has enough balance
        $sql = "SELECT balance FROM user_balance WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        // check the item price
        $sql = "SELECT price FROM prices WHERE item_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $item_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $price = $result->fetch_assoc();
        $user['balance'] = $user ? $user['balance'] : 0;

        if($price['price'] == null) {
            // http_response_code(404);
            echo json_encode(["success" => false, "message" => "Item price not found."]);
            exit;
        }

        if($user['balance'] < $price['price'] * $quantity) {
            // http_response_code(400);
            echo json_encode(["success" => false, "message" => "Insufficient balance."]);
            exit;
        }
        $sql = "INSERT INTO transactions (user_id, item_id, quantity, trade_type) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iiis", $user_id, $item_id, $quantity, $trade_type);
        $stmt->execute();
    } else {
        // Check if user has enough quantity
        $sql = "SELECT quantity FROM user_assets WHERE user_id = ? AND item_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $user_id, $item_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user_item = $result->fetch_assoc();
        if($user_item['quantity'] < $quantity) {
            echo json_encode(["success" => false, "message" => "Insufficient quantity."]);
            exit;
        }
        $sql = "INSERT INTO transactions (user_id, item_id, quantity, trade_type) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iiis", $user_id, $item_id, $quantity, $trade_type);
        $stmt->execute();
    }

    if ($stmt->affected_rows === 0) {
        // http_response_code(404);
        echo json_encode(["success" => false, "message" => "Failed to log transaction."]);
        exit;
    }

    echo json_encode(["success" => true, "message" => "Transaction logged successfully."]);

    // Close the statement and connection
    $stmt->close();
    $conn->close();

} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
