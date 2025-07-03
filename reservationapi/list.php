<?php
    require 'connect.php';

    $contacts = [];
    $sql = "SELECT contactID, firstName, lastName, emailAddress, phone, area, time, imageName, date FROM reservation";

    if ($result = mysqli_query($con, $sql))
    {
        $count = 0;
        while ($row = mysqli_fetch_assoc($result))
        {
            $contacts[$count]['contactID'] = $row['contactID'];
            $contacts[$count]['firstName'] = $row['firstName'];
            $contacts[$count]['lastName'] = $row['lastName'];
            $contacts[$count]['emailAddress'] = $row['emailAddress'];
            $contacts[$count]['phone'] = $row['phone'];
            $contacts[$count]['area'] = $row['area'];
            $contacts[$count]['time'] = $row['time'];
            $contacts[$count]['imageName'] = $row['imageName'];
            $contacts[$count]['date'] = $row['date'];

            $count++;
        }

        echo json_encode(['data'=>$contacts]);
    }
    else
    {
        http_response_code(404);
    }
?>