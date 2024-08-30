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

    -- Update the price in the prices table
    INSERT INTO prices (item_id, price)
    VALUES (NEW.item_id, new_price);

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

    -- Update the price in the prices table
    INSERT INTO prices (item_id, price)
    VALUES (NEW.item_id, new_price);

END $$

DELIMITER ;

-- ////////////////////////////////
DELIMITER //

CREATE TRIGGER update_market_and_price
BEFORE INSERT ON transactions
FOR EACH ROW
BEGIN
    DECLARE new_market_cap DECIMAL(20, 2);
    DECLARE new_supply INT;
    DECLARE total_price DECIMAL(20, 2) DEFAULT 0.00;
    DECLARE i INT DEFAULT 1;

    -- Initialize the current market cap and total supply
    SELECT market_cap INTO new_market_cap
    FROM market_cap
    WHERE item_id = NEW.item_id;

    SELECT supply INTO new_supply
    FROM total_supply
    WHERE item_id = NEW.item_id;

    -- Ensure that variables are initialized properly
    IF new_market_cap IS NULL OR new_supply IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Item not found or invalid market_cap/supply';
    END IF;

    -- Set before price
    SET NEW.before_price = (SELECT price FROM prices WHERE item_id = NEW.item_id);

    -- Loop to adjust price for each unit
    WHILE i <= NEW.quantity DO
        IF NEW.trade_type = 'buy' THEN
            IF new_supply > 0 THEN
                -- Decrease supply and increase market cap
                UPDATE total_supply SET supply = supply - 1 WHERE item_id = NEW.item_id;
                UPDATE market_cap SET market_cap = market_cap + NEW.before_price WHERE item_id = NEW.item_id;
                SET new_supply = new_supply - 1;
                SET total_price = total_price + NEW.before_price;
            ELSE
                -- Handle case where supply is 0
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot buy: Supply is zero';
            END IF;
        ELSEIF NEW.trade_type = 'sell' THEN
            IF new_market_cap >= NEW.before_price THEN
                -- Increase supply and decrease market cap
                UPDATE total_supply SET supply = supply + 1 WHERE item_id = NEW.item_id;
                UPDATE market_cap SET market_cap = market_cap - NEW.before_price WHERE item_id = NEW.item_id;
                SET total_price = total_price + NEW.before_price;
            ELSE
                -- Handle case where market cap is too low
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot sell: Insufficient market cap';
            END IF;
        END IF;

        SET i = i + 1;
    END WHILE;

    -- Set after price (you might need to update the price based on your business logic here)
    SET NEW.after_price = (SELECT price FROM prices WHERE item_id = NEW.item_id);
    SET NEW.total_price = total_price;

END //

DELIMITER ;
