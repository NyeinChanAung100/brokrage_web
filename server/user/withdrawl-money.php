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
    
        // Check if user_id is present
        if (!isset($input['user_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing user ID"]);
            exit();
        }

        // Check if amount is present
        if (!isset($input['amount'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing amount"]);
            exit();
        }
    
        // Sanitize and validate user_id
        $user_id = intval($input['user_id']);
        if ($user_id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid user ID"]);
            exit();
        }

        // Sanitize and validate amount
        $amount = floatval($input['amount']);
        if ($amount <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid amount"]);
            exit();
        }
    
        // Start a transaction
        $conn->begin_transaction();
    
        // Check if user exists and fetch current balance
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
            echo json_encode(["error" => "User not found or balance not available"]);
            exit();
        }

        // Fetch current balance
        $row = $result->fetch_assoc();
        $current_balance = floatval($row['balance']);
        
        // Check if the user has enough balance for withdrawal
        if ($current_balance < $amount) {
            http_response_code(400);
            echo json_encode(["error" => "Insufficient balance for withdrawal"]);
            exit();
        }

        // Calculate new balance after withdrawal
        $new_balance = $current_balance - $amount;

        // Update the user's balance
        $sql = "UPDATE user_balance SET balance = ? WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param('di', $new_balance, $user_id);
        if (!$stmt->execute()) {
            throw new Exception("Update failed: " . $stmt->error);
        }

        // Commit the transaction
        $conn->commit();
    
        // Success: Return the updated balance
        echo json_encode(["success" => "Withdrawal successful", "new_balance" => $new_balance]);
    
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
