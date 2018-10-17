//load express
const express = require('express');
//load body parser
const bodyParser = require('body-parser');
//load the bitcoin js files
//var bitcoin = require('bitcoinjs-lib');
//load bitcoin core
const Client = require("bitcoin-core");
//open a connection to the RPC client
const client = new Client({
  host: "127.0.0.1",
  port: 18332,
  username: "test",
  password: "test"
});
//load SQLlite (use any database you want or none)
const sqlite3 = require('sqlite3').verbose();
//init it
const app = express();

//1 = testnet
//2 = mainnet
const network = "1";
//var BlockIo = require('block_io');
//var version = 2; // API version
//var block_io = new BlockIo(process.env.blockiokey,process.env.blockiosecret, version);

//open a database connection
let db = new sqlite3.Database('./db/db.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});


/*
========================
START OF GENERIC FUNCTION
========================
*/

function setHeaders(res)
{
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    return(res);
}



/*
========================
END OF GENERIC FUNCTION
========================
*/



/*
========================
START OF ADMIN FUNCTION
========================
*/


//update the settings
app.get('/admin/updatesettings', (req, res) => {
	//set the headers
	res = setHeaders(res);

	//check if it is a zero and if so return error

	let sql = `select user.id 
    		   from user
	           WHERE user.sessiontoken = '`+req.query.token+`'`;
	//run the sql
	db.all(sql, [], (err, rows) => {
	  if (err) {
	    throw err;
	  }
	  ///console.log(rows);
	  //check we have a result
	  if (rows.length == 0)
	  {
	  	res.send(JSON.stringify({results: "error"}));	
	  }
	  else
	  {
	  	let data = [req.query.address,rows[0].id];
		let sql = `UPDATE usersettings
		            SET coldstorageaddress = ?
		            WHERE userid = ? `;
		 
		db.run(sql, data, function(err) {
		  if (err) {
		  res.send(JSON.stringify({results: "error"}));	
		  }
		  //oupt guid to api request
		  res.send(JSON.stringify({results: "ok"}));	
		});
	  }
	 }); 
});

//orders
app.get('/admin/order', (req, res) => {
	//set the headers
	res = setHeaders(res);
	    let sql = `select *
    		   from product
	           WHERE product.address = '`+req.query.address+`'`;

	var jsonStr = '{"results":[]}';
	var obj = JSON.parse(jsonStr);
	//jsonStr = JSON.stringify(obj)
	db.all(sql, [], (err, rows) => {
	  if (err) {
	    throw err;
	  }
	 rows.forEach((row) => {
	 	//console.log(row);
	 	//myObj.push(row);
	 	//obj.push('dsss');
	 	obj['results'].push(row);


	 });
	 jsonStr = JSON.stringify(obj);
	 //console.log('done');
	 //console.log(jsonStr);
	 res.send(jsonStr);

	});
});


//return the admin settings
app.get('/admin/settings', (req, res) => {
	//set the headers
	res = setHeaders(res);    
	let sql = `select usersettings.coldstorageaddress 
    		   from user
    		   INNER JOIN usersettings ON user.id = usersettings.userid
	           WHERE user.sessiontoken = '`+req.query.token+`'`;
	//run the sql
	var jsonStr = '{"results":[]}';
	var obj = JSON.parse(jsonStr);
	db.all(sql, [], (err, rows) => {
	  if (err) {
	    throw err;
	  }
	  ///console.log(rows);
	  //check we have a result
	  if (rows.length == 0)
	  {
	  	res.send(JSON.stringify({results: "0"}));	
	  }
	  else
	  {
		obj['results'].push(rows[0]);
		jsonStr = JSON.stringify(obj);
		//console.log('done');
		//console.log(jsonStr);
		res.send(jsonStr);

	  }
	 }); 
});

//return a list of payments
app.get('/admin/payments', (req, res) => {
	//set the headers
	res = setHeaders(res);
    let sql = `select keys.id,keys.address,keys.processed,keys.swept,keys.net,keys.amount
    		   from user
    		   INNER JOIN keys ON user.id = keys.userid
	           WHERE user.sessiontoken = '`+req.query.token+`'`;

	var jsonStr = '{"results":[]}';
	var obj = JSON.parse(jsonStr);
	//jsonStr = JSON.stringify(obj)
	db.all(sql, [], (err, rows) => {
	  if (err) {
	    throw err;
	  }
	 rows.forEach((row) => {
	 	//console.log(row);
	 	//myObj.push(row);
	 	//obj.push('dsss');
	 	obj['results'].push(row);


	 });
	 jsonStr = JSON.stringify(obj);
	 //console.log('done');
	 //console.log(jsonStr);
	 res.send(jsonStr);

	});
});

//login the user in
app.get('/admin/login', (req, res) => {
	//set the headers
	res = setHeaders(res);
	

	//get username and password passed up
    let data = [req.query.uname, req.query.pass];
    //build sql
	let sql = `select * from user
	            WHERE username = '`+req.query.uname+`' and password = '`+req.query.pass+`'`;

	//run the sql
	db.all(sql, [], (err, rows) => {
	  if (err) {
	    throw err;
	  }
	  //check we have a result
	  if (rows.length != 0)
	  {
	  	//make a guid
	  	var u='';
	  	var i=0;
		  while(i++<36) {
		    var c='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'[i-1],r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);
		    u+=(c=='-'||c=='4')?c:v.toString(16)
		  }
  		sessiontoken = u;
  		//update the table with the guid
	  	let data = [sessiontoken,rows[0].id];
		let sql = `UPDATE user
		            SET sessiontoken = ?
		            WHERE id = ? `;
		 
		db.run(sql, data, function(err) {
		  if (err) {
		    return console.error(err.message);
		  }
		  //oupt guid to api request
		 res.send(JSON.stringify({token: sessiontoken}));
		});
	  	
	  }
	  else
	  {
	  	res.send(JSON.stringify({token: "0"}));	
	  }
	 });	
});

/*
========================
END OF ADMIN FUNCTION
========================*/

			//var url = serverurl+"api/storeuserdetails?email="+email+"&address="+address;

//store user details
app.get('/api/storeuserdetails', (req, res) => {
	//set the headers
	res = setHeaders(res); 
	let data = [req.query.email,req.query.address];
	let sql = `UPDATE product
	            SET email = ?
	           	WHERE address = ?`;
	 
	db.run(sql, data, function(err) {
	  if (err) {
	    return console.error(err.message);
	  }
	  //console.log(`Row(s) updated: ${this.changes}`);
	 res.send(JSON.stringify({status: "ok"}));
	});
});

//storeproduct
app.get('/api/storeproduct', (req, res) => {
	//set the headers
	res = setHeaders(res); 
	//check if it is in the product table
	if (req.query.quantity == 0)
	{
		//delete the record
		let data = [req.query.address];
		let sql = `delete FROM product WHERE address = ?`;
		db.run(sql, data, function(err) 
		{
		  if (err) {
		    return console.error(err.message);
		  }		 
		});
			 
	}
	else
	{
		//see if we have it already 
		let sql = `SELECT * FROM product where address = "`+req.query.address+`"`;
		//debug
		//console.log(sql);

	    db.all(sql, [], (err, rows) => {
		  if (err) {
		    throw err;
		  }
		  //check we have a result
		  if (rows.length == 0)
		  {
		  	//insert it
		  	//delete the record
			db.run(`INSERT INTO product(address,name,price,quantity) VALUES(?,?,?,?)`, [req.query.address,req.query.name,req.query.price,req.query.quantity], function(err) {
				if (err) {
				  return console.log(err.message);
				}
			});
		  }
		  else
		  {
		  	//update it
		  	let data = [req.query.quantity,req.query.address];
			let sql = `UPDATE product SET quantity = ? WHERE address = ?`;
			db.run(sql, data, function(err) {
			  if (err) {
			    return console.error(err.message);
			  }
			  
			});

		  }
		});
	}
	//debug
	//console.log(req.query.name);
	//console.log(req.query.price);
	//console.log(req.query.quantity);
	//console.log(req.query.address);
	res.send(JSON.stringify({status: "ok"}));
})
/*
	This endpoint is used to check if a payment has been made by www
	it is not essetial but someone may want to add this to a control pabel or the final ste of the checkout.

*/

//pass it an address and it will check if payment has been made.  See this just like monitor js does but it is not on a timer.
app.get('/api/monitor', (req, res) => {
	//set the headers
	res = setHeaders(res); 
	//the amont for the address
	client.getReceivedByAddress(req.query.address).then(result => {
	   //check it is more tha 0
	   if (result > 0)
	   {
	   		//build the query
			let data = ['1',result, req.query.address];
			let sql = `UPDATE keys
			            SET processed = ?,
			            	amount = ?
			            WHERE address = ?`;
			//run the query
			db.run(sql, data, function(err) {
			  if (err) {
			    return console.error(err.message);
			  }
			  //retun response
			 res.send(JSON.stringify({status: "confirmed"}));
			});
	   }
	   else
	   {	
	   		//return error
	   		res.send(JSON.stringify({status: "not confirmed"}));
	   }
	});
	
})


//move a payment to cold storage
app.get('/api/sweep', (req, res) => {
	//set the headers
	res = setHeaders(res);
	client.walletPassphrase(process.env.walletpassphrase, 10).then(() => {
		let sql = `SELECT * FROM keys where address = "`+req.query.address+`" and swept = 0 and processed = 1`;
		db.each(sql, function(err, row) {
			//debug
	    	//console.log(row.address);  

	    	//unlock the wallet
	    	client.walletPassphrase(process.env.walletpassphrase, 10).then(() => {
	    		//get the unspent transaxtions for the address we are intrested in.
	    		client.listUnspent(1,9999999,[req.query.address]).then(result => {
	    			//debug
	    			//console.log(result.length)

	    			//check if there are any
	    			if(result.length == 0 ) 
	    			{
	    				//debug
    					//console.log(result);

    					//exit gracefully
    					res.send(JSON.stringify({result:"nothing to sweep"}));
						return;
					}
					else
	    			{
	    				//debug
	    				//console.log(result[0].confirmations)

	    				//check the confirmation count
	    				//note (chris) it is set to 1 for now as I want to play with it as soon as possible.  It should 3 - 6 when we are happy
	    				if (result[0].confirmations > 1)
	    				{
	    					//estimate fee
	    					client.estimateSmartFee(6).then((fee) => {
	    						//debug
	    						//console.log(fee.feerate)    						

	    						//work out the amount to send
								var amounttosend = result[0].amount - fee.feerate;
								//create raw transaction
								/*
	    						we are in a catch 22 here 
								Unhandled rejection RpcError: signrawtransaction is deprecated and will be fully removed in v0.18. To use signrawtransaction in v0.17,
								restart bitcoind with -deprecatedrpc=signrawtransaction.
								Projects should transition to using signrawtransactionwithkey and signrawtransactionwithwallet before upgrading to v0.18
								but v0.17 does not support signrawtransactionwithkey so we wil update when v0.18 comes out
								*/
	    						client.createRawTransaction([{"txid":result[0].txid,"vout":0}],[{[process.env.toaddress]:amounttosend}]).then((txhash) => {
	    							//debug
	    							//console.log(txhash)

	    							//sign it
	    							client.signRawTransaction(txhash).then((res) => {
	    								//debug
	    								console.log(res);

		    							//broadcast it

		    							//update database
		    							/*
		    							let sqldata = ['1', address];
										let sql = `UPDATE keys
												   	SET swept = ?
												    WHERE address = ?`;
												 
										db.run(sql, sqldata, function(err) {
										  if (err) {
										   // return console.error(err.message);
										  }

											res.send(JSON.stringify({status: "already swept"}));
											return;
										 
										});
										*/
	    							});
	    						});
		    					//lock the wallet
		    					client.walletLock();
		    					//output result
		    					//res.send(JSON.stringify({result:"sweept"}));
								return;
	    					});	
	    				}
	    			}
	    		});
	    	});
		});
	});
})


//generate an address and output it
app.get('/api/address', (req, res) => {
	//set the headers
	res = setHeaders(res);
	//unlock the wallet
	client.walletPassphrase(process.env.walletpassphrase, 10).then(() => {
	  //create a new address in theaccount account :]
	  client.getNewAddress(process.env.walletaccount).then(address => {
	    //debug
	    //console.log(address);

	    //insert it into the database
	    db.run(`INSERT INTO keys(address,userid,net) VALUES(?,?,?)`, [address,req.query.uid,network], function(err) {
			if (err) {
			  //debug
			  //return console.log(err.message);

			  //return error
			  res.send(JSON.stringify({error: err.message}));
			  return;
			}
			//return the address
			res.send(JSON.stringify({address:address}));
		});
	    client.walletLock();
	    return;
	  });
	});
})
console.log('up and at em ')

var port = process.env.PORT || 3000;
app.listen( port );

