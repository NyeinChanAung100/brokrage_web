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

        // Check if the item exists in the user's assets
        $sql = "SELECT quantity FROM user_assets WHERE user_id = ? AND item_id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param('ii', $user_id, $item_id);
        if (!$stmt->execute()) {
            throw new Exception("Execute failed: " . $stmt->error);
        }

        $result = $stmt->get_result();
        if ($result->num_rows == 0) {
            echo json_encode(["error" => "No asset found to withdraw for this item."]);
            return;
        }

        $user_asset = $result->fetch_assoc();
        $current_quantity = intval($user_asset['quantity']);

        // Check if the user has enough quantity to withdraw
        if ($current_quantity < $quantity) {
            echo json_encode(["error" => "Insufficient quantity to withdraw"]);
            return;
        }

        // Update the user's asset quantity
        $new_quantity = $current_quantity - $quantity;

        // If the new quantity is zero, delete the record; otherwise, update it
        if ($new_quantity == 0) {
            $sql = "DELETE FROM user_assets WHERE user_id = ? AND item_id = ?";
        } else {
            $sql = "UPDATE user_assets SET quantity = ? WHERE user_id = ? AND item_id = ?";
        }

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        if ($new_quantity == 0) {
            $stmt->bind_param('ii', $user_id, $item_id);
        } else {
            $stmt->bind_param('iii', $new_quantity, $user_id, $item_id);
        }

        if (!$stmt->execute()) {
            throw new Exception("Update/Delete failed: " . $stmt->error);
        }

        // Commit the transaction
        $conn->commit();

        // Success
        echo json_encode(["success" => "Withdrawal successful"]);

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
