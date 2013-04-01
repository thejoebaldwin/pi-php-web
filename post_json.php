

<?php
$json = file_get_contents('php://input');

echo $json;
echo ("\n");

$obj = json_decode($json, true);

$id =  $obj['lights']['id'];

echo("id:" . $id . "\n");

$state =  $obj['lights']['state'];

echo("state:" . $state . "\n");

$db = new PDO('sqlite:/var/www/pi.s3db');

$update_sql = 'UPDATE lights SET state=' . $state . ',lastupdated=' . time() .  ' WHERE id = '. $id . ';';

  echo($update_sql);
        $db->exec($update_sql);
        $db = NULL;


var_dump($obj);

?>