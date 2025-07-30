<?php
// Show all errors for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS and JSON headers


// Include database connection
require 'connect.php';

$reservations = [];
// SQL query
$sql = "SELECT reservationID, firstName, lastName, emailAddress, phone, status, area, time, date, imageName FROM reservations";

if ($result = mysqli_query($con, $sql))
{
    $count = 0;
    while ($row = mysqli_fetch_assoc($result)) 
    {
        $reservations[$count]['reservationID'] = $row['reservationID'];
        $reservations[$count]['firstName'] = $row['firstName'];
        $reservations[$count]['lastName'] = $row['lastName'];
        $reservations[$count]['email'] = $row['email'];
        $reservations[$count]['phone'] = $row['phone'];
        $reservations[$count]['status'] = $row['status'];
        $reservations[$count]['area'] = $row['area'];
        $reservations[$count]['time'] = $row['time'];
        $reservations[$count]['date'] = $row['date'];

        $count++;
    }

    echo json_encode(['data' => $reservations]);
 } 
 else {
    http_response_code(404);
 }
?>
