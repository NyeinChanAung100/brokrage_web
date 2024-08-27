-- DELIMITER //

-- CREATE TRIGGER after_trade
-- AFTER INSERT ON trade_history
-- FOR EACH ROW
-- BEGIN
--     DECLARE new_market_cap DECIMAL(20, 2);
--     DECLARE new_price DECIMAL(10, 2);
--     DECLARE total_supply INT;
--     DECLARE total_demand INT;

--     -- Calculate total supply and demand from the order book
--     SET total_supply = (SELECT SUM(quantity) FROM order_book WHERE item_id = NEW.item_id AND order_type = 'sell' AND status = 'pending');
--     SET total_demand = (SELECT SUM(quantity) FROM order_book WHERE item_id = NEW.item_id AND order_type = 'buy' AND status = 'pending');

--     -- Adjust the price based on supply and demand
--     IF total_demand > total_supply THEN
--         SET new_price = NEW.price * 1.01;  -- Example: increase price by 1%
--     ELSEIF total_demand < total_supply THEN
--         SET new_price = NEW.price * 0.99;  -- Example: decrease price by 1%
--     ELSE
--         SET new_price = NEW.price;  -- No change if supply equals demand
--     END IF;

--     -- Update the market cap based on the new price
--     SET new_market_cap = new_price * (SELECT supply FROM total_supply WHERE item_id = NEW.item_id);

--     -- Update the price in the prices table
--     UPDATE prices
--     SET price = new_price
--     WHERE item_id = NEW.item_id;

--     -- Record price change in the price_history table
--     INSERT INTO price_history (item_id, previous_price, new_price, change_reason)
--     VALUES (NEW.item_id, OLD.price, new_price, 'trade');

-- END//

-- DELIMITER ;


-- ////////////////////////////////



DELIMITER //

CREATE TRIGGER after_buy_transaction
AFTER INSERT ON transactions -- assuming a 'transactions' table
FOR EACH ROW
BEGIN
    DECLARE new_market_cap DECIMAL(20, 2);
    DECLARE new_price DECIMAL(10, 2);
    DECLARE remaining_supply INT;

    -- Increase market cap by the value of the transaction
    SET new_market_cap = (SELECT market_cap FROM market_cap WHERE item_id = NEW.item_id) + (NEW.quantity * NEW.price);

    -- Decrease total supply by the quantity bought
    SET remaining_supply = (SELECT supply FROM total_supply WHERE item_id = NEW.item_id) - NEW.quantity;

    -- Update the market cap
    UPDATE market_cap
    SET market_cap = new_market_cap
    WHERE item_id = NEW.item_id;

    -- Update the total supply
    UPDATE total_supply
    SET supply = remaining_supply
    WHERE item_id = NEW.item_id;

    -- Recalculate and update the price
    SET new_price = new_market_cap / remaining_supply;
    UPDATE prices
    SET price = new_price
    WHERE item_id = NEW.item_id;
END//

DELIMITER ;

-- ////////////////////////////////

DELIMITER //

CREATE TRIGGER after_sell_transaction
AFTER INSERT ON transactions -- assuming a 'transactions' table
FOR EACH ROW
BEGIN
    DECLARE new_market_cap DECIMAL(20, 2);
    DECLARE new_price DECIMAL(10, 2);
    DECLARE remaining_supply INT;

    -- Decrease market cap by the value of the transaction
    SET new_market_cap = (SELECT market_cap FROM market_cap WHERE item_id = NEW.item_id) - (NEW.quantity * NEW.price);

    -- Increase total supply by the quantity sold
    SET remaining_supply = (SELECT supply FROM total_supply WHERE item_id = NEW.item_id) + NEW.quantity;

    -- Update the market cap
    UPDATE market_cap
    SET market_cap = new_market_cap
    WHERE item_id = NEW.item_id;

    -- Update the total supply
    UPDATE total_supply
    SET supply = remaining_supply
    WHERE item_id = NEW.item_id;

    -- Recalculate and update the price
    SET new_price = new_market_cap / remaining_supply;
    UPDATE prices
    SET price = new_price
    WHERE item_id = NEW.item_id;
END//

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
    WHERE item_id = NEW.item_id
    ORDER BY id DESC
    LIMIT 1;

    -- Calculate the new price
    SET new_price = NEW.market_cap / current_supply;

    -- Update the price in the prices table
    INSERT INTO prices (item_id, price, initial_price)
    VALUES (NEW.item_id, new_price, NULL);

END $$

DELIMITER ;

-- ////////////////////////////////

