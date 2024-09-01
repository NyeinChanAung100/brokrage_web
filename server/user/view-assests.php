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

// Define a function to fetch all items with isWatchlist, price, supply, and market cap fields
function fetch_all_items_with_details($conn, $user_id) {
    // Query to select all items with price, supply, and market cap
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

    // Fetch all rows and add the isWatchlist field
    $items = [];
    while ($row = $result->fetch_assoc()) {
        // Check if the item is in the user's watchlist
        $item_id = $row['id'];
        $watchlist_check_sql = "SELECT 1 FROM watchlist WHERE user_id = ? AND item_id = ?";
        $stmt = $conn->prepare($watchlist_check_sql);
        $stmt->bind_param("ii", $user_id, $item_id);
        $stmt->execute();
        $stmt->store_result();
        $row['isWatchlist'] = $stmt->num_rows > 0 ? true : false;
        $stmt->close();

        $items[] = $row;
    }

    return $items;
}

try {
    // Assume the user ID is provided in the request (e.g., from a session, token, or request parameter)
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;

    if (!$user_id) {
        throw new Exception("User ID is required.");
    }

    // Fetch all items from the database with the watchlist status, price, supply, and market cap
    $items = fetch_all_items_with_details($conn, $user_id);

    // Return the items in JSON format
    echo json_encode($items);

} catch (Exception $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}

// Close the connection
$conn->close();
?>
