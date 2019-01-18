/*


Just as we did with BTC we started off using a 3rd party API and once we had an understanding of how things work 
we moved onto owing the entire stack.  We are doing the exact same thing with Lightning

We are using the rather excellent https://strike.acinq.co for this purpose.  

TODO 

update email program and standalone demo (neither using sr.js) to work using new session code (or of course retire them)

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



	/*

	create a charge

	todo : check if we already have a charge for this session and if so return that. 

	*/

	this.charge = function charge(req,res)
	{

		//debug
		//console.log(req.query);

		let sqldata = [req.query.sessionid];
    	let sql = `select * from usersessions where sessionid = ?`;

    	//run it and see if it is in the database
    	db.get(sql, sqldata, (err, result) => {
	      	if (err) 
	      	{
	        	//there was an error
	        	res.send(JSON.stringify({ error: err.message }));
	        	return;
	      	}
			//debug
			//console.log(result);

			//check that it is not in the database
			//note : we could do this better by checking the array length. 
			if ((result.lightaddress != null ) && (result.lightaddress != "" ))
			{
				//return the required details to the front end
				var obj = {id:"",amount:"",payment_request:result.lightaddress}
				res.send(JSON.stringify({ payment: obj }));
			}
			else
			{

				//get the details from database
				let data = [req.query.sessionid];
		    	//console.log(data)
		   		let sql = `SELECT * FROM order_product where sessionid = ?`;
		    	//debug

		    	db.get(sql, data, (err, result) => {
		    		if (err) {
		        		console.log(err)
		      		}
		      		//debug
		      		//console.log(result);

		      		if (result != undefined)
		      		{
		      			var price = parseFloat(result.price) * result.quantity;

		      			price = parseFloat(price) * 100000000;

		      			//build the options object
						var options = {
						  method: 'POST',
						  url: process.env.STRIKEENDPOINT + '/api/v1/charges',
						  headers: {
						    'cache-control': 'no-cache',
						    'Content-Type': 'application/json' },
						  body: {
						    amount: price,
						    description: result.name,
						    currency: "btc"
						  },
						  json: true,
						  auth: {
						    user: process.env.STRIKEAPIKEY,
						    pass: '',
						  }
						};
						//debug
						//console.log(options);


						//call it 
						request(options, function (error, response, body) {
						 	if (error) throw new Error(error);
						  	//debug
						  	//console.log(body)

						  	//turn it into a BTC amount
						  	//note : in a future update we may go ahead and store everything Satoshis. 
						  	//		 we could also use req.query.amount here
						  	//		 we may want to store order_meta and product_meta here in the future if so we will make those generic functions
							var amount = parseFloat(body.amount) * 0.00000001;

							//update it
							let data = [body.payment_request, req.query.sessionid];
							console.log(data);
					        //build the query
					        let sql = `UPDATE usersessions
									          SET lightaddress=?
									          WHERE sessionid = ?`;
					        //run the query
					        db.run(sql, data, function(err) {
					        	if (err) {
					            	return console.error(err.message);
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
						     });
						});
				    }
				    else
				    {
				    	console.log('not found');
				    }
		    	});

			}
		});
	}


}
exports.strike = strike;
