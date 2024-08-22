<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "market";

// Create connection
$market_db = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($market_db->connect_error) {
    die("Connection failed: " . $market_db->connect_error);
}

// Create database if it doesn't exist
// $sql = "CREATE DATABASE IF NOT EXISTS $dbname";
// if ($market_db->query($sql) === TRUE) {
//     echo "Database created successfully or already exists.";
// } else {
//     die("Error creating database: " . $market_db->error);
// }

// Select the database
// $market_db->select_db($dbname);

// Create table if it doesn't exist
// $table = "your_table_name";
// $sql = "CREATE TABLE IF NOT EXISTS $table (
//     id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     firstname VARCHAR(30) NOT NULL,
//     lastname VARCHAR(30) NOT NULL,
//     email VARCHAR(50),
//     reg_date TIMESTAMP
// )";

// if ($market_db->query($sql) === TRUE) {
//     echo "Table created successfully or already exists.";
// } else {
//     die("Error creating table: " . $market_db->error);
// }

// $market_db->close();
?>
