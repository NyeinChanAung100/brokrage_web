<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include './../dbconnect/config.php';

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET['item_id'])) {
        $item_id = intval($_GET['item_id']);

        // Retrieve all price logs for the specified item
        $select_sql = "SELECT price, log_time FROM price_log WHERE item_id = ? ORDER BY log_time ASC";
        $stmt = $conn->prepare($select_sql);
        $stmt->bind_param("i", $item_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $price_logs = [];
        $previous_log_time = null;
        $previous_price = null;
        $interval = 30; // Interval in seconds

        while ($row = $result->fetch_assoc()) {
            $current_log_time = strtotime($row['log_time']);
            $current_price = $row['price'];

            if ($previous_log_time !== null) {
                // Calculate the difference in time between the current and previous log times
                $time_diff = $current_log_time - $previous_log_time;

                // If the difference is greater than the interval, fill in missing data
                while ($time_diff > $interval) {
                    $previous_log_time += $interval;
                    $price_logs[] = [
                        'price' => $previous_price,
                        'log_time' => date('Y-m-d H:i:s', $previous_log_time)
                    ];
                    $time_diff -= $interval;
                }
            }

            // Add the current price log to the array
            $price_logs[] = [
                'price' => $current_price,
                'log_time' => $row['log_time']
            ];

            // Update previous log time and price
            $previous_log_time = $current_log_time;
            $previous_price = $current_price;
        }

        echo json_encode(["success" => true, "data" => $price_logs]);

        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Missing item_id."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}

$conn->close();
?>
