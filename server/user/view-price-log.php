<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include './../dbconnect/config.php';

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET['item_id'])) {
        $item_id = intval($_GET['item_id']);

        // Retrieve price logs for the specified item
        $select_sql = "SELECT price, log_time FROM price_log WHERE item_id = ? ORDER BY log_time ASC";
        $stmt = $conn->prepare($select_sql);
        $stmt->bind_param("i", $item_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $price_logs = [];
        while ($row = $result->fetch_assoc()) {
            $price_logs[] = [
                'price' => $row['price'],
                'log_time' => $row['log_time']
            ];
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
