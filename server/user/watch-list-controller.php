<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['user_id']) && isset($data['item_id'])) {
        $user_id = intval($data['user_id']);
        $item_id = intval($data['item_id']);

        // Check if the item is already in the watchlist
        $check_sql = "SELECT COUNT(*) FROM watchlist WHERE user_id = ? AND item_id = ?";
        $stmt = $conn->prepare($check_sql);
        $stmt->bind_param("ii", $user_id, $item_id);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();

        if ($count > 0) {
            // If the item is already in the watchlist, remove it
            $delete_sql = "DELETE FROM watchlist WHERE user_id = ? AND item_id = ?";
            $stmt = $conn->prepare($delete_sql);
            $stmt->bind_param("ii", $user_id, $item_id);
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Item removed from watchlist."]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to remove item from watchlist."]);
            }
            $stmt->close();
        } else {
            // If the item is not in the watchlist, add it
            $insert_sql = "INSERT INTO watchlist (user_id, item_id) VALUES (?, ?)";
            $stmt = $conn->prepare($insert_sql);
            $stmt->bind_param("ii", $user_id, $item_id);
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Item added to watchlist."]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to add item to watchlist."]);
            }
            $stmt->close();
        }
    } else {
        echo json_encode(["success" => false, "message" => "Missing user_id or item_id."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}

$conn->close();
?>
