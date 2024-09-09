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

    // Get market cap, supply, and price
    $sql = "SELECT m.market_cap, s.supply, p.price 
        FROM market_cap AS m
        JOIN total_supply AS s ON m.item_id = s.item_id
        JOIN prices AS p ON m.item_id = p.item_id
        WHERE m.item_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $item_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();

    $market_cap = floatval($data['market_cap']);
    $supply = floatval($data['supply']);
    $price = floatval($data['price']);

    // Use the market cap, supply, and price as needed
    // ...
    
    if($trade_type == "buy") {
        // Check if user has enough balance
        $sql = "SELECT balance FROM user_balance WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $user['balance'] = $user ? $user['balance'] : 0;
        // calaulate price 
        
        if($price == null || $price == 0) {
            // http_response_code(404);
            echo json_encode(["success" => false, "message" => "Item price not found."]);
            exit;
        }

        if($quantity == null || $quantity == 0) {
            // http_response_code(404);
            echo json_encode(["success" => false, "message" => "Invalid quantity."]);
            exit;
        }
        // echo json_encode(["success" => true,"quantity" => $quantity, "supply" => $supply, "price" => $price, "market_cap" => $market_cap]);
        // exit;
        if(intval($quantity) > intval($supply+1) || intval($quantity) < 0 || intval($supply) <= 0) {
            // http_response_code(400);
            echo json_encode(["success" => false, "message" => "Insufficient supply."]);
            exit;
        }
        $total_price = 0;
        for ($i=0; $i < $quantity ; $i++) { 
            $supply = $supply - 1;
            if ($supply > 0) {
                $market_cap = $market_cap + $price;
                $price = $market_cap / $supply;
            }
            $total_price += $price;
        }

        if($user['balance'] < $total_price) {
            // http_response_code(400);
            echo json_encode(["success" => false, "message" => "Insufficient balance."]);
            exit;
        }
        $sql = "INSERT INTO transactions (user_id, item_id, quantity, trade_type) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iiis", $user_id, $item_id, $quantity, $trade_type);
        $stmt->execute();
    } else if ($trade_type == 'sell') {
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
