<?php
header("Content-Type: application/json");

// Include the database configuration
include './../dbconnect/config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Read the input JSON data
        $input = json_decode(file_get_contents('php://input'), true);
    
        // Check if required fields are present
        if (!isset($input['user_id']) || !isset($input['amount'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
            exit();
        }
    
        // Sanitize and validate input data
        $user_id = intval($input['user_id']);
        $amount = floatval($input['amount']);
    
        if ($user_id <= 0 || $amount <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid user ID or amount"]);
            exit();
        }
    
        // Start a transaction
        $conn->begin_transaction();
    
        // Check if the user exists in the user_balance table
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
            echo json_encode(["error" => "User not found"]);
            $conn->rollback();
            exit();
        }
    
        // Update the user's balance
        $sql = "UPDATE user_balance SET balance = balance + ? WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param('di', $amount, $user_id);
        if (!$stmt->execute()) {
            throw new Exception("Update failed: " . $stmt->error);
        }
    
        // Commit the transaction
        $conn->commit();
    
        // Success: Return updated balance
        $sql = "SELECT balance FROM user_balance WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $balance = $result->fetch_assoc();
    
        echo json_encode(["success" => "Deposit successful", "new_balance" => $balance['balance']]);
    
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
