<?php
include './../dbconnect/market_db.php'; 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['name']) || !isset($input['price']) || !isset($input['supply'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit();
}

$name = $market_db->real_escape_string($input['name']);
$price = $market_db->real_escape_string($input['price']);
$supply = $market_db->real_escape_string($input['supply']);

$sql = "INSERT INTO items (name, description) VALUES ('$name', 'Sample description')";
if ($market_db->query($sql) === TRUE) {
    $item_id = $market_db->insert_id; 
    $sql = "INSERT INTO prices (item_id, price, initial_price) VALUES ($item_id, $price, $price)";
    if ($market_db->query($sql) === TRUE) {

        $sql = "INSERT INTO total_supply (item_id, supply, initial_supply) VALUES ($item_id, $supply, $supply)";
        if ($market_db->query($sql) === TRUE) {

            // Calculate and insert market_cap (optional)
            $market_cap = $price * $supply;
            $sql = "INSERT INTO market_cap (item_id, market_cap) VALUES ($item_id, $market_cap)";
            if ($market_db->query($sql) === TRUE) {
                echo json_encode(["success" => "Data inserted successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Error inserting market cap: " . $market_db->error]);
            }

        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error inserting total supply: " . $market_db->error]);
        }

    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error inserting price: " . $market_db->error]);
    }

} else {
    http_response_code(500);
    echo json_encode(["error" => "Error inserting item: " . $market_db->error]);
}

} else {
    echo "router does'nt exist";
}

// Close the connection
// $market_db->close();
?>
