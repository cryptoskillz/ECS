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

	//note we could pass down the whole req here is we use more of it in the future
	this.checkPayment = function checkPayment(token,address,res) 
	{
		//debug
		console.log(address)

		//decryop the wallet
		client.walletPassphrase(process.env.WALLETPASSPHRASE, 10).then(() => 
		{
			//get the unspent transaxtions for the address we are intrested in.
			client.listUnspent(1, 9999999, [address]).then(result => 
			{
				//note we only check the first one as should only use each address once but we can 
				//easily update this to run through all the results to check for an active paymebt in
				//the array

				//note confirmations should be a var at this point
				if (result[0].confirmations >= 1) 
				{
					//valid
					res.send(JSON.stringify({ status: 1 }));
				}
				else
				{
					//not valid
					res.send(JSON.stringify({ status: 0 }));
				}
			});
		});
	}
}
exports.webhook = webhook;
