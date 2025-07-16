<?php
require 'connect.php';

$reservations = [];
$sql = "SELECT reservationID, firstName, lastName, emailAddress, phone, status, area, time, date, imageName FROM reservations";

if ($result = mysqli_query($con, $sql)) {
    while ($row = mysqli_fetch_assoc($result)) {
        $reservations[] = $row;
    }

    echo json_encode(['data' => $reservations]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Could not retrieve reservations']);
}
?>
