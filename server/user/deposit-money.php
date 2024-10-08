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
            // If user does not exist, insert a new record with the deposit amount
            $sql = "INSERT INTO user_balance (user_id, balance) VALUES (?, ?)";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $conn->error);
            }
            $stmt->bind_param('id', $user_id, $amount);
            if (!$stmt->execute()) {
                throw new Exception("Insert failed: " . $stmt->error);
            }
        } else {
            // If user exists, update the balance
            $row = $result->fetch_assoc();
            $current_balance = $row['balance'];
            $new_balance = ($current_balance === null ? 0 : $current_balance) + $amount;

            $sql = "UPDATE user_balance SET balance = ? WHERE user_id = ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $conn->error);
            }
            $stmt->bind_param('di', $new_balance, $user_id);
            if (!$stmt->execute()) {
                throw new Exception("Update failed: " . $stmt->error);
            }
        }

        // Commit the transaction
        $conn->commit();
    
        // Fetch the updated balance
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
        
        // Check if balance data is retrieved successfully
        if ($balance === null) {
            throw new Exception("Failed to retrieve balance");
        }
    
        // Success: Return updated balance
        echo json_encode(["success" => "Deposit successful", "new_balance" => $balance['balance'], 'message' => 'deposited successfully']);
    
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
