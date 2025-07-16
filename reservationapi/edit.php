<?php
require 'connect.php';

// Sanitize and validate inputs
$reservationID = isset($_POST['reservationID']) ? (int)$_POST['reservationID'] : 0;
$firstName = trim($_POST['firstName'] ?? '');
$lastName = trim($_POST['lastName'] ?? '');
$emailAddress = trim($_POST['emailAddress'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$status = trim($_POST['status'] ?? '');
$area = trim($_POST['area'] ?? '');
$time = trim($_POST['time'] ?? '');
$originalImageName = $_POST['originalImageName'] ?? '';
$date = trim($_POST['date'] ?? '');

// Validation
if (
    $reservationID < 1 || $firstName === '' || $lastName === '' ||
    $emailAddress === '' || $phone === ''
) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// Sanitize for DB
$reservationID = mysqli_real_escape_string($con, $reservationID);
$firstName = mysqli_real_escape_string($con, $firstName);
$lastName = mysqli_real_escape_string($con, $lastName);
$emailAddress = mysqli_real_escape_string($con, $emailAddress);
$phone = mysqli_real_escape_string($con, $phone);
$status = mysqli_real_escape_string($con, $status);
$area = mysqli_real_escape_string($con, $area);
$time = mysqli_real_escape_string($con, $time);
$date = mysqli_real_escape_string($con, $date);

$imageName = $originalImageName;

// Check if a new image is uploaded
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['image']['tmp_name'];
    $fileName = $_FILES['image']['name'];
    $uploadFileDir = './uploads/';
    $dest_path = $uploadFileDir . $fileName;

    if (move_uploaded_file($fileTmpPath, $dest_path)) {
        $imageName = $fileName;

        // Delete old image if it's not a placeholder
        if ($originalImageName !== 'placeholder_100.jpg') {
            $oldImagePath = $uploadFileDir . $originalImageName;
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file.']);
        exit;
    }
}

$imageName = mysqli_real_escape_string($con, $imageName);

// ✅ FIXED: Removed incorrect single quotes around column names
$sql = "UPDATE `reservations` SET 
          `firstName` = '$firstName',
          `lastName` = '$lastName',
          `emailAddress` = '$emailAddress',
          `phone` = '$phone',
          `status` = '$status',
          `area` = '$area',
          `time` = '$time',
          `date` = '$date',
          `imageName` = '$imageName'
        WHERE `reservationID` = '$reservationID'
        LIMIT 1";

if (mysqli_query($con, $sql)) {
    http_response_code(200);
    echo json_encode(['message' => 'Reservation updated']);
} else {
    http_response_code(422);
    echo json_encode(['error' => 'Database update failed: ' . mysqli_error($con)]);
}
