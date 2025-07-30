<?php
require 'connect.php';
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

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

$emailCheckQuery = "SELECT reservationID FROM reservations WHERE emailAddress = '$emailAddress' AND reservationID != $reservationID LIMIT 1";
$emailCheckResult = mysqli_query($con, $emailCheckQuery);
if ($emailCheckResult && mysqli_num_rows($emailCheckResult) > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'Email address already exists.']);
    exit;
}

// Check if a new image is uploaded
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadFileDir = 'uploads/';
    $newImageName = basename($_FILES['image']['name'])

    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    $ext = strtolower(pathinfo($newImageName, PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid image type. Allowed: jpg, jpeg, png, gif.']);
        exit;
    }

    if ($newImageName !== 'placeholder_100.jpg') {
        $imageCheckQuery = "SELECT reservationID FROM reservations WHERE imageName = '$newImageName' AND reservationID != $reservationID LIMIT 1";
        $imageCheckResult = mysqli_query($con, $imageCheckQuery);
        if ($imageCheckResult && mysqli_num_rows($imageCheckResult) > 0) {
            http_response_code(409);
            echo json_encode(['error' => 'Image name already exists.']);
            exit;
        }
    }

    $targetFilePath = $uploadDir . $newImageName;
    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
        if (!empty($originalImageName) && $originalImageName !== 'placeholder_100.jpg' && file_exists($uploadDir . $originalImageName)) {
            unlink($uploadDir . $originalImageName);
        }
        $imageName = $newImageName;
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to upload image.']);
        exit;
    }
}


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
