/*

This is a general guide on how to code BTC to accept payments on a website. I am pretty much learning from scratch so
with each branch you will my knowledge grow and the software evolve. I have pretty much gone on sabbatical and moved to Asia 
to really deep dive this tech and  I am not coming back until I have a very deep understanding. 

Treat the branches as a chronological order of  development

master

First code commits using the most basic implementation by integrating into a 3rd party API.

generateaddress

Remove the dependency of the 3rd party API (block.io) and store the details in a database. 



TODO:

Turn it into a REST API
Add the listen script that checks for payments made
Store the keys more securely
Create a WWW which generate bar code etc
Create a back office script that deals with orders etc
Create a sweeping script that sweeps the funds into cold storage
Investigate lighting
Investigate side chains
Investigate RSK

Purpose of this branch

Remove Block.io dependency 
Generate an address 
Store the details in a SQL database, insecure I know we will be upgrading it later

Tools used

http://sqlitebrowser.org/ : Sql browser for mac
https://testnet.blockchain.info/ : blockchain explorer for testnet 
https://www.blockchain.com/explorer :  live blockchain explorer 
https://bitcoin.org/en/download : Bitcoin client used (for testnet)

Resources

https://github.com/bitcoinjs/bitcoinjs-lib
https://medium.com/@cruzw/crafting-a-blockchain-transaction-with-javascript-3946bda1df7b
https://medium.com/@orweinberger/how-to-create-a-raw-transaction-using-bitcoinjs-lib-1347a502a3a
http://www.sqlitetutorial.net/sqlite-nodejs/
https://awebanalysis.com/en/bitcoin-address-validate/ 
https://medium.com/ibm-watson-data-lab/environment-variables-or-keeping-your-secrets-secret-in-a-node-js-app-99019dfff716

Notes
	Why on earth do I have to specify the testnet in every method just let me call it once and be done with it.
	I would assume it is wise to check the origin of the request here to stop potential dossing  I will read up on best practices. 
	I have yet to read the best practices to store these in a safe manner (keys)
	I will also look into striking back to FIAT (for funsies)
	I will look into how to generate a bitcoin address
	I will lastly look at using hardware wallets to control this (most likely ledger)
*/


//load express
const express = require('express');
//load body parser
const bodyParser = require('body-parser');
//load the bitcoin js files
var bitcoin = require('bitcoinjs-lib');
//load SQLlite (use any database you want or none)
const sqlite3 = require('sqlite3').verbose();
//init it
const app = express();
//set up the network we would like to connect to. in this case test net.
const TestNet = bitcoin.networks.testnet

//open a database connection
let db = new sqlite3.Database('./db/db.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

//generate the key pair using the makeRandom functions (there a bunch of ways to make an address btw)
let keyPair = bitcoin.ECPair.makeRandom({ network: TestNet });
//extract the publickey
//note: All the docs say you should use  keyPair.publicKey.toString('hex'); but whenever do that I get the following
//		error "Error: Expected property "pubkey" of type ?isPoint, got String "03a53ff77bf5234a66f69ce23daea51c4f007669e6b41a6f4f57e0bacbcd93e7b1"
//		so I do not use it.  I can only assume it was deperacted along the way as a lot of the docs seems to be.
let publicKey = keyPair.publicKey
//get the private key
let privateKey = keyPair.toWIF();
//debug
//console.log(keyPair);
//console.log(publicKey);
//console.log(privateKey);

//get an address from the keyPair we generated above. 
let address  = bitcoin.payments.p2pkh({ pubkey: publicKey,network: TestNet  });
//debug
//console.log(address);


//store it in the database
//note: Not 100% sure that we have to store the public kkey
db.run(`INSERT INTO keys(address,privatekey,publickey) VALUES(?,?,?)`, [address.address,privateKey,publicKey], function(err) {
if (err) {
  return console.log(err.message);
}
// get the last insert id
//debug
//console.log(this.lastID);
});


//display it to the user
console.log('Pay me f00l '+address.address)


app.listen(3000, () => {
});
