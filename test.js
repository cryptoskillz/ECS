/*

This is a test script to test hat private key works.

Just ignore everything in here for now :)


*/
var BlockIo = require('block_io');
var version = 2; // API version

//set up block.io 
//note: We are using env vars to set up block.io you can find more about this here 
//https://medium.com/ibm-watson-data-lab/environment-variables-or-keeping-your-secrets-secret-in-a-node-js-app-99019dfff716

//console.log(process.env.blockiokey)
//console.log(process.env.blockiosecret)

var block_io = new BlockIo(process.env.blockiokey,process.env.blockiosecret, version);


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


block_io.get_transactions({'type': 'received', 'addresses': 'mqJGG1gHREwsUHbcdjVDWniYymJ8er5Rg6'}, function (error, data)
{
	console.dir(data, { depth: null });
});


let tx = new bitcoin.TransactionBuilder(TestNet)
//console.log(tx);
let privateKey = 'cSV9MGUEUFjCdqtgMHAXdz3aoqWZa5qPWWW3E2vnLUvy4XVe7vXB'
let hotKeyPair = new bitcoin.ECPair.fromWIF(privateKey, TestNet)
let address = bitcoin.payments.p2pkh({ pubkey: hotKeyPair.publicKey,network: TestNet  });
console.log(address.address)
let amountWeHave = 130000000 // 1.3 BTC
let transactionFee = 1000 // .00001 BTC
let amountToSend = amountWeHave  - transactionFee
tx.addInput('68aa024d4d4a56c36dba6274ede7b6e7d5ecbc5e816de8f2225c61f1c69c5c18', 0, 0xfffffffe)







app.listen(3000, () => {
});