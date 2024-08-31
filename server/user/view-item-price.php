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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Read the input JSON data
        $input = json_decode(file_get_contents('php://input'), true);
    
        // Check if required fields are present
        if (!isset($input['item_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
            exit();
        }
    
        // Sanitize input data
        $user_id = intval($input['item_id']);
    
        // Validate user_id (basic validation to check if it's a positive integer)
        if ($user_id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid user ID"]);
            exit();
        }
    
        // Query to fetch user balance
        $sql = "SELECT price FROM prices WHERE item_id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($result->num_rows === 0) {
            echo json_encode(["error" => "Item is not listed"]);
            exit();
        } else {
            $price = $result->fetch_assoc()['price'];
        }

        echo json_encode(["success" => "price is retrieved successfully", "balance" => $price]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}

// Close the connection
$conn->close();
?>
