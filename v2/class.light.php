<?php
class Light
{
    // property declaration
    public $State = '';

    public $Pin = '';

    public $Id = '';

    public $UserId = '';

    public $LastUpdated;
    
    // method declaration
    public function displayPin() {
        echo $this->Pin;
    }
}
?>