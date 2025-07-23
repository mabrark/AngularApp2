<?php
require 'connect.php';

$postdata = file_get_contents("php://input");

// Validate POST fields
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata, true); // decode as associative array

    $requiredFields = ['firstName', 'lastName', 'emailAddress', 'phone', 'status', 'area', 'time', 'date'];
    foreach ($requiredFields as $field) {
        if (!isset($_POST[$field]) || trim($_POST[$field]) === '') {
            http_response_code(400);
            echo json_encode(['error' => "Missing required field: $field"]);
            exit;
        }
    }
}

// Sanitize input
$firstName     = mysqli_real_escape_string($con, trim($_POST['firstName']));
$lastName      = mysqli_real_escape_string($con, trim($_POST['lastName']));
$emailAddress  = mysqli_real_escape_string($con, trim($_POST['emailAddress']));
$phone         = mysqli_real_escape_string($con, trim($_POST['phone']));
$status        = mysqli_real_escape_string($con, trim($_POST['status']));
$area          = mysqli_real_escape_string($con, trim($_POST['area']));
$time          = mysqli_real_escape_string($con, trim($_POST['time']));
$date          = mysqli_real_escape_string($con, trim($_POST['date']));
$imageName     = isset($_FILES['image']['name']) ? $_FILES['image']['name'] : 'placeholder_100.jpg';

// Check for duplicate reservation
$checkDuplicate = "SELECT 1 FROM reservations WHERE area = '$area' AND time = '$time' AND date = '$date'";
$duplicateResult = mysqli_query($con, $checkDuplicate);
if (mysqli_num_rows($duplicateResult) > 0) {
    http_response_code(409); // Conflict
    echo json_encode(['message' => 'A reservation already exists for this area, time, and date.']);
    exit;
}

// Optional: check for duplicate image name
if ($imageName !== 'placeholder_100.jpg') {
    $checkImageSql = "SELECT 1 FROM reservations WHERE imageName = '" . mysqli_real_escape_string($con, $imageName) . "'";
    $checkImageResult = mysqli_query($con, $checkImageSql);
    if (mysqli_num_rows($checkImageResult) > 0) {
        http_response_code(409); // Conflict
        echo json_encode(['message' => 'Duplicate image name.']);
        exit;
    }
}

// Handle file upload
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
        'firstName'     => $firstName,
        'lastName'      => $lastName,
        'emailAddress'  => $emailAddress,
        'phone'         => $phone,
        'status'        => $status,
        'area'          => $area,
        'time'          => $time,
        'date'          => $date,
        'imageName'     => $imageName
    ];
    echo json_encode(['data' => $reservation]);
} else {
    http_response_code(422);
    echo json_encode(['error' => 'Insert failed: ' . mysqli_error($con)]);
}
?>
