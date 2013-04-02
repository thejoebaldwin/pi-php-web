

<?php

$myFile = "reg10";
$fh = fopen($myFile, 'w+') or die("can't open file");
$stringData = "0";

fwrite($fh, $stringData);
fclose($fh);


//system("sh ./init");

?>
