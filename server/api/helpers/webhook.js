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


var webhook = function ()
{
	this.test = function test() 
	{
		console.log('yay')
		
	}

	//this function checks for a payment from strike 
	this.checkStrikePayment = function checkStrikePayment(req,res)
	{
		let sqldata = [req.query.address];
    	let sql = `select * from sessions where address = ?`;

	    //get a cold storage address
	    db.get(sql, sqldata, (err, result) => {
			if (err) {
			return console.error(err.message);
			}
			//debug
			//console.log(result.processed)
			if (result.processed == 0)
				res.send(JSON.stringify({ status: 0 }));
			else
				res.send(JSON.stringify({ status: 1 }));
		 });
	}

	//note we could pass down the whole req here is we use more of it in the future
	this.checkPayment = function checkPayment(token,address,res) 
	{
		//debug
		//console.log(address)

		//decryop the wallet
		client.walletPassphrase(process.env.WALLETPASSPHRASE, 10).then(() => 
		{
			//get the unspent transaxtions for the address we are intrested in.
			client.listUnspent(1, 9999999, [address]).then(result => 
			{
				//console.log(result);
				//note we only check the first one as should only use each address once but we can 
				//easily update this to run through all the results to check for an active paymebt in
				//the array

				//check there is a result
				if (result.length > process.env.CONFIRMATIONS)
				{
					//check the confirmations
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
					res.send(JSON.stringify({ status: 1 }));	
				}
			});
		});
	}
}
exports.webhook = webhook;
