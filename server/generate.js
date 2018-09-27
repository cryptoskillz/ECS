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
