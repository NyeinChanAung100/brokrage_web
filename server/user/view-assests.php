<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle OPTIONS request (preflight)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// Include the database configuration
include './../dbconnect/config.php';

// Define a function to fetch all items with optional isWatchlist, price, supply, and market cap fields
function fetch_all_items_with_details($conn, $user_id) {
    $sql = "
        SELECT 
            items.id,
            items.name,
            items.description,
            prices.price,
            total_supply.supply,
            market_cap.market_cap
        FROM 
            items
        LEFT JOIN prices ON items.id = prices.item_id
        LEFT JOIN total_supply ON items.id = total_supply.item_id
        LEFT JOIN market_cap ON items.id = market_cap.item_id";

    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    $items = [];
    while ($row = $result->fetch_assoc()) {
        if ($user_id) {
            // Check if the item is in the user's watchlist
            $item_id = $row['id'];
            $watchlist_check_sql = "SELECT 1 FROM watchlist WHERE user_id = ? AND item_id = ?";
            $stmt = $conn->prepare($watchlist_check_sql);
            $stmt->bind_param("ii", $user_id, $item_id);
            $stmt->execute();
            $stmt->store_result();
            $row['isWatchlist'] = $stmt->num_rows > 0 ? true : false;
            $stmt->close();
        }
        
        $items[] = $row;
    }

    return $items;
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    try {
        // Get user ID and ensure it is valid
        $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;

        // Fetch all items from the database with the optional watchlist status
        $items = fetch_all_items_with_details($conn, $user_id);

        // Return the items in JSON format
        echo json_encode($items);

    } catch (Exception $e) {
        // Handle errors and return an error response
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    // Handle invalid request methods
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}

// Close the connection
$conn->close();
?>
