/*
	TODO : 	

	update the checkpayment fucntion to check for lightning
	update the checkpayment functuin to update he state as API monitor does. 


*/

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

}
exports.webhook = webhook;
