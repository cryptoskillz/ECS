
//load express
const express = require('express');
//load body parser
const bodyParser = require('body-parser');
//load block io
var BlockIo = require('block_io');
//set the version of the API to 2
var version = 2; // API version
//init it
const app = express();


//this function just creates a random label so we can generate the address.
function makeLabel() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

//init the block.io server 
var block_io = new BlockIo('9ccb-fad0-7811-4dfb', 'TFcce3dNxcfk7E3D', version);

//get a random label
var label = makeLabel();
console.log('Generating new address')
/*
create a new address using a label.  You do not have to use a label but it just makes it easier to work with later.
Later on we wil store this address in a databse for further processing.
*/
block_io.get_new_address({'label': label}, console.log);
/*
Set a timer to check for a payment.  Using the label we created allows us to check faster but you could move this to 
a backend server function and have it check for balances etc
*/
setInterval(function()
{
	console.log('Checking for payment');
	block_io.get_address_balance({'label': label}, console.log);
},10000);


app.use(bodyParser.urlencoded({ extend: false }));  
app.use(bodyParser.json());

app.listen(3000, () => {
});
