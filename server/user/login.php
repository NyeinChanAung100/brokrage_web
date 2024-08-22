<?php
header("Content-Type: application/json");

// Include the database configuration
include './../dbconnect/user_db.php';

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
    $username = $user_db->real_escape_string($input['username']);
    $password = $input['password'];

    // Query to fetch user data
    $sql = "SELECT id, password_hash FROM users WHERE username = ?";
    $stmt = $user_db->prepare($sql);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $user_db->error);
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

    // Verify password
    if (password_verify($password, $password_hash)) {
        // Success: Password is correct
        echo json_encode(["success" => "Login successful"]);
    } else {
        // Failure: Password is incorrect
        http_response_code(401);
        echo json_encode(["error" => "Invalid username or password"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}

// Close the connection
$user_db->close();
?>
