<?php
header("Content-Type: application/json");

// Include the database configuration
include './../dbconnect/config.php';

// Define a function to fetch all items
function fetch_all_items($conn) {
    // Query to select all items
    $sql = "SELECT * FROM items"; // Assuming you have a table named 'items'
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    // Fetch all rows and encode them in JSON format
    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    
    return $items;
}

try {
    // Fetch all items from the database
    $items = fetch_all_items($conn);

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
