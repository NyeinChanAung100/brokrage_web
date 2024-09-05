DELIMITER $$

CREATE PROCEDURE log_prices()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE current_item_id INT;
    DECLARE current_price DECIMAL(10, 2);
    DECLARE item_cursor CURSOR FOR SELECT id FROM items;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN item_cursor;

    read_loop: LOOP
        FETCH item_cursor INTO current_item_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Get the current price of the item
        SELECT price INTO current_price
        FROM prices
        WHERE item_id = current_item_id;

        -- Insert the price into the price_log table
        INSERT INTO price_log (item_id, price)
        VALUES (current_item_id, current_price);
    END LOOP;

    CLOSE item_cursor;
END $$

DELIMITER ;

SET GLOBAL event_scheduler = ON;

CREATE EVENT log_prices_every_second
ON SCHEDULE EVERY 30 SECOND
DO
CALL log_prices();

