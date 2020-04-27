const SerialPort = require('serialport');
const WebSocketServer = require('ws').Server;

const SERVER_PORT = 8081;                           //  Port number for the webSocket server
var wss = new WebSocketServer({port: SERVER_PORT}); //  the webSocket server itself
var connections = new Array;                        //  List of connections to the server
//  Webserver Portions continue later on

/* 
//  List SerialPorts available:

// Promise approach
SerialPort.list().then(ports => {
  ports.forEach(function(port) {
    console.log(port.path);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});
*/

//var portName = process.argv[2]; //Take as argument /after/ the text running the command for this file
var portName = "COM5";
var myPort = new SerialPort(portName, 9600);

var Readline = SerialPort.parsers.Readline; //  Make instance of Readline parser
var parser = new Readline();                //  Make a new parser to read ASCII lines
myPort.pipe(parser);                        //  Pipe the serial stream to the parser

//-------------------------------------------------------
// Callback functions for Serial Monitoring:
myPort.on('open', showPortOpen);
parser.on('data', readSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

/*myPort.on('readable', function readSerialData(){  //Reads & Displays Unparsed Data from the Serial Port
    console.log("Data: ", myPort.read());
});*/
function showPortOpen(){
    console.log("Port's Open. Data Rate: " + myPort.baudRate);
}
function readSerialData(data){
    console.log(data);
    //  If there are webSocket connections, send the serial data to all of them:
    if(connections.length != 0) {
        broadcast(data);
    }
}
function showPortClose(){
    console.log("Port's Closed");
}
function showError(){
    console.log("Serial Port Error: " + error);
}


//----------------------------------------------------
//Websocket Event Listeners:
wss.on('connection', handleConnection);

function handleConnection(client) {
    console.log("New Connection");  //  We've got a new client
    connections.push(client);       //  Add this client to the connections array

    client.on('message', sendToSerial); //  When a client sends a message,

    client.on('close', function(){          //  When a client closes its connection,
        console.log("Connection Closed");   //     Print it out
        var position = connections.indexOf(client); //   Get the client's position in the array
        connections.splice(position, 1);           //   And delete it from the array
    })
}

function sendToSerial(data) {
    console.log("Sending to Serial: " + data);
    myPort.write(data);
}

function broadcast (data) {         //  Broadcasts messages to all webSocket clients
    for(myConnection in connections){           //  Iterate over the array of connections
        connections[myConnection].send(data);   //  Send the data to each connection
    }
}