/*


Just as we did with BTC we started off using a 3rd party API and once we had an understanding of how things work 
we moved onto owing the entire stack.  We are doing the exact same thing with Lightning

We are using the rather excellent https://strike.acinq.co for this purpose.  

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

var request = require("request");

var endpoint = 'https://api.strike.acinq.co';
var api_key = process.env.STRIKE;

//note why uppercase here?
var strike = function ()
{
	this.test = function test(req,res) 
	{

        res.send(JSON.stringify({ status: "ok" }));
     
	}

	//recieve a payment notificaiotn from strike
	this.notificaton = function notificaton(req,res)
	{
		//todo: store the payment in the databsae
		res.send(JSON.stringify({ "status": "ok" }));

	}

	//create a charge
	this.charge = function charge(req,res)
	{
		//console.log(api_key);
		var options = {
		  method: 'POST',
		  url: endpoint + '/api/v1/charges',
		  headers: {
		    'cache-control': 'no-cache',
		    'Content-Type': 'application/json' },
		  body: {
		    amount: 1000,
		    description: 'example charge',
		    currency: 'btc'
		  },
		  json: true,
		  auth: {
		    user: api_key,
		    pass: '',
		  }
		};

		request(options, function (error, response, body) {
		  if (error) throw new Error(error);
		  	//todo : store payment request in the database.
		  	console.log(body)
		  	var obj = {id:body.id,amount:body.amount,payment_request:body.payment_request}
		  	res.send(JSON.stringify({ payment: obj }));
		  //console.log(body.payment_request);
		});
	}


}
exports.strike = strike;
