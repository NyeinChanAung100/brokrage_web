-- Create the database
CREATE DATABASE InventoryDB;
USE InventoryDB;

-- Create the items table
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Create the prices table with initial_price column
CREATE TABLE prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    initial_price DECIMAL(10, 2) DEFAULT NULL,
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- Create the total_supply table with initial_supply column
CREATE TABLE total_supply (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    supply INT NOT NULL,
    initial_supply INT DEFAULT NULL,
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- Create the market_cap table
CREATE TABLE market_cap (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    market_cap DECIMAL(20, 2) NOT NULL,
    FOREIGN KEY (item_id) REFERENCES items(id)
);