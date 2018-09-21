
//load express
const express = require('express');
//load body parser
const bodyParser = require('body-parser');
//load the bitcoin js files
var bitcoin = require('bitcoinjs-lib');
//set the version of the API to 2
var version = 2; // API version
//init it
const app = express();
//set up the network we would like to connect to. in this case test net.
const TestNet = bitcoin.networks.testnet


/*
*  We are now removing the block Io dependencay in generating an address our self
*
*/


/*
*
* Make a random address.
* Note: there appear to be numerous ways to do this.  This seems the most basic at a later date I will look into segwit, 
* fromwif and all the oher fun methods and see what they all do, for now this is good enough. 
*
*/

//generate the key pair
/*
*	Note: I would assue it is wise to check the origin of the request here to stop potential dossing 
*         I will read up on best practices. 
*
*
*/
let keyPair = bitcoin.ECPair.makeRandom({ network: TestNet })
//debug
//console.log(keyPair);
//get an address from the keyPair we generated above. 
const {address}  = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }) 
//debug
//console.log(address);
console.log('Pay me f00l'+address)
/*
* Display the address
* note: We now have the address so want to store the private and public keys etc so we can claim the funds been sent to the wallet. 
*       I have yet to read the best practices to store these in a safe manner.  
*       I will also look into striking back to FIAT (for funsies)
*       I will look into how to generate a bitcoin address
*       I will lastly look at using hardware wallets to control this (most likely ledger)
*/


/*
note we will look to replace this from block.io to doing it ourself later.  That is why it is ghosted out now.
Set a timer to check for a payment.  Using the label we created allows us to check faster but you could move this to 
a backend server function and have it check for balances etc

setInterval(function()
{
	console.log('Checking for payment');
	block_io.get_address_balance({'label': label}, console.log);
},10000);
*/

app.use(bodyParser.urlencoded({ extend: false }));  
app.use(bodyParser.json());

app.listen(3000, () => {
});
