

<?php

$query = $_SERVER['QUERY_STRING'];
$lights = explode("=", $query);
echo ($lights[1]);



$myFile = "lights";
$fh = fopen($myFile, 'w+') or die("can't open file");
$stringData = $lights[1];
fwrite($fh, $stringData);
fclose($fh);


//system("sh ./init");

?>
