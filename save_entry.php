<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $message = trim($_POST['message']);

    // Sanitize
    $email = htmlspecialchars($email);
    $message = htmlspecialchars($message);

    $entry = "Email: $email | Message: $message\n";
    $file = "entry.txt";

    // Check if email already exists in entry.txt
    $alreadySubmitted = false;
    if (file_exists($file)) {
        $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos($line, "Email: $email") !== false) {
                $alreadySubmitted = true;
                break;
            }
        }
    }

    if ($alreadySubmitted) {
        echo "<p style='color:red; font-weight:bold;'>Submit allowed only once!</p>";
        echo "<p><a href='index.html'>Go back to homepage</a></p>";
    } else {
        file_put_contents($file, $entry, FILE_APPEND | LOCK_EX);
        echo "<p>Thank you! Your entry has been saved.</p>";
        echo "<p><a href='index.html'>Go back to homepage</a></p>";
    }
}
?>
