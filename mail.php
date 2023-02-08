<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once('mail_config.php');

$output = array();

if (isset($_POST)) {
  $token = $_POST['recaptcha_response'];
  $response = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.SECRET_KEY.'&response='.$token.'&remoteip='.$_SERVER['REMOTE_ADDR']);
  $return = json_decode($response);
  if ($return->success && $return->score >= THRESHOLD) {
    $message = '';
    foreach ($_POST as $key => $value) {
      if ($key == 'recaptcha_response') continue;
      $message .= $key.":\t".$value."\n";
    }

    smtp_mail(MAILTO,$_POST['subject'],$message,'noreply@patrickmorgan.us');
    $output['success'] = 'Message sent';
    $output['error'] = '';
  } else {
    $output['error'] = 'Error';
    $output['success'] = '';
  }
} else {
  $output['error'] = 'No Post received';
  $output['success'] = '';
}

echo json_encode($output);

function smtp_mail($to,$subject,$message,$from) {
  require 'phpmailer/Exception.php';
  require 'phpmailer/PHPMailer.php';
  require 'phpmailer/SMTP.php';

  $mail = new PHPMailer;
  $mail->isSMTP(); 
  $mail->SMTPDebug = 0; // 0 = off (for production use) - 1 = client messages - 2 = client and server messages
  $mail->Host = MAIL_SERVER;
  $mail->Port = 587;
  $mail->SMTPSecure = 'tls';
  $mail->SMTPAuth = true;
  $mail->Username = SMTP_USERNAME;
  $mail->Password = SMTP_PASSWORD;
  $mail->setFrom('noreply@'.DOMAIN,DOMAIN);
  $mail->AddReplyTo($from,$from);
  $mail->addAddress($to,$to);
  $mail->Subject = $subject;
  $mail->Body = $message;
  $mail->send();
}
?>