var m = require('mraa'); //IO Library
var app = require('express')(); //Express Library
var server = require('http').Server(app); //Create HTTP instance
var ngrok = require('ngrok'); //ngrok
var engine = require('express-dot-engine'); //Template engine

var io = require('socket.io')(server); //Socket.IO Library

var blinkInterval = 1000; //set default blink interval to 1000 milliseconds (1 second)
var ledState = 1; //set default LED state
var ngrokURL = ''; //public URL created by ngrok

var myLed = new m.Gpio(13); //LED hooked up to digital pin 13
myLed.dir(m.DIR_OUT); //set the gpio direction to output

app.engine('dot', engine.__express);
app.set('views', __dirname); //location of the templates
app.set('view engine', 'dot'); //tell express to render with the dot template engine

app.get('/', function (req, res) {                  
    res.render('index',{url:ngrokURL}); //render index.html and interpolate the url variable
});                                                 

io.on('connection', function(socket){
    socket.on('changeBlinkInterval', function(data){ //on incoming websocket message...
        blinkInterval = data; //update blink interval
    });
});                                                   

server.listen(80); //run on port 80

ngrok.connect(80, function(err, url){ //tell ngrok to bind to port 80                                                
    if(err){                                         
        console.log(err);              
    }else{                             
        ngrokURL = url;                
        console.log(url);              
    }                                  
});  

blink(); //start the blink function

function blink(){                                                                               
    myLed.write(ledState); //write the LED state
    ledState = 1 - ledState; //toggle LED state
    setTimeout(blink,blinkInterval); //recursively toggle pin state with timeout set to blink interval
}  
