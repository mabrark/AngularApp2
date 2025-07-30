<?php
    session_start();

    header('Content-Type: application/json');
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    require 'connect.php';

    $uploadDir = 'uploads/';


    // Handle image upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {

        http_response_code(400);
    echo json_encode(['error' => 'No file uploaded or upload error occurred.']);
    exit;

    }
      $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      $fileTmpPath = $_FILES['image']['tmp_name'];
      $fileName = basename($_FILES['image']['name']);
      $fileType = mime_content_type($fileTmpPath);

      if (!in_array($fileType, $allowedMimeTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid image format. Only JPG, PNG, and GIF are allowed.']);
        exit;
    }

    $targetFilePath = $uploadDir . $fileName;
if (move_uploaded_file($fileTmpPath, $targetFilePath)) {
    http_response_code(200);
    echo json_encode(['message' => 'File uploaded successfully', 'fileName' => $fileName]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move uploaded file.']);
}
?>
    