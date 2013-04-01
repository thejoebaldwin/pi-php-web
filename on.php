<html>
<head>


</head>
<body>


<form name="input" action="on.php" method="post" >

<?php
$db = new PDO('sqlite:/var/www/pi.s3db');
$result  = $db->query('select * from lights');


$update_sql = "";

foreach($result as $row)
{
   //check db value
   // then check post value
   //build query to update db from post value
   
    $id = $row['id'];
    $state = $row['state'];
    $checked = "";
    if ($state == "1")
    {
        $checked = "checked";
    }
    
    if ($_SERVER['REQUEST_METHOD'] == "POST")
    {
        //compare this to what is in db
        $post_state = "0";
        if ($_POST["light" .  $row['id']] != "")
        {
          $post_state = "1";
        }
        
        if ($post_state != $state)
        {
            $update_sql = $update_sql . 'UPDATE lights SET state=' . $post_state . ',lastupdated=' . time() .  ' WHERE id = '. $id . ';';
        }
        
        $checked = "";
        if ($post_state == "1")
        {
            $checked = "checked";
        }
        
    }
    
    ?>

    
    
<input <?php echo $checked ?> type="checkbox" name="light<?php echo $id  ?>" value="1">Light <?php  echo $id ?> <br/>
    
    <?php
}



 if ($_SERVER['REQUEST_METHOD'] == "POST" && $update_sql != "")
    {
        echo($update_sql);
        $db->exec($update_sql);
        $db = NULL;
    }

?>


<input type="submit" value="Submit">
</form>


</body>


</html>