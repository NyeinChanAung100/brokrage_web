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
    supply DECIMAL(10,2) NOT NULL,
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
    total_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    trade_type ENUM('buy', 'sell') NOT NULL,
    trade_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- CREATE TABLE order (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     item_id INT NOT NULL,
--     price DECIMAL(10, 2) NOT NULL,
--     status ENUM('pending', 'filled', 'cancelled') NOT NULL,
--     quantity INT NOT NULL,
--     filled_quantity INT DEFAULT 0,
--     order_type ENUM('buy', 'sell') NOT NULL,
--     order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id),
--     FOREIGN KEY (item_id) REFERENCES items(id)
-- );

CREATE TABLE watchlist (
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    PRIMARY KEY (user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);


-- triggers

DELIMITER $$

CREATE TRIGGER after_market_cap_update
AFTER UPDATE ON market_cap
FOR EACH ROW
BEGIN
    DECLARE new_price DECIMAL(10, 2);
    DECLARE current_supply INT;

    -- Get the current total supply for the item
    SELECT supply INTO current_supply
    FROM total_supply
    WHERE item_id = NEW.item_id;

    -- Calculate the new price
    SET new_price = NEW.market_cap / current_supply;

    -- insert if doesnt exist or Update the price in the prices table
    IF (SELECT COUNT(*) FROM prices WHERE item_id = NEW.item_id) = 0 THEN
        INSERT INTO prices (item_id, price) VALUES (NEW.item_id, new_price);
    ELSE
        UPDATE prices SET price = new_price WHERE item_id = NEW.item_id;
    END IF;
    

END $$

DELIMITER ;

-- ////////////////////////////////

DELIMITER $$
CREATE TRIGGER after_total_supply_update
AFTER UPDATE ON total_supply
FOR EACH ROW
BEGIN
    DECLARE new_price DECIMAL(10, 2);
    DECLARE current_market_cap DECIMAL(10, 2);

    -- Get the current market cap for the item
    SELECT market_cap INTO current_market_cap
    FROM market_cap
    WHERE item_id = NEW.item_id;

    -- Calculate the new price
    SET new_price = current_market_cap / NEW.supply;

    -- insert if doesnt exist or Update the price in the prices table
    IF (SELECT COUNT(*) FROM prices WHERE item_id = NEW.item_id) = 0 THEN
        INSERT INTO prices (item_id, price) VALUES (NEW.item_id, new_price);
    ELSE
        UPDATE prices SET price = new_price WHERE item_id = NEW.item_id;
    END IF;
    

END $$

DELIMITER ;

-- ////////////////////////////////

DELIMITER //

CREATE TRIGGER update_market_and_price
BEFORE INSERT ON transactions
FOR EACH ROW
BEGIN
    DECLARE new_market_cap DECIMAL(10, 2);
    DECLARE new_supply DECIMAL(10, 2);
    DECLARE total_price DECIMAL(10, 2) DEFAULT 0;
    DECLARE i INT;

    -- Initialize the current market cap and total supply
    SELECT market_cap INTO new_market_cap
    FROM market_cap
    WHERE item_id = NEW.item_id;

    SELECT supply INTO new_supply
    FROM total_supply
    WHERE item_id = NEW.item_id;

    -- Set before price
    SET NEW.before_price = (SELECT price FROM prices WHERE item_id = NEW.item_id);

    -- Loop to adjust price for each unit
    SET i = 1;
    WHILE i <= NEW.quantity DO
        -- Update market cap and supply based on transaction type
        IF NEW.trade_type = 'buy' THEN
            IF new_supply > 0 THEN
                UPDATE total_supply SET supply = supply - 1 WHERE item_id = NEW.item_id;
                UPDATE market_cap SET market_cap = market_cap + NEW.after_price WHERE item_id = NEW.item_id;
                SET new_supply = new_supply - 1;
                SET total_price = total_price + (SELECT price FROM prices WHERE item_id = NEW.item_id);
            END IF;
        ELSEIF NEW.trade_type = 'sell' THEN
            IF new_market_cap - NEW.after_price >= 0 THEN
                UPDATE total_supply SET supply = supply + 1 WHERE item_id = NEW.item_id;
                UPDATE market_cap SET market_cap = market_cap - NEW.after_price WHERE item_id = NEW.item_id;
                SET total_price = total_price + (SELECT price FROM prices WHERE item_id = NEW.item_id);
            END IF;
        END IF;

        SET i = i + 1;
    END WHILE;

    -- add or remove from user balance and user-assests

    IF NEW.trade_type = 'buy' THEN
        UPDATE user_balance SET balance = balance - total_price WHERE user_id = NEW.user_id;
        UPDATE user_assets SET quantity = quantity + NEW.quantity WHERE user_id = NEW.user_id AND item_id = NEW.item_id;
    ELSEIF NEW.trade_type = 'sell' THEN
        UPDATE user_balance SET balance = balance + total_price WHERE user_id = NEW.user_id;
        UPDATE user_assets SET quantity = quantity - NEW.quantity WHERE user_id = NEW.user_id AND item_id = NEW.item_id;
    END IF;

    -- Set after price
    SET NEW.after_price = (SELECT price FROM prices WHERE item_id = NEW.item_id);
    SET NEW.total_price = total_price;

END //

DELIMITER ;
