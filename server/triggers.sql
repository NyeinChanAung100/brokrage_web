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

DELIMITER $$
AFTER INSERT ON transactions
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
END $$

i want to make dynamic market. the price is depend on total supply and market cap. 
example if the supply is 10 and the market cap is 10,000. the price will be 1,000 for 1 unit because price = Market cap/total supply(10,000/10). if someone bought it 1 unit at 1,000. the price will change in another unit because market cap will increase +1,000 then 11,000. the total supply will decrease -1 then 9. so the new price is (11,000/9) for 1 unit. do u understand?