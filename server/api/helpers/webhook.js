const config = require('./config');
//console.log(config.bitcoin.network)
//load SQLlite (use any database you want or none)
const sqlite3 = require("sqlite3").verbose();
//open a database connection
let db = new sqlite3.Database("./db/db.db", err => {
  if (err) {
    console.error(err.message);
  }
});

//todo move this to a config file as it is used in a few places now
//1 = testnet
//2 = mainnet
const network = process.env.NETWORK;
//console.log(network)

//load the generic functions
//note we could ass this down i am not sure which is th emost efficient way to do this to be honest.  I shall look into that. 
var generichelper = require('./generic.js').Generic;
var generic = new generichelper();


var webhook = function ()
{
	this.test = function test() 
	{
		console.log('yay')
		
	}

	//recieve a payment notificaiotn from strike
	this.strikeNotification = function strikeNotification(req,res)
	{
		//todo: store the payment object     
		if (req.query.address != '')
		{
		let data = [1,1, req.query.address];
		  let sql = `UPDATE sessions SET processed = ?,swept=? WHERE address = ?`;
		  db.run(sql, data, function(err) {
		    if (err) {
		      return console.error(err.message);
		    }
		    res.send(JSON.stringify({ "status": "ok" }));
		  });
		 }
	}

	/*

	this function checks for a payment from strike 

	todo : we should check that this is valid request at some point or auth it somehow
		   send emails to user if email is set
	*/
	this.checkStrikePayment = function checkStrikePayment(req,res)
	{
		//debug
		//console.log(req.body.data.payment_request)
		//return;
		let data = [1,1, req.body.data.payment_request];
		let sql = `UPDATE sessions SET processed = ?,swept=? WHERE address = ?`;
		db.run(sql, data, function(err) {
			//console.log(result)
			if (err) {
				res.send(JSON.stringify({ status: 0 }));
			}
			//store payment object
			let data = [JSON.stringify(req.body.data),req.body.data.payment_request];
			let sql = `UPDATE order_payment_details SET paymentresponseobject = ? WHERE address = ?`;
			db.run(sql, data, function(err) 
			{
				if (err) {
					res.send(JSON.stringify({ status: 0 }));
				}
				//send emails to admin
				generic.sendMail(2,'cryptoskillz@protonmail.com');

				res.send(JSON.stringify({ status: 1 }));
			});
		});

	}	
	

	/*
	=============================================================================================================================

	This function checks for and unspent transcations in the wallet.  As we are in essence using this as a 
	hot wallet and creating a new address for each transaction (which we only use once) we can safely make 
	the assumpation that anything here is for the transaction.

	In the future we could detect over/under payments and deal with them gracefully but right now we want the flow to 
	be pretty simple.

	TODO : When the timer function is live just change this to a simple checl

	=============================================================================================================================

	*/
	this.checkPayment = function checkPayment(token,address,res) 
	{
		//get the unspent transactions for the address we are intrested in.
		client.listUnspent(1, 9999999, [address]).then(result => 
		{
			//debug
			console.log(result);
			console.log(result.length)
			//note we only check the first one as should only use each address once but we can 
			//easily update this to run through all the results to check for an active paymebt in
			//the array

			//check there is a result
			if (result.length > 0)
			{
				//check the confirmations (set int the env var)
				//note we have set this to one for testing etc but you should up this if you it is going to be used 
				//in any live enviorment.
				if (result[0].confirmations >= process.env.CONFIRMATIONS) 
				{
					//valid
					res.send(JSON.stringify({ status: 1 }));
				}
				else
				{
					//not valid
					res.send(JSON.stringify({ status: 0 }));
				}
			}
			else
			{
				res.send(JSON.stringify({ status: 0 }));	
			}
		});
	}
}
exports.webhook = webhook;
