<?php
require_once('class.light.php');
require_once('class.database.php');


$array = array();
$json = file_get_contents('php://input');
$serverTimestamp = mktime();
$serverTimestamp = $serverTimestamp / 100;
$serverTimestamp = round($serverTimestamp);
$serverTimestamp = floor( $serverTimestamp);
$obj = json_decode($json, true);
$response = "";
echo $obj;


if (count($obj) == 0)
{
  $response = '{ "status":"error", "message":"Please check your JSON formatting", "timestamp":"'. $serverTimestamp . '"   }';
}
else
{
    $light = new Light();
    $light->Id =  $obj['light']['id'];
    $light->State =  $obj['light']['state'];
    $key =  $obj['light']['key'];
    $timestamp =  $obj['light']['timestamp'];
    $signature = $obj['light']['signature'];
    $secret = "";
    $sql = "SELECT * FROM Users WHERE key = '" . $key . "';";
    $db = new Database();
    $db->SetVersion('v2');
    $result  = $db->Query($sql);
    $update_sql = "";
    $counter = 0;
    $userid = -1;
    foreach($result as $row)
    {
        $secret = $row['secret'];
        $userid = $row['user_id'];
    }
    $hash = md5($key . "&" . $secret . "&" . $serverTimestamp);
    $authenticated = false;
    
    if ( strcmp( $timestamp, $serverTimestamp))
    {
        $authenticated = true;
    }
    if ($authenticated == true)
    {
        $update_sql = 'UPDATE lights SET state=' .  $light->State . ',lastupdated=' . time() .  ' WHERE id = '.  $light->Id . ';';
        $db->Query($update_sql);
        $db = NULL;
        $response = '{ "status":"ok", "message":"Light updated successfully", "timestamp":"'. $serverTimestamp . '", "Light":{ "id":"' .  $light->Id . '", "state":"' .  $light->State . '"   }  }';
    }
    else
    {
        $response = '{ "status":"error", "message":"Timestamps do not match!", "timestamp":"'. $serverTimestamp . '"   }';
    }
}
echo $response;
?>