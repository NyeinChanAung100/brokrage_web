<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Include the database connection
include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate required parameters
    if (!isset($data['item_id'], $data['quantity'], $data['trade_type'], $data['user_id'])) {
        echo json_encode(["success" => false, "message" => "Missing required parameters."]);
        exit;
    }

    $item_id = intval($data['item_id']);
    $quantity = intval($data['quantity']);
    $trade_type = $data['trade_type']; // "buy" or "sell"
    $user_id = intval($data['user_id']);

    // Get the current price of the item
    $price_query = "SELECT price FROM prices WHERE item_id = ?";
    $stmt = $conn->prepare($price_query);
    $stmt->bind_param("i", $item_id);
    $stmt->execute();
    $stmt->bind_result($price);
    $stmt->fetch();
    $stmt->close();

    if (!$price) {
        echo json_encode(["success" => false, "message" => "Item not found or price unavailable."]);
        exit;
    }

    $total_cost = $price * $quantity;

    if ($trade_type === 'buy') {
        // Check if user has enough balance
        $balance_query = "SELECT balance FROM user_balance WHERE user_id = ?";
        $stmt = $conn->prepare($balance_query);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $stmt->bind_result($balance);
        $stmt->fetch();
        $stmt->close();

        if ($balance < $total_cost) {
            echo json_encode(["success" => false, "message" => "Insufficient balance."]);
            exit;
        }

        // Deduct the total cost from user's balance and update quantity
        $update_balance_query = "UPDATE user_balance SET balance = balance - ? WHERE user_id = ?";
        $stmt = $conn->prepare($update_balance_query);
        $stmt->bind_param("di", $total_cost, $user_id);
        $stmt->execute();
        $stmt->close();

        $update_quantity_query = "INSERT INTO user_assets (user_id, item_id, quantity, acquired_date)
                                  VALUES (?, ?, ?, CURDATE())
                                  ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)";
        $stmt = $conn->prepare($update_quantity_query);
        $stmt->bind_param("iii", $user_id, $item_id, $quantity);

    } elseif ($trade_type === 'sell') {
        // Check if user has enough quantity to sell
        $quantity_query = "SELECT quantity FROM user_assets WHERE user_id = ? AND item_id = ?";
        $stmt = $conn->prepare($quantity_query);
        $stmt->bind_param("ii", $user_id, $item_id);
        $stmt->execute();
        $stmt->bind_result($user_quantity);
        $stmt->fetch();
        $stmt->close();

        if ($user_quantity < $quantity) {
            echo json_encode(["success" => false, "message" => "Insufficient quantity to sell."]);
            exit;
        }

        // Update the quantity and add the total price to user's balance
        $update_quantity_query = "UPDATE user_assets SET quantity = GREATEST(quantity - ?, 0) 
                                  WHERE user_id = ? AND item_id = ?";
        $stmt = $conn->prepare($update_quantity_query);
        $stmt->bind_param("iii", $quantity, $user_id, $item_id);

        $update_balance_query = "UPDATE user_balance SET balance = balance + ? WHERE user_id = ?";
        $stmt2 = $conn->prepare($update_balance_query);
        $stmt2->bind_param("di", $total_cost, $user_id);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid trade type."]);
        exit;
    }

    // Execute the quantity update and balance update queries
    if ($stmt->execute() && ($trade_type === 'sell' ? $stmt2->execute() : true)) {
        echo json_encode(["success" => true, "message" => "Trade executed successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to execute trade."]);
    }

    $stmt->close();
    if (isset($stmt2)) {
        $stmt2->close();
    }
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
