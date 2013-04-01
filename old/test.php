<?php 

$db = new PDO('sqlite:/var/www/pi.s3db');
$result  = $db->query('select * from lights');

foreach($result as $row)
{
	print $row['id'];
}

echo ("ok");

?>
