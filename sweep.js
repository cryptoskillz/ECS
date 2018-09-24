/*

This is a test script to test hat private key works.

Just ignore everything in here for now :)



//debug
let tx = new bitcoin.TransactionBuilder(TestNet)
//console.log(tx);
let privateKey = 'cSV9MGUEUFjCdqtgMHAXdz3aoqWZa5qPWWW3E2vnLUvy4XVe7vXB'
let hotKeyPair = new bitcoin.ECPair.fromWIF(privateKey, TestNet)
let address = bitcoin.payments.p2pkh({ pubkey: hotKeyPair.publicKey,network: TestNet  });
console.log(address.address)
let amountWeHave = 1000000 // 0.01 BTC
let transactionFee = 1000 // .00001 BTC
let amountToSend = amountWeHave  - transactionFee
tx.addInput('68aa024d4d4a56c36dba6274ede7b6e7d5ecbc5e816de8f2225c61f1c69c5c18', 0, 0xfffffffe)



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
const sqlite3 = require('sqlite3').verbose();
//init it
const app = express();


//open a database connection
let db = new sqlite3.Database('./db/db.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});
//set up the network we would like to connect to. in this case test net.
const TestNet = bitcoin.networks.testnet

let sql = `SELECT * FROM keys where processed = 1 and swept = 0 limit 0,1`;
 
	db.all(sql, [], (err, rows) => {
	  if (err) {
	    throw err;
	  }
	 rows.forEach((row) => {
	    
	    var address =  row.address;
	    var privateKey = row.privateKey
	    

	    block_io.get_transactions({'type': 'received', 'addresses': address}, function (error, data)
		{
			//get the tx transaction id
			var txid = data.data.txs[0].txid;
			//get the amount in the transaction
			let amountReceived = data.data.txs[0].amounts_received[0].amount;
			//turn the amount recieved into satoshis 
			amountReceivedSatoshi = amountReceived * 100000000;
			//debug
			//console.log(address);
			//console.log(privateKey)
			//console.dir(data, { depth: null });
			//console.log(txid);
			//console.log(amountReceived);
			//console.log(amountReceivedSatoshi);
			//get the to address from the env var
			var toaddress = "2N3Xtg7pBjUG4RPaiwfc2t3wftvLGWv6i2K"
			//estimate the fee
			block_io.get_network_fee_estimate({'amounts': amountReceived, 'to_addresses': toaddress}, function (error2, data2)
			{
				var networkfee = data2.data.estimated_network_fee;
				//debug
				//console.log(data2.data.estimated_network_fee);
				let tx = new bitcoin.TransactionBuilder(TestNet);
				//note we may not need this as we have stored the address though we could just store the private key and always 
				//		deriver it from the keypair.
				//let hotKeyPair = new bitcoin.ECPair.fromWIF(privateKey, TestNet)
				//let address = bitcoin.payments.p2pkh({ pubkey: hotKeyPair.publicKey,network: TestNet  });
				//work out the amount to send 
				let amountToSend = amountReceivedSatoshi  - networkfee;
				tx.addInput(txid, 0, 0xfffffffe);
				console.log('yup');
			});

		});

	 });
	});


app.listen(3000, () => {
});