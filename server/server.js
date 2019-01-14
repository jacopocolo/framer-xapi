const fs = require('fs');
const jsxapi = require('jsxapi');
const http = require('http');
const WebSocket = require('ws');
const server = new http.createServer();
const ws = new WebSocket.Server({ server });
var xapi;
var xapiConnected = false;

// Setup a listener for new connections
ws.on('connection', (ws) => {
  console.log("Client connected");

  ws.on('message', function(message) {
      if (xapiConnected==false) {
        var props = JSON.parse(message);
          xapi = jsxapi.connect('ws://'+props.deviceUsername+':'+props.devicePassword+'@'+props.deviceIp+'/ws').on('ready', () => {
          xapiConnected = true; 
          ws.send("connected");
        });
      } else {
        eval(message);
      }

      // if (message == "notification") {
      //   xapi.command('UserInterface Message Alert Display', {
      //     Title: "Test",
      //     Text: "Notification goes here",
      //     Duration: 5,
      //   });
      //   //this doesn't work for some reason
      //   ws.send("done");
      // }
      
      // if (message == "mute") {
      //   xapi.command('Audio Microphones ToggleMute');
      //   //this doesn't work for some reason
      //   ws.send("done");
      // }
  });

  // xapi.on('error', (err) => {
  //   console.error(`xapi error: ${err}`);
  // });

});

// Start the server on port 8081
server.listen(8081, () => {
    console.log('Websocket server now running on http://localhost:8081');
}); 