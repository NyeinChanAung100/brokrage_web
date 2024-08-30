-- DELIMITER //

-- CREATE TRIGGER after_buy_transaction
-- AFTER INSERT ON transactions -- assuming a 'transactions' table
-- FOR EACH ROW
-- BEGIN
--     DECLARE new_market_cap DECIMAL(20, 2);
--     DECLARE new_price DECIMAL(10, 2);
--     DECLARE remaining_supply INT;

--     -- Increase market cap by the value of the transaction
--     SET new_market_cap = (SELECT market_cap FROM market_cap WHERE item_id = NEW.item_id) + (NEW.quantity * NEW.price);

--     -- Decrease total supply by the quantity bought
--     SET remaining_supply = (SELECT supply FROM total_supply WHERE item_id = NEW.item_id) - NEW.quantity;

--     -- Update the market cap
--     UPDATE market_cap
--     SET market_cap = new_market_cap
--     WHERE item_id = NEW.item_id;

--     -- Update the total supply
--     UPDATE total_supply
--     SET supply = remaining_supply
--     WHERE item_id = NEW.item_id;

--     -- Recalculate and update the price
--     SET new_price = new_market_cap / remaining_supply;
--     UPDATE prices
--     SET price = new_price
--     WHERE item_id = NEW.item_id;
-- END//

-- DELIMITER ;

-- -- ////////////////////////////////

-- DELIMITER //

-- CREATE TRIGGER after_sell_transaction
-- AFTER INSERT ON transactions -- assuming a 'transactions' table
-- FOR EACH ROW
-- BEGIN
--     DECLARE new_market_cap DECIMAL(20, 2);
--     DECLARE new_price DECIMAL(10, 2);
--     DECLARE remaining_supply INT;

--     -- Decrease market cap by the value of the transaction
--     SET new_market_cap = (SELECT market_cap FROM market_cap WHERE item_id = NEW.item_id) - (NEW.quantity * NEW.price);

--     -- Increase total supply by the quantity sold
--     SET remaining_supply = (SELECT supply FROM total_supply WHERE item_id = NEW.item_id) + NEW.quantity;

--     -- Update the market cap
--     UPDATE market_cap
--     SET market_cap = new_market_cap
--     WHERE item_id = NEW.item_id;

--     -- Update the total supply
--     UPDATE total_supply
--     SET supply = remaining_supply
--     WHERE item_id = NEW.item_id;

--     -- Recalculate and update the price
--     SET new_price = new_market_cap / remaining_supply;
--     UPDATE prices
--     SET price = new_price
--     WHERE item_id = NEW.item_id;
-- END//

-- DELIMITER ;


-- ////////////////////////////////

DELIMITER $$

CREATE TRIGGER before_transaction_insert
BEFORE INSERT ON transactions
FOR EACH ROW
BEGIN
    DECLARE current_price DECIMAL(10, 2);

    -- Get the current price of the item
    SELECT price INTO current_price
    FROM prices
    WHERE item_id = NEW.item_id;

    -- Set the before_price to the current price
    SET NEW.before_price = current_price;

    -- Calculate the new price after the transaction based on trade type
    IF NEW.trade_type = 'buy' THEN
        -- Increase market cap based on quantity
        UPDATE market_cap 
        SET market_cap = market_cap + (NEW.quantity * current_price)
        WHERE item_id = NEW.item_id;

        -- Decrease total supply based on quantity bought
        UPDATE total_supply 
        SET supply = supply - NEW.quantity
        WHERE item_id = NEW.item_id;
    ELSEIF NEW.trade_type = 'sell' THEN
        -- Decrease market cap based on quantity
        UPDATE market_cap 
        SET market_cap = market_cap - (NEW.quantity * current_price)
        WHERE item_id = NEW.item_id;

        -- Increase total supply based on quantity sold
        UPDATE total_supply 
        SET supply = supply + NEW.quantity
        WHERE item_id = NEW.item_id;
    END IF;

    -- Recalculate the price after the transaction
    SELECT (mc.market_cap / ts.supply) INTO NEW.after_price
    FROM market_cap mc
    JOIN total_supply ts ON mc.item_id = ts.item_id
    WHERE mc.item_id = NEW.item_id;

END $$

DELIMITER ;

-- ////////////////////////////////

DELIMITER $$

CREATE TRIGGER before_transaction_insert
BEFORE INSERT ON transactions
FOR EACH ROW
BEGIN
    DECLARE current_price DECIMAL(10, 2);

    -- Get the current price of the item
    SELECT price INTO current_price
    FROM prices
    WHERE item_id = NEW.item_id
    ORDER BY id DESC
    LIMIT 1;

    -- Set the before_price to the current price
    SET NEW.before_price = current_price;

    -- Calculate the new price after the transaction based on trade type
    IF NEW.trade_type = 'buy' THEN
        -- Increase market cap based on quantity
        UPDATE market_cap 
        SET market_cap = market_cap + (NEW.quantity * current_price)
        WHERE item_id = NEW.item_id;

        -- Decrease total supply based on quantity bought
        UPDATE total_supply 
        SET supply = supply - NEW.quantity
        WHERE item_id = NEW.item_id;
    ELSEIF NEW.trade_type = 'sell' THEN
        -- Decrease market cap based on quantity
        UPDATE market_cap 
        SET market_cap = market_cap - (NEW.quantity * current_price)
        WHERE item_id = NEW.item_id;

        -- Increase total supply based on quantity sold
        UPDATE total_supply 
        SET supply = supply + NEW.quantity
        WHERE item_id = NEW.item_id;
    END IF;

    -- Recalculate the price after the transaction
    SELECT (mc.market_cap / ts.supply) INTO NEW.after_price
    FROM market_cap mc
    JOIN total_supply ts ON mc.item_id = ts.item_id
    WHERE mc.item_id = NEW.item_id;

END $$

DELIMITER ;

-- ////////////////////////////////
-- i want to make dynamic market. the price is depend on total supply and market cap. 
-- example if the supply is 10 and the market cap is 10,000. the price will be 1,000 for 1 unit because price = Market cap/total supply(10,000/10). if someone bought it 1 unit at 1,000. the price will change in another unit because market cap will increase +1,000 then 11,000. the total supply will decrease -1 then 9. so the new price is (11,000/9) for 1 unit. do u understand?


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
    INSERT INTO prices (item_id, price, initial_price)
    VALUES (NEW.item_id, new_price, NULL);

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
    DECLARE new_price DECIMAL(10, 2);
    DECLARE i INT;

    -- Initialize the current market cap and total supply
    SELECT market_cap INTO new_market_cap
    FROM market_cap
    WHERE item_id = NEW.item_id;

    SELECT supply INTO new_supply
    FROM total_supply
    WHERE item_id = NEW.item_id;

    -- Loop to adjust price for each unit
    SET i = 1;
    WHILE i <= NEW.quantity DO
        -- Update market cap based on transaction
        IF NEW.trade_type = 'buy' THEN
            -- Increase market cap by the price of one unit
            SET new_market_cap = new_market_cap + NEW.after_price;
            -- Decrease total supply
            SET new_supply = new_supply - 1;
        ELSEIF NEW.trade_type = 'sell' THEN
            -- Decrease market cap by the price of one unit
            SET new_market_cap = new_market_cap - NEW.after_price;
            -- Increase total supply
            SET new_supply = new_supply + 1;
        END IF;

        -- Recalculate the price after each adjustment
        IF new_supply > 0 THEN
            SET new_price = new_market_cap / new_supply;
        ELSE
            -- raise exception or set price to 0
            SET new_price = 0; -- Handle case when supply is zero
        END IF;

        -- Optionally update the prices table
        UPDATE prices
        SET price = new_price
        WHERE item_id = NEW.item_id;

        -- Increment the counter
        SET i = i + 1;
    END WHILE;

    -- Final update of market cap and total supply
    UPDATE market_cap
    SET market_cap = new_market_cap
    WHERE item_id = NEW.item_id;

    UPDATE total_supply
    SET supply = new_supply
    WHERE item_id = NEW.item_id;

END //

DELIMITER ;
