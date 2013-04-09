/**
 * Shows how to use chaining rather than the `serialize` method.
 */
"use strict";


var http = require('http');
var wpi = require( 'node-wiringpi' );
var url = require('url');
var qs = require('querystring');
var sleep = require('sleep');
var sqlite3 = require('sqlite3').verbose();

var pins;

var pins_final;


function closeDb() {
    console.log("closeDb");
  //  db.close();
}

function createDb(callback) {
    console.log("createDb");
  
    db = new sqlite3.Database('pi2.s3db', callback);
}

var db;

function save() {
     
    var cmd = '';
    for (var i = 0; i < pins_final.length;i++)
    {
     cmd =  "UPDATE Lights SET pin_mapped = ? WHERE pin = ?;"
     db.run(cmd, pins_final[i], i);
    }
    closeDb();

}

function nothing()
{
    
}

function load() {

    console.log('load()');
    db.all("SELECT * FROM Lights ORDER BY pin", function (err, rows) {
        var i = 0;
        rows.forEach(function (row) {
        
           console.log("adding pin " + row.id + " to mapped " + row.pin_mapped);
            pins_final.push(row.pin_mapped);
          
        });
        closeDb();
     
        
    });
}




function init()
{

 // console.log( "you have " + wpi.num_pins() + " GPIO pins." );
 
 pins = new Array (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 , 15, 16);
 ids = new Array  (-1, -1,-1, -1,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,-1 , -1, -1);
 
 pins_final = new Array();
 
 for (var i = 0; i < pins.length;i++)
 {
  console.log("setting pin " +  i + " OUT");
  wpi.pin_mode( pins[i], wpi.PIN_MODE.OUTPUT );
 }

  createDb(load);
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
    
      createDb(save);
      

 
    
    
}


function allDone()
{
    console.log("allDone");
    response.end();
}

function someJob( callback ) {
    // heavy work
    
    var j = 0;
    while (j < 10)
{
    
    for (var i = 0; i < pins_final.length;i++)
    {
        wpi.digital_write(  pins_final[i], wpi.WRITE.HIGH );
        sleep.usleep(30000);
        wpi.digital_write(  pins_final[i], wpi.WRITE.LOW );
        sleep.usleep(30000);
        wpi.digital_write(  pins_final[i], wpi.WRITE.HIGH );
        sleep.usleep(30000);
         wpi.digital_write(  pins_final[i], wpi.WRITE.LOW );
    }
    
     for (var i = pins_final.length -1; i >= 0;i--)
    {
       wpi.digital_write(  pins_final[i], wpi.WRITE.HIGH );
        sleep.usleep(30000);
        wpi.digital_write(  pins_final[i], wpi.WRITE.LOW );
        sleep.usleep(30000);
        wpi.digital_write(  pins_final[i], wpi.WRITE.HIGH );
        sleep.usleep(30000);
         wpi.digital_write(  pins_final[i], wpi.WRITE.LOW );
    }
    
    j++;
}
    
    
    process.nextTick( callback );
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

//TODO: add support for multiple pins
function startControl()
{
      if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
        var config = JSON.parse(body);
           
        console.log("config.mode=" + config.mode);
        if (config.mode == 'control')
            {

                //do timestamp math here
                var clienttimestamp = config.timestamp;
                var servertimestamp = new Date().getTime();
                servertimestamp = Math.floor(servertimestamp / 1000000);
        
//        if (servertimestamp != clienttimestamp)
  //              {
             //   var json  = "{\"status\":\"error\", \"message\": \"there is a problem with your timestamp\", \"timestamp\":\"" + servertimestamp   + "\, \"received_timestamp\":\"" + clienttimestamp + "\" }";
               // console.log(json);
               // response.write(json);
               // response.end();

//                }
  //              else
    //            { 

                for (var i = 0; i < config.lights.length;i++)
                {
                    if (config.lights[i].state == "on")
                    {
                      wpi.digital_write(pins_final[config.lights[i].id], wpi.WRITE.HIGH );
                    }
                    else
                    {
                      wpi.digital_write(pins_final[config.lights[i].id], wpi.WRITE.LOW );
                    }
                    console.log("config.state=" + config.lights[i].state + "||config.id=" + config.lights[i].id);
                }
      //          }
                //response.write("{\"status\":\"ok\", \"message\": \"done controlling pin\", \"pin\":\"" + config.id + "\", \"state\": \"" + config.state + "\"}");
response.write("{\"status\":\"ok\",\"message\": \"light successfully configured\"}");               
 response.end();
            }
            else {
                response.write("{\"status\":\"error\", \"message\": \"no parameter provided\"}");
                response.end();
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
        else if  (queryData.cmd == "control") {
            startControl();
        }
        else if  (queryData.cmd == "loop") {
           someJob(allDone);
        }
        else if  (queryData.cmd == "test") {
          console.log("test");
          response.end();
        }
        else {
            res.write("{\"status\":\"error\", \"message\": \"no parameter provided\"}");
            res.end();
        }

   
   
   

   

}).listen('8124');

