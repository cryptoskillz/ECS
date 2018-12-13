//load bitcoin core
const Client = require("bitcoin-core");
//open a connection to the RPC client
const client = new Client({
  host: "127.0.0.1",
  port: 18332,
  username: "test",
  password: "test"
});

//1 = testnet
//2 = mainnet
const network = "1";

//load SQLlite (use any database you want or none)
const sqlite3 = require("sqlite3").verbose();
//open a database connection
let db = new sqlite3.Database("./db/db.db", err => {
  if (err) {
    console.error(err.message);
  }
});

//note why uppercase here?
var backOffice = function ()
{
	this.test = function test(req,res) 
	{
     client.walletPassphrase(process.env.walletpassphrase, 10).then(() => {
      //create a new address in theaccount account :]
      client.getBlockCount().then(count => {
        res.send(JSON.stringify({ status: "ok","count":count }));
      });
    });

	}


}
exports.backOffice = backOffice;
