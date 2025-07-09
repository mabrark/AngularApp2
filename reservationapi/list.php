<?php
    require 'connect.php';

    $contacts = [];
    $sql = "SELECT reservationID, firstName, lastName, emailAddress, phone, area, time, imageName, date FROM reservation";

    if ($result = mysqli_query($con, $sql))
    {
        $count = 0;
        while ($row = mysqli_fetch_assoc($result))
        {
            $reservations[$count]['reservationID'] = $row['reservationID'];
            $reservations[$count]['firstName'] = $row['firstName'];
            $reservations[$count]['lastName'] = $row['lastName'];
            $reservations[$count]['emailAddress'] = $row['emailAddress'];
            $reservations[$count]['phone'] = $row['phone'];
            $reservations[$count]['area'] = $row['area'];
            $reservations[$count]['time'] = $row['time'];
            $reservations[$count]['imageName'] = $row['imageName'];
            $reservations[$count]['date'] = $row['date'];

            $count++;
        }

        echo json_encode(['data'=>$reservations]);
    }
    else
    {
        http_response_code(404);
    }
?>