<?php
require 'connect.php';

// Validate required POST fields
$requiredFields = ['firstName', 'lastName', 'emailAddress', 'phone', 'status', 'area', 'time', 'date'];
foreach ($requiredFields as $field) {
    if (!isset($_POST[$field]) || trim($_POST[$field]) === '') {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize input
$firstName = mysqli_real_escape_string($con, trim($_POST['firstName']));
$lastName = mysqli_real_escape_string($con, trim($_POST['lastName']));
$emailAddress = mysqli_real_escape_string($con, trim($_POST['emailAddress']));
$phone = mysqli_real_escape_string($con, trim($_POST['phone']));
$status = mysqli_real_escape_string($con, trim($_POST['status']));
$area = mysqli_real_escape_string($con, trim($_POST['area']));
$time = mysqli_real_escape_string($con, trim($_POST['time']));
$date = mysqli_real_escape_string($con, trim($_POST['date']));

// Handle image upload
$imageName = 'placeholder_100.jpg'; // default image

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = './uploads/';
    $originalFileName = basename($_FILES['image']['name']);
    $uploadFilePath = $uploadDir . $originalFileName;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFilePath)) {
        $imageName = mysqli_real_escape_string($con, $originalFileName);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file.']);
        exit;
    }
}

// Insert into database
$sql = "INSERT INTO `reservations` (
    `firstName`, `lastName`, `emailAddress`, `phone`, `status`, `area`, `time`, `date`, `imageName`
) VALUES (
    '$firstName', '$lastName', '$emailAddress', '$phone', '$status', '$area', '$time', '$date', '$imageName'
)";

if (mysqli_query($con, $sql)) {
    http_response_code(201);
    $reservation = [
        'reservationID' => mysqli_insert_id($con),
        'firstName' => $firstName,
        'lastName' => $lastName,
        'emailAddress' => $emailAddress,
        'phone' => $phone,
        'status' => $status,
        'area' => $area,
        'time' => $time,
        'date' => $date,
        'imageName' => $imageName
    ];
    echo json_encode(['data' => $reservation]);
} else {
    http_response_code(422);
    echo json_encode(['error' => 'Insert failed: ' . mysqli_error($con)]);
}
?>
