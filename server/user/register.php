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

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        // Read the input JSON data
        $input = json_decode(file_get_contents('php://input'), true);
    
        // Check if required fields are present
        if (!isset($input['username']) || !isset($input['password']) || !isset($input['email'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
            exit();
        }
    
        // Sanitize input data
        $username = $conn->real_escape_string($input['username']);
        $password = $input['password']; // Password will be hashed
        $email = $conn->real_escape_string($input['email']);
    
        // Check if the username or email already exists
        $sql = "SELECT id FROM users WHERE username = ? OR email = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param('ss', $username, $email);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            http_response_code(400);
            echo json_encode(["error" => "Username or email already exists"]);
            exit();
        }
    
        // Hash the password
        $password_hash = password_hash($password, PASSWORD_BCRYPT);
    
        // Insert user into the database
        $sql = "INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param('sss', $username, $password_hash, $email);
        if ($stmt->execute()) {
            echo json_encode(["success" => "User registered successfully",
                "id" => $stmt->insert_id,
                "username" => $username,
                "email" => $email
        ]);
        } else {
            throw new Exception("Error inserting user: " . $stmt->error);
        }
    
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e]);
    }
} else {
    echo "route doesnt allow";
}

// Close the connection
// $conn->close();
?>
