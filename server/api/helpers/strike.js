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

//note why uppercase here?
var strike = function ()
{
	this.test = function test(req,res) 
	{

        res.send(JSON.stringify({ status: "ok" }));
     
	}



	//create a charge
	this.charge = function charge(req,res)
	{
		//build the options object
		var options = {
		  method: 'POST',
		  url: process.env.STRIKEENDPOINT + '/api/v1/charges',
		  headers: {
		    'cache-control': 'no-cache',
		    'Content-Type': 'application/json' },
		  body: {
		    amount: parseFloat(req.query.amount),
		    description: req.query.desc,
		    currency: req.query.currency
		  },
		  json: true,
		  auth: {
		    user: process.env.STRIKE,
		    pass: '',
		  }
		};

		//call strike
		request(options, function (error, response, body) {
		  if (error) throw new Error(error);
		  	//debug
		  	//console.log(body)

		  	//turn it into a BTC amount
		  	//note : in a future update we may go ahead and store everything Satoshis. 
		  	//		 we could also use req.query.amount here
		  	//		 we may want to store order_meta and product_meta here in the future if so we will make those generic functions
			var amount = parseFloat(body.amount) * 0.00000001;
			
			//insert a session
			db.run(
				`INSERT INTO sessions(address,userid,net,amount,paymenttype) VALUES(?,?,?,?,?)`,
				[body.payment_request, req.query.uid, process.env.LIGHTNETWORK,String(amount),2],
				function(err) 
				{
					if (err) 
					{
					  //return error
					  res.send(JSON.stringify({ error: err.message }));
					  return;
					}

					//store the order product details 
					db.run(
						`INSERT INTO order_product(address,name,price,quantity) VALUES(?,?,?,?)`,
						[body.payment_request,req.query.desc, String(amount),1],
						function(err) 
						{
							if (err) 
							{
							  //return error
							  res.send(JSON.stringify({ error: err.message }));
							  return;
							}
							//store the order_payment_details 
							db.run(
								`INSERT INTO order_payment_details(address,providerid,paymentobject) VALUES(?,?,?)`,
								[body.payment_request,2, JSON.stringify(body)],
								function(err) 
								{
									if (err) 
									{
									  //return error
									  res.send(JSON.stringify({ error: err.message }));
									  return;
									}
									//return the required details to the front end
									var obj = {id:body.id,amount:body.amount,payment_request:body.payment_request}
									res.send(JSON.stringify({ payment: obj }));
									//debug
									//console.log(body.payment_request);
								}
							);
						}
					);
				}
			);
		  	
		});
	}


}
exports.strike = strike;
