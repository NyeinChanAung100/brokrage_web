CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    initial_price DECIMAL(10, 2) DEFAULT NULL,
    FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE price_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id)
);


CREATE TABLE total_supply (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    supply INT NOT NULL,
    initial_supply INT DEFAULT NULL,
    FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE market_cap (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    market_cap DECIMAL(20, 2) NOT NULL,
    FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN DEFAULT FALSE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_assets (
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    acquired_date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE user_balance (
    user_id INT NOT NULL,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    before_price DECIMAL(10, 2) NOT NULL,
    after_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    trade_type ENUM('buy', 'sell') NOT NULL,
    trade_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE watchlist (
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    PRIMARY KEY (user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);
