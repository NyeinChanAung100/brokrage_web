<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle OPTIONS request (preflight)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    // Just send the headers for preflight, no further processing needed
    http_response_code(200);
    exit();
}

// Include the database configuration
include './../dbconnect/config.php';

// Define a function to fetch user assets
function fetch_user_assets($conn, $user_id) {
    // Query to select user assets based on the user ID
    $sql = "SELECT ua.item_id, i.unit, i.symbol, i.name, ua.quantity, ua.acquired_date,prices.price
            FROM user_assets ua
            JOIN items i ON ua.item_id = i.id
            LEFT JOIN prices ON i.id = prices.item_id
            WHERE ua.user_id = ? AND ua.quantity > 0";
    
    // Prepare the statement
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }
    
    // Bind the user ID to the query
    $stmt->bind_param("i", $user_id);
    
    // Execute the query
    $stmt->execute();
    
    // Get the result
    $result = $stmt->get_result();
    
    if (!$result) {
        throw new Exception("Query failed: " . $stmt->error);
    }

    // Fetch all rows and encode them in JSON format
    $user_assets = [];
    while ($row = $result->fetch_assoc()) {
        $user_assets[] = $row;
    }
    
    // Close the statement
    $stmt->close();
    
    return $user_assets;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);

    // Check if required fields are present
    if (!isset($data['user_id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit();
    }
    $user_id = intval($data['user_id']);

    // Fetch user assets from the database
    $user_assets = fetch_user_assets($conn, $user_id);

    // Return the user assets in JSON format
    echo json_encode($user_assets);

} catch (Exception $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}

// Close the connection
$conn->close();
?>
