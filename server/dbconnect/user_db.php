<?php
// config.php

$servername = "localhost"; // Your server name
$username = "root";        // Your database username
$password = "";            // Your database password
$dbname = "user";        // Your database name

// Create a connection
$user_db = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($user_db->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $user_db->connect_error]));
}
?>
