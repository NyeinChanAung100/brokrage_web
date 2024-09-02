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
// Start the session
// session_start();

// Clear the cookies by setting them with an expired time
setcookie("user_id", "", time() - 3600, "/");  
setcookie("username", "", time() - 3600, "/"); 
setcookie("email", "", time() - 3600, "/");    

// Destroy the session as a fallback
// session_unset();   
// session_destroy(); 

// Return a success message
header("Content-Type: application/json");
echo json_encode(["success" => "Logout successful"]);
?>
