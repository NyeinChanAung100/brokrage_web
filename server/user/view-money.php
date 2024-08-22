<?php
header("Content-Type: application/json");

// Include the database configuration
include './../dbconnect/config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Read the input JSON data
        $input = json_decode(file_get_contents('php://input'), true);
    
        // Check if required fields are present
        if (!isset($input['user_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
            exit();
        }
    
        // Sanitize input data
        $user_id = intval($input['user_id']);
    
        // Validate user_id (basic validation to check if it's a positive integer)
        if ($user_id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid user ID"]);
            exit();
        }
    
        // Query to fetch user balance
        $sql = "SELECT balance FROM user_balance WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(["error" => "Balance information not found"]);
            exit();
        }
    
        // Fetch balance data
        $balance = $result->fetch_assoc();
    
        // Success: Return balance
        echo json_encode(["success" => "Balance retrieved successfully", "balance" => $balance['balance']]);
    
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
