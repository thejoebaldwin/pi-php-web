
  
  <?php
  
include_once "markdown.php";
  
 
  if ($_SERVER['REQUEST_METHOD'] != "POST")
    {
       ?>
    <html>
  <head>
 
  <link rel="stylesheet" href="/css/reset.css" />
<link rel="stylesheet" href="/css/text.css" />
<link rel="stylesheet" href="/css/960_24_col.css" />
 <link rel="stylesheet" href="/css/style.css" />
</head>
  <body>
   
   <div class="container_24">
<div class="grid_5" id="left">
 
   <br/><br/>
 
  </div>
  <!-- end .grid_5 -->
  <div class="grid_19">
       <div id="content" class="content">
     <br/>
   <?php
    
    $text = file_get_contents('json.md');
   $html =  Markdown($text);
    
   
    
    
    echo($html);
    
    ?>
   </div>

    </div>
  <!-- end .grid_19 -->
  <div class="clear"></div>
</div>
   
   
   
  
    </body>
    </html>
    
    <?php
    
    
    }
    else
    {
           include "post_json.php";
    
    }
    ?>