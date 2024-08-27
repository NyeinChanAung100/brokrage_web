<?php
// Start the session
session_start();

// Destroy the session to log out the user
session_unset(); // Unset all session variables
session_destroy(); // Destroy the session

// Return a success message
header("Content-Type: application/json");
echo json_encode(["success" => "Logout successful"]);
?>
