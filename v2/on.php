<html>
<head>
</head>
<body>
<form name="input" action="on.php" method="post" >

<?php
require_once('class.light.php');
require_once('class.database.php');

$db = new Database();
$db->SetVersion('v2');
$result  = $db->Query('select * from lights');

$array = array();
$update_sql = "";
$counter = 0;

foreach($result as $row)
{
    //check db value
    //   then check post value
    //   build query to update db from post value
    $light = new Light();
    $light->Id = $row['id'];
    $light->State  = $row['state'];
    $light->Pin  = $row['pin'];
    $light->LastUpdated  = $row['lastupdated'];
    array_push($array, $light);
}

foreach($array as $light)
{
        echo ($light->Id . " " . $light->State . " " . $light->Pin . " " . $light->LastUpdated);
        $checked = "";
        if ($light->State == "1" || $light->State=="Y")
        {
            $checked = "checked";
        }
    
        if ($_SERVER['REQUEST_METHOD'] == "POST")
        {
            //compare this to what is in db
            $post_state = "0";
            if (isset($_POST["light" .  $light->Id]))
            {
              $post_state = "1";
            }
            if ($post_state != $light->State)
            {
                $update_sql = $update_sql . 'UPDATE lights SET state=' . $post_state . ',lastupdated=' . time() .  ' WHERE id = '. $light->Id . ';';
            }
            $checked = "";
            if ($post_state == "1")
            {
                $checked = "checked";
            }
        }
    ?>
    <input <?php echo $checked ?> type="checkbox" name="light<?php echo $light->Id  ?>" value="light<?php echo $light->Id ?>">Light <?php  echo $light->Id ?> <br/>
    <?php
 }

 if ($_SERVER['REQUEST_METHOD'] == "POST" && $update_sql != "")
    {
        echo($update_sql);
        $db->Query($update_sql);
        $db = NULL;
    }

?>

<input type="submit" value="Submit">
</form>
</body>


</html>