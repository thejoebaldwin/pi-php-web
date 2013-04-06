/**
 * Shows how to use chaining rather than the `serialize` method.
 */
"use strict";


var http = require('http');
var wpi = require( 'node-wiringpi' );
var url = require('url');
var qs = require('querystring');
var sleep = require('sleep');

var pins;

var pins_final;

function init()
{

 // console.log( "you have " + wpi.num_pins() + " GPIO pins." );
 
 pins = new Array (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 , 15, 16);
 ids = new Array ();
 
 pins_final = new Array();
 
 for (var i = 0; i < pins.length;i++)
{
  console.log("setting pin " +  i + " OUT");
  wpi.pin_mode( pins[i], wpi.PIN_MODE.OUTPUT );
 }
 

}

var request;
var response;


var ids = new Array();
var started = false;
var pinIndex = 0;
var responseJSON;

function loop()
{
    
    var j = 0;
    
    pins_final = new Array();
    
    for (var i = 0; i < ids.length;i++)
    {
         for (var j = 0; j< ids.length;j++)
        {
        
            if (i == ids[j])
           {
           pins_final.push(pins[j]);
           console.log("moving " + pins[j] + " into " + i + " place");
            }
              
         }
     
    }
    
    
while (j < 40)
{
    
    
    
    
    
    for (var i = 0; i < pins_final.length;i++)
    {
         wpi.digital_write(  pins_final[i], wpi.WRITE.HIGH );
      sleep.usleep(50000);
    }
    
     for (var i = 0; i < pins_final.length;i++)
    {
      
      
      
         wpi.digital_write(  pins_final[i], wpi.WRITE.LOW );
      
      sleep.usleep(50000);
    }
    
    j++;
}
 
    
    
}

function clearPins()
{
     for (var i = 0; i < pins.length;i++)
    {
       console.log("setting pin " +  pins[i] + " OFF");
       wpi.digital_write(  pins[i], wpi.WRITE.LOW );
     }
    
}

function startConfig()
{
      if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var config = JSON.parse(body);
            if (config.mode == 'start')
            {
                started = true;
                pinIndex = 0;
                ids = new Array();
                
                clearPins();
                console.log("received start command now testing pin " + pins[pinIndex])
                wpi.digital_write(pins[pinIndex], wpi.WRITE.HIGH );
                
                response.write("{\"status\":\"ok\", \"message\": \"received start command\", \"pin\":\"" + pins[pinIndex] + "\"}");
                response.end();
                
            }
            else if (config.mode == 'configure')
            {
                //set light id to light pin
                if (started)
                {
                    //response.write("{\"status\":\"ok\", \"message\": \"received config pin " + config.id + " command\"}");
                    //response.end();
                    if (config.id == "-1")
                    {
                         ids.push(config.id);
                    }
                    else
                    {
                        ids.push(config.id);
                        //ids[pinIndex] = config.id;
                    }
                    wpi.digital_write(  pins[pinIndex], wpi.WRITE.LOW );
                    console.log("received config id " + config.id + " for pin " + pins[pinIndex]);
                    pinIndex++;
                  
                }
                if (pinIndex >= pins.length)
                {
                    started = false;
                    console.log("done configuring pins");
                    response.write("{\"status\":\"ok\", \"message\": \"done configuring pins\", \"pin\":\"DONE\"}");
                    response.end();
                    loop();
                }
                else
                {
                response.write("{\"status\":\"ok\", \"message\": \"now testing pin " + pins[pinIndex] + "\", \"pin\": \"" + pins[pinIndex] + "\"}");
                response.end();
                 console.log("now testing pin " + pins[pinIndex])
                 wpi.digital_write(pins[pinIndex], wpi.WRITE.HIGH );
                }
                
            }
        });
    }

    
    
    
    
}

init();

http.createServer( function(req,res) {

   

   var currentTime = new Date();
   res.writeHead(200, {'Content-Type':'text/plain'});
    //ignore the favicon request
        if (req.url === '/favicon.ico') {
            res.writeHead(200, { 'Content-Type': 'image/x-icon' });
            res.end();
            //console.log('favicon requested');
            return;
        }


        var queryData = url.parse(req.url, true).query;

      request = req;
      response = res;
        if (queryData.cmd == "config") {
            startConfig();
        }
        
        else {
            res.write("{\"status\":\"error\", \"message\": \"no parameter provided\"}");
            res.end();
        }

   
   
   

   

}).listen('8124');

