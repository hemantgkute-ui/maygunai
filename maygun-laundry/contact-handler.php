<?php
/**
 * Optional server-side handler for the "General Enquiry" form on contact.html.
 *
 * Not wired up by default — the site works fully as static HTML/CSS/JS,
 * and the enquiry form currently redirects to WhatsApp via JavaScript
 * (see assets/js/main.js). Enable this ONLY if your hosting supports PHP
 * and you want enquiries emailed to you as a fallback channel.
 *
 * To enable:
 *   1. Set $to_email below to your business inbox.
 *   2. In contact.html, change the enquiry <form> to:
 *        <form class="contact-form" action="contact-handler.php" method="POST" novalidate>
 *   3. Confirm your hosting's mail() function is configured (most shared
 *      hosting for .in domains, e.g. Hostinger/GoDaddy, supports this).
 */

header('Content-Type: application/json');

$to_email = "hello@maygunlaundry.in";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$name = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

if ($name === '' || $email === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all fields with a valid email address.']);
    exit;
}

$subject = "New Enquiry from Maygun Laundry Website";
$body = "You have a new enquiry from the Maygun Laundry website:\n\n"
      . "Name: {$name}\n"
      . "Email: {$email}\n\n"
      . "Message:\n{$message}\n";

$headers = "From: no-reply@maygunlaundry.in\r\n"
         . "Reply-To: " . filter_var($email, FILTER_SANITIZE_EMAIL) . "\r\n"
         . "Content-Type: text/plain; charset=UTF-8";

$sent = @mail($to_email, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Thank you! Your message has been sent.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Sorry, something went wrong. Please try WhatsApp instead.']);
}
