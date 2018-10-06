
//load express
const express = require('express');

var W3CWebSocket = require('websocket').w3cwebsocket;
 
//var client = new W3CWebSocket('wss://104.248.68.99:8334/ws', 'echo-protocol');
var client = new W3CWebSocket('wss://chris:chris@104.248.68.99:8334/ws', {
  //headers: {
   // 'Authorization': 'Basic '+new Buffer('chris:chris').toString('base64')
  //}
  //,
  //cert: cert,
  ///ca: [cert]
});
 const app = express();

client.onerror = function(e) {
	console.log(e)
    console.log('Connection Error');
};
 
client.onopen = function() {
    console.log('WebSocket Client Connected');
 
    
};
 
client.onclose = function() {
    console.log('echo-protocol Client Closed');
};
 
client.onmessage = function(e) {
    if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'");
    }
};

var port = process.env.PORT || 3000;
//app.listen( port );


  



