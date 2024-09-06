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
                SET total_price = total_price + (SELECT price FROM prices WHERE item_id = NEW.item_id);            END IF;
        END IF;

        SET i = i + 1;
    END WHILE;

    -- add or remove from user balance and user-assests

    IF NEW.trade_type = 'buy' THEN
    -- Update the user balance
    UPDATE user_balance 
    SET balance = balance - total_price 
    WHERE user_id = NEW.user_id;

    -- Insert or update user assets
        INSERT INTO user_assets (user_id, item_id, quantity)
        VALUES (NEW.user_id, NEW.item_id, NEW.quantity)
        ON DUPLICATE KEY UPDATE 
        quantity = quantity + NEW.quantity;

    ELSEIF NEW.trade_type = 'sell' THEN
        -- Update the user balance
        UPDATE user_balance 
        SET balance = balance + total_price 
        WHERE user_id = NEW.user_id;

        -- Insert or update user assets
        INSERT INTO user_assets (user_id, item_id, quantity)
        VALUES (NEW.user_id, NEW.item_id, -NEW.quantity)
        ON DUPLICATE KEY UPDATE 
        quantity = quantity - NEW.quantity;
    END IF;

    -- Set after price
    SET NEW.after_price = (SELECT price FROM prices WHERE item_id = NEW.item_id);
    SET NEW.total_price = total_price;

END //

DELIMITER ;

-- insert into transactions (user_id, item_id, quantity, trade_type) values (1,2,2,'buy');