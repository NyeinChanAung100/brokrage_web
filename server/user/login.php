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
session_start();
// Include the database configuration
include './../dbconnect/config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Read the input JSON data
        $input = json_decode(file_get_contents('php://input'), true);
    
        // Check if required fields are present
        if (!isset($input['username']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
            exit();
        }
    
        // Sanitize input data
        $username = $conn->real_escape_string($input['username']);
        $password = $input['password'];
    
        // Query to fetch user data
        $sql = "SELECT id, email, password_hash FROM users WHERE username = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($result->num_rows === 0) {
            http_response_code(401);
            echo json_encode(["error" => "Invalid username or password"]);
            exit();
        }
    
        // Fetch user data
        $user = $result->fetch_assoc();
        $password_hash = $user['password_hash'];
        $email = $user['email'];
    
        // Verify password
        if (password_verify($password, $password_hash)) {
            // Success: Password is correct
            $_SESSION['user_id'] = $user['id']; // Save user ID in session
            echo json_encode(["success" => "Login successful",
                "user_id" => $user['id'],
                "username" => $username,
                "email" => $email
            ]);
        } else {
            // Failure: Password is incorrect
            http_response_code(401);
            echo json_encode(["error" => "Invalid username or password"]);
        }
    
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo "nothing here";
}


// Close the connection
$conn->close();
?>
