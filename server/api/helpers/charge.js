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
var api_key = 'sk_EiDnzvAf3BnjV432esHKXU75YqBmy';

//note why uppercase here?
var charge = function ()
{
	this.test = function test(req,res) 
	{

        res.send(JSON.stringify({ status: "ok" }));
     
	}

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
		  res.send(JSON.stringify({ payment_request: body.payment_request }));
		  //console.log(body.payment_request);
		});
	}


}
exports.charge = charge;
