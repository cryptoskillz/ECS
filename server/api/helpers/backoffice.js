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

//note why uppercase here?
var backOffice = function ()
{
	this.test = function test(req,res) 
	{
    /*
    check if we are using a wallet or not and if it is encrypted.
    https://github.com/bitcoin/bitcoin/issues/12952

    The ‘account’ API is removed after being deprecated in v0.17. The ‘label’ API was 
    introduced in v0.17 as a replacement for accounts. See the release notes from v0.17 for
     a full description of the changes from the ‘account’ API to the ‘label’ API.
    */

    if (process.env.WALLETACCOUNT != '')
    {
      client.walletPassphrase(process.env.WALLETPASSPHRASE, 10).then(() => {
        //create a new address in theaccount account :]
        client.getBlockCount().then(count => {
          res.send(JSON.stringify({ status: "ok","count":count }));
        });
      });
    }
    else
    {
        client.getBlockCount().then(count => {
          res.send(JSON.stringify({ status: "ok","count":count }));
        });
    }

	}


}
exports.backOffice = backOffice;
