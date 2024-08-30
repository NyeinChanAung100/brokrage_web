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
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    DECLARE new_market_cap DECIMAL(10, 2);
    DECLARE new_supply DECIMAL(10, 2);
    DECLARE total_price DECIMAL(10, 2);
    DECLARE i INT;

    -- Initialize the current market cap and total supply
    SELECT market_cap INTO new_market_cap
    FROM market_cap
    WHERE item_id = NEW.item_id;

    SELECT supply INTO new_supply
    FROM total_supply
    WHERE item_id = NEW.item_id;

    -- set before price
    SET NEW.before_price = (SELECT price FROM prices WHERE item_id = NEW.item_id);

    -- Loop to adjust price for each unit
    SET i = 1;
    WHILE i <= NEW.quantity DO
        -- Update market cap based on transaction
        IF NEW.trade_type = 'buy' THEN
            IF new_supply > 0 THEN
                update supply set supply = supply - 1 where item_id = NEW.item_id;
                update market_cap set market_cap = market_cap + NEW.after_price where item_id = NEW.item_id;
                SET new_supply = new_supply - 1;
                -- 
            ELSE
                -- supply is already 0, no need to update
                -- you can raise an exception or handle it in some other way
            END IF;
            -- it will be better to use the above way and auto update the price
        ELSEIF NEW.trade_type = 'sell' THEN
            IF new_market_cap - NEW.after_price >= 0 THEN
                update supply set supply = supply + 1 where item_id = NEW.item_id;
                update market_cap set market_cap = market_cap - NEW.after_price where item_id = NEW.item_id;
            ELSE
                -- handle case when market cap is less than 0
                -- you can raise an exception or handle it in some other way
            END IF;
        END IF;

        SET i = i + 1;
    END WHILE;

    -- set after price
    SET NEW.after_price = (SELECT price FROM prices WHERE item_id = NEW.item_id);

END //

DELIMITER ;