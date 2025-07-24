<?php
// Show all errors for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS and JSON headers


// Include database connection
require 'connect.php';

$reservations = [];

// Check DB connection
if (!$con) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// SQL query
$sql = "SELECT reservationID, firstName, lastName, emailAddress, phone, status, area, time, date, imageName FROM reservations";

$result = mysqli_query($con, $sql);

// Check if query succeeded
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $reservations[] = $row;
    }
    echo json_encode(['data' => $reservations]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed: ' . mysqli_error($con)]);
}
?>
