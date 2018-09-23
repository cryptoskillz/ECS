/*

This is a test script to test hat private key works.


*/

//load express
const express = require('express');
//load body parser
const bodyParser = require('body-parser');
//load the bitcoin js files
var bitcoin = require('bitcoinjs-lib');
//load SQLlite (use any database you want or none)
//init it
const app = express();
//set up the network we would like to connect to. in this case test net.
const TestNet = bitcoin.networks.testnet


let privateKey = 'cSV9MGUEUFjCdqtgMHAXdz3aoqWZa5qPWWW3E2vnLUvy4XVe7vXB'
let keyPair = new bitcoin.ECPair.fromWIF(privateKey, TestNet)
let address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey,network: TestNet  });
console.log(address.address)
//console.log(ourWallet.publicKey);

app.listen(3000, () => {
});