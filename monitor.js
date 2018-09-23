/*

This function monitors the block chain to see if out payments have been processed.

*/


//load express
const express = require('express');
//load body parser
const bodyParser = require('body-parser');
//set up block.io
var BlockIo = require('block_io');
var version = 2; // API version
var block_io = new BlockIo('9ccb-fad0-7811-4dfb', 'TFcce3dNxcfk7E3D', version);
//init it
const app = express();

/*

We are going to use Block.io to check the address and see if the payment has been sent.
This is the same address for when we where coding generate.js so we know it has 0.01 BTC in it. 

Again we are relying on a 3rd party but this time it is less of a concern as all we are doing is using it
to check the blockchain we can verify this against a number of sources and it is a whole lot easier than 
installing our own full node and check that instead.  That said we will be building a full node and doing exactly that 
in a later tutorial.

*/

block_io.get_address_balance({'address': 'mqJGG1gHREwsUHbcdjVDWniYymJ8er5Rg6'}, function (error, data)
{
	//some kind of error, deal with it (literately )
  	if (error) return console.log("Error occurred:", error.message);
  	//do something with the output
  	console.log(data);
});


app.listen(3000, () => {
});