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
        if (!isset($input['user_id']) || !isset($input['item_id']) || !isset($input['quantity'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
            exit();
        }
    
        // Sanitize and validate input data
        $user_id = intval($input['user_id']);
        $item_id = intval($input['item_id']);
        $quantity = intval($input['quantity']);
    
        if ($user_id <= 0 || $item_id <= 0 || $quantity < 1) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid user ID, item ID, or quantity"]);
            exit();
        }
    
        // Start a transaction
        $conn->begin_transaction();
    
        // Insert or update deposit record
        $sql = "INSERT INTO user_assets (user_id, item_id, quantity, acquired_date)
                VALUES (?, ?, ?, CURRENT_DATE)
                ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param('iii', $user_id, $item_id, $quantity);
        if (!$stmt->execute()) {
            throw new Exception("Insert/Update failed: " . $stmt->error);
        }

        // Commit the transaction
        $conn->commit();

        // Success
        echo json_encode(["success" => "Deposit successful"]);
    
    } catch (Exception $e) {
        // Rollback the transaction on error
        $conn->rollback();
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
