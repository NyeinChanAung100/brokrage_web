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

$sql = "INSERT INTO items (name, description) VALUES ('$name', 'Sample description')";
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

} else {
    echo "router does'nt exist";
}

// Close the connection
// $conn->close();
?>
