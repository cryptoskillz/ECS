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

var BlockIo = require('block_io');
var version = 2; // API version
var block_io = new BlockIo(process.env.blockiokey,process.env.blockiosecret, version);

//open a database connection
let db = new sqlite3.Database('./db/db.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});


/*
	This endpoint is used to check if a payment has been made by www
	it is not essetial but someone may want to add this to a control pabel or the final ste of the checkout.


*/
app.get('/api/monitor', (req, res) => {

	var address = "n36v3wZBnxntAjLT3P1T9XWpX3SmocPpB1"
	 block_io.get_address_balance({'address': address}, function (error, data)
	{
		//debug
		//console.log(data.data);
		//some kind of error, deal with it (literately )
	  	if (error) return console.log("Error occurred:", error.message);
	  	//store the balance
	  	//note: The way we are using this we are only every using this address once so it should never have a higher balance than
	  	//		what we are looking for.  Though it is not impossible a user sent to much or someone sent some Bitcoin to you by 
	  	//		mistake.  If this is the case then you may want to put in some checks for this. I am not going to. 
	  	var balance = data.data.available_balance;
	  	//store the pending balance
	  	var pendingbalance = data.data.pending_received_balance;
	  	//debug
	  	//console.log(balance);
	  	//console.log(pendingbalance);
	  	if (balance > 0)
	  	{
	  		console.log('we got it');
	  		//update the database that the payment is successful
	  		let data = ['1', address];
			let sql = `UPDATE keys
			            SET processed = ?
			            WHERE address = ?`;
			 
			db.run(sql, data, function(err) {
			  if (err) {
			    return console.error(err.message);
			  }
			  //console.log(`Row(s) updated: ${this.changes}`);
			 res.send(JSON.stringify({status: "confirmed"}));
			});
	  	}
	  	else
	  	{
	  		//console.log('payment not received for '+address);
	  		//In case you want to start ordering process or something on a pending balance this is where you would put that code
	  		//for simplicity I am waiting until the balance has actually been confirmed.
	  		if (pendingbalance > 0)
	  		{
	  			//console.log('awaiting confirmation for '+address)
	  			res.send(JSON.stringify({status: "pending"}));
	  		}
	  		else
	  		{
	  			res.send(JSON.stringify({status: "not confirmed"}));
	  		}
	  	}
	});
	
})



//display address to the user
app.get('/api/address', (req, res) => {
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


	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    res.send(JSON.stringify({address: address.address}));
    return;
})
//console.log('Pay me f00l '+address.address)


app.listen(3000, () => {
});
