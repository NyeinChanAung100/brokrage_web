<?php
include './../dbconnect/config.php'; 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['name']) || !isset($input['price']) || !isset($input['supply'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit();
}

$name = $conn->real_escape_string($input['name']);
$price = $conn->real_escape_string($input['price']);
$supply = $conn->real_escape_string($input['supply']);
$unit = $conn->real_escape_string($input['unit']);
$symbol = $conn->real_escape_string($input['symbol']);

if($price <= 0 || $supply < 0) {
    http_response_code(400);
    echo json_encode(["error" => "Price and supply must be greater than 0"]);
    exit();
}

$sql = "INSERT INTO items (name, unit, symbol) VALUES ('$name', '$unit', '$symbol')";
if ($conn->query($sql) === TRUE) {
    $item_id = $conn->insert_id; 
    $sql = "INSERT INTO prices (item_id, price, initial_price) VALUES ($item_id, $price, $price)";
    if ($conn->query($sql) === TRUE) {

        $sql = "INSERT INTO total_supply (item_id, supply, initial_supply) VALUES ($item_id, $supply, $supply)";
        if ($conn->query($sql) === TRUE) {

            // Calculate and insert market_cap (optional)
            $market_cap = $price * $supply;
            $sql = "INSERT INTO market_cap (item_id, market_cap) VALUES ($item_id, $market_cap)";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["success" => "Data inserted successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Error inserting market cap: " . $conn->error]);
            }

        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error inserting total supply: " . $conn->error]);
        }

    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error inserting price: " . $conn->error]);
    }

} else {
    http_response_code(500);
    echo json_encode(["error" => "Error inserting item: " . $conn->error]);
}

} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT * FROM items";
    $result = $conn->query($sql);
    $items = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $item_id = $row['id'];
            $sql = "SELECT * FROM prices WHERE item_id = $item_id";
            $price_result = $conn->query($sql);
            $price = $price_result->fetch_assoc();

            $sql = "SELECT * FROM total_supply WHERE item_id = $item_id";
            $supply_result = $conn->query($sql);
            $supply = $supply_result->fetch_assoc();

            $sql = "SELECT * FROM market_cap WHERE item_id = $item_id";
            $market_cap_result = $conn->query($sql);
            $market_cap = $market_cap_result->fetch_assoc();

            $items[] = [
                "id" => $item_id,
                "name" => $row['name'],
                "price" => $price['price'],
                "supply" => $supply['supply'],
                "market_cap" => $market_cap['market_cap']
            ];
        }
    }
    echo json_encode($items);
} else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $item_id = $conn->real_escape_string($input['id']);
    $sql = "DELETE FROM items WHERE id = $item_id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => "Item deleted successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error deleting item: " . $conn->error]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}

// Close the connection
// $conn->close();
?>
