<?php
    require 'connect.php';

    //get the posted data
    $postdata = file_get_contents("php://input");

    if(isset($postdata) && !empty($postdata))
    {
           //Extract the data
           $request = json_decode($postdata);

           //Validate
           if(trim($request->data->firstName) == '' || trim($request->data->lastName) == '' ||
              trim($request->data->emailAddress) == '' || trim($request->data->phone) == '' ||
              trim($request->data->status) == '' || trim($request->data->area) == '' ||
              trim($request->data->time) == '' || trim($request->imageName) == '' || trim($request->data>date) == '')
              {
                return http_response_code(400);
              }

       //sanitize
       $firstName = mysqli_real_escape_string($con, trim($request->data->firstName));
       $lastName = mysqli_real_escape_string($con, trim($request->data->lastName)); 
       $emailAddress = mysqli_real_escape_string($con, trim($request->data->emailAddress));
       $phone = mysqli_real_escape_string($con, trim($request->data->phone));
       $status = mysqli_real_escape_string($con, trim($request->data->status));
       $area = mysqli_real_escape_string($con, trim($request->data->area));
       $time = mysqli_real_escape_string($con, trim($request->data->time));
       $imageName = mysqli_real_escape_string($con, trim($request->data->imageName));
       $date = mysqli_real_escape_string($con, trim($request->data->date)); 
       
       $origimg = str_replace('\\', '/', $imageName);
       $new = basename($origimg);

       //store the data
       $sql = "INSERT INTO `reservations`(`reservationID`,`firstName`,`lastName`, `emailAddress`, `phone`, `status`, `area`, 'time', `imageName` 'ddate') VALUES (null,'{$firstName}','{$lastName}','{$emailAddress}','{$phone}','{$status}','{$area}', '{$time}', '{$date}' '{$new}')";

       if(mysqli_query($con, $sql))
       {
        http_response_code(201);

        $contact = [
          'firstName' => $firstName,
          'lastName' => $lastName,
          'emailAddress' => $emainAddress,
          'phone' => $phone,
          'status' => $status,
          'area' => $area,
          'time' => $time,
          'imageName' => $new,
          'date' => $date,
          'reservationID' => mysqli_insert_id($con)
        ];

        echo json_encode(['data'=>$reservation]);
       }
       else
       {
        http_response_code(422);
       }

    }
    

?>