<?php
class Database
{
    // property declaration
    public $State = '';
    public $Version = '';
    private $DB_PATH = 'sqlite:/var/www/%s/pi.s3db';
    private $_dbPath = NULL;
    private $_connection = NULL;
    
    public function SetVersion($version)
    {
        $this->Version = $version;
        $this->_dbPath = sprintf($this->DB_PATH, $this->Version);
    }
    
    public function Query($cmd)
    {
        $result = NULL;
        if ($this->_dbPath == NULL)
        {
            echo "NEED TO SET VERSION NUMBER";
        }
        else
        {
            if ($_connection == NULL)
            {
                $_connection = new PDO($this->_dbPath);
            }
            
            if (substr_count($cmd, ';') > 1)
            {
                $_connection->exec($cmd);
                echo("EXEC");
            }
            else
            {
                 $result  = $_connection->query($cmd);
                 echo("QUERY");
            }
        }
        return $result;
    }

}
?>