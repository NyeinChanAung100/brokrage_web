<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['item_id'], $data['quantity'], $data['status'], $data['user_id'])) {
        echo json_encode(["success" => false, "message" => "Missing required parameters."]);
        exit;
    }

    $item_id = intval($data['item_id']);
    $quantity = intval($data['quantity']);
    $status = $data['status']; // "buy" or "sell"
    $user_id = intval($data['user_id']);

    // Include the database connection
    include 'db_connect.php';

    // Fetch the item price and supply
    $item_sql = "SELECT p.price, ts.supply, mc.market_cap FROM prices p 
                 JOIN total_supply ts ON p.item_id = ts.item_id
                 JOIN market_cap mc ON p.item_id = mc.item_id
                 WHERE p.item_id = ?";
    $stmt = $conn->prepare($item_sql);
    $stmt->bind_param("i", $item_id);
    $stmt->execute();
    $stmt->bind_result($price, $supply, $market_cap);
    $stmt->fetch();
    $stmt->close();

    if (!$price) {
        echo json_encode(["success" => false, "message" => "Item not found."]);
        exit;
    }

    // Fetch the user's balance
    $balance_sql = "SELECT balance FROM user_balance WHERE user_id = ?";
    $stmt = $conn->prepare($balance_sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->bind_result($user_balance);
    $stmt->fetch();
    $stmt->close();

    if (!$user_balance) {
        echo json_encode(["success" => false, "message" => "User not found."]);
        exit;
    }

    if ($status === "buy") {
        $total_cost = $price * $quantity;

        if ($user_balance < $total_cost) {
            echo json_encode(["success" => false, "message" => "Insufficient balance."]);
            exit;
        }

        // Deduct balance and add assets
        $new_balance = $user_balance - $total_cost;
        $update_balance_sql = "UPDATE user_balance SET balance = ? WHERE user_id = ?";
        $stmt = $conn->prepare($update_balance_sql);
        $stmt->bind_param("di", $new_balance, $user_id);
        $stmt->execute();
        $stmt->close();

        // Update user's assets
        $asset_sql = "INSERT INTO user_assets (user_id, item_id, quantity, acquired_date) 
                      VALUES (?, ?, ?, NOW()) 
                      ON DUPLICATE KEY UPDATE quantity = quantity + ?";
        $stmt = $conn->prepare($asset_sql);
        $stmt->bind_param("iiii", $user_id, $item_id, $quantity, $quantity);
        $stmt->execute();
        $stmt->close();

        // Update item supply and market cap
        $new_supply = $supply - $quantity;
        $new_market_cap = $market_cap + $total_cost;
        $update_item_sql = "UPDATE total_supply SET supply = ? WHERE item_id = ?";
        $stmt = $conn->prepare($update_item_sql);
        $stmt->bind_param("ii", $new_supply, $item_id);
        $stmt->execute();
        $stmt->close();

        $update_market_cap_sql = "UPDATE market_cap SET market_cap = ? WHERE item_id = ?";
        $stmt = $conn->prepare($update_market_cap_sql);
        $stmt->bind_param("di", $new_market_cap, $item_id);
        $stmt->execute();
        $stmt->close();

        echo json_encode(["success" => true, "message" => "Item purchased successfully."]);
    } elseif ($status === "sell") {
        // Check user's assets
        $asset_sql = "SELECT quantity FROM user_assets WHERE user_id = ? AND item_id = ?";
        $stmt = $conn->prepare($asset_sql);
        $stmt->bind_param("ii", $user_id, $item_id);
        $stmt->execute();
        $stmt->bind_result($user_quantity);
        $stmt->fetch();
        $stmt->close();

        if ($user_quantity < $quantity) {
            echo json_encode(["success" => false, "message" => "Insufficient quantity to sell."]);
            exit;
        }

        $total_proceeds = $price * $quantity;

        // Update balance and deduct assets
        $new_balance = $user_balance + $total_proceeds;
        $update_balance_sql = "UPDATE user_balance SET balance = ? WHERE user_id = ?";
        $stmt = $conn->prepare($update_balance_sql);
        $stmt->bind_param("di", $new_balance, $user_id);
        $stmt->execute();
        $stmt->close();

        // Update user's assets
        $new_quantity = $user_quantity - $quantity;
        if ($new_quantity > 0) {
            $update_asset_sql = "UPDATE user_assets SET quantity = ? WHERE user_id = ? AND item_id = ?";
            $stmt = $conn->prepare($update_asset_sql);
            $stmt->bind_param("iii", $new_quantity, $user_id, $item_id);
            $stmt->execute();
        } else {
            $delete_asset_sql = "DELETE FROM user_assets WHERE user_id = ? AND item_id = ?";
            $stmt = $conn->prepare($delete_asset_sql);
            $stmt->bind_param("ii", $user_id, $item_id);
            $stmt->execute();
        }
        $stmt->close();

        // Update item supply and market cap
        $new_supply = $supply + $quantity;
        $new_market_cap = $market_cap - $total_proceeds;
        $update_item_sql = "UPDATE total_supply SET supply = ? WHERE item_id = ?";
        $stmt = $conn->prepare($update_item_sql);
        $stmt->bind_param("ii", $new_supply, $item_id);
        $stmt->execute();
        $stmt->close();

        $update_market_cap_sql = "UPDATE market_cap SET market_cap = ? WHERE item_id = ?";
        $stmt = $conn->prepare($update_market_cap_sql);
        $stmt->bind_param("di", $new_market_cap, $item_id);
        $stmt->execute();
        $stmt->close();

        echo json_encode(["success" => true, "message" => "Item sold successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid transaction type."]);
    }

    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
