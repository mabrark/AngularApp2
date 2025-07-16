<?php
require 'connect.php';

$reservationID = isset($_GET['reservationID']) ? (int) $_GET['reservationID'] : 0;

if ($reservationID <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid reservation ID']);
    exit;
}

$sql = "SELECT * FROM reservations WHERE reservationID = {$reservationID} LIMIT 1";

if ($result = mysqli_query($con, $sql)) {
    if (mysqli_num_rows($result) === 1) {
        echo json_encode(mysqli_fetch_assoc($result));
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Reservation not found']);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed']);
}
?>
