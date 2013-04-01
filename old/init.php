

<?php

$myFile = "reg10";
$fh = fopen($myFile, 'w+') or die("can't open file");
$stringData = "1";
fwrite($fh, $stringData);
fclose($fh);


//system("sh ./init");

?>
