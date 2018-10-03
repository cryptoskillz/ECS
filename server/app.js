//load express
const express = require('express');
//load body parser
const bodyParser = require('body-parser');
//load the bitcoin js files
var bitcoin = require('bitcoinjs-lib');
//load SQLlite (use any database you want or none)
const sqlite3 = require('sqlite3').verbose();
//init it
const app = express();
//set up the network we would like to connect to. in this case test net.
const TestNet = bitcoin.networks.testnet
var BlockIo = require('block_io');
var version = 2; // API version
var block_io = new BlockIo(process.env.blockiokey,process.env.blockiosecret, version);

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

/*
	This endpoint is used to check if a payment has been made by www
	it is not essetial but someone may want to add this to a control pabel or the final ste of the checkout.

*/

//pass it an address and it will check if payment has been made.  See this just like monitor js does but it is not on a timer.
app.get('/api/monitor', (req, res) => {
	//set the headers
	res = setHeaders(res);   
	//var address = "n36v3wZBnxntAjLT3P1T9XWpX3SmocPpB1"
	//todo check the token is valid to check
	//console.log(req.query)
	 block_io.get_address_balance({'address': req.query.address}, function (error, data)
	{
		//debug
		//console.log(data.data);
		//some kind of error, deal with it (literately )
	  	if (error) return console.log("Error occurred:", error.message);
	  	//store the balance
	  	//note: The way we are using this we are only every using this address once so it should never have a higher balance than
	  	//		what we are looking for.  Though it is not impossible a user sent to much or someone sent some Bitcoin to you by 
	  	//		mistake.  If this is the case then you may want to put in some checks for this. I am not going to. 
	  	var balance = data.data.available_balance;
	  	//store the pending balance
	  	var pendingbalance = data.data.pending_received_balance;
	  	//debug
	  	//console.log(balance);
	  	//console.log(pendingbalance);
	  	if (balance > 0)
	  	{
	  		//console.log('we got it');
	  		//update the database that the payment is successful
	  		let data = ['1',balance, req.query.address];
			let sql = `UPDATE keys
			            SET processed = ?,
			            	amount = ?
			            WHERE address = ?`;
			 
			db.run(sql, data, function(err) {
			  if (err) {
			    return console.error(err.message);
			  }
			  //console.log(`Row(s) updated: ${this.changes}`);
			 res.send(JSON.stringify({status: "confirmed"}));
			});
	  	}
	  	else
	  	{
	  		//console.log('payment not received for '+address);
	  		//In case you want to start ordering process or something on a pending balance this is where you would put that code
	  		//for simplicity I am waiting until the balance has actually been confirmed.
	  		if (pendingbalance > 0)
	  		{
	  			//console.log('awaiting confirmation for '+address)
	  			res.send(JSON.stringify({status: "pending"}));
	  		}
	  		else
	  		{
	  			res.send(JSON.stringify({status: "not confirmed"}));
	  		}
	  	}
	});
	
})

//move a payment to cold storage
app.get('/api/sweep', (req, res) => {
	//set the headers
	res = setHeaders(res);
    //TODO check token to see if the user is allowed to do this
    let sql = `SELECT * FROM keys where address = "`+req.query.address+`" and swept = 0`;
    db.all(sql, [], (err, rows) => {
	  if (err) {
	    throw err;
	  }
	  //check we have a result
	  if (rows.length != 0)
	  {
	  	//get the address
	  	//console.log(rows[0])
	    var address =  rows[0].address;
	    //get the private key
	    var privateKey = rows[0].privatekey;
	    //debug
	    //console.log(row);
	    //console.log(address);
	   	//console.log(privateKey);
	    //get the transactions
	    //note: We should only have one transaction in this address so we can make some assumpation. We would however harden this 
		//		function before it was used in any production enviorment.
	    
	    block_io.get_transactions({'type': 'received', 'addresses': address}, function (error, data)
		{
			//todo : check for no transactions
			//console.dir(data, { depth: null });
			//check it is not already confirmed
			if (data.data.txs[0].confirmations > 3)
			{
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
			}
			else
			{
				//get the tx transaction id
				var txid = data.data.txs[0].txid;
				//get the amount in the transaction
				let amountReceived = data.data.txs[0].amounts_received[0].amount;
				//debug
				//console.log(amountReceived);
				//console.log(txid);
						//estimate the fee
				//note : We are using block.io to estimate the fee but we will of course do this ourselves later.
				block_io.get_network_fee_estimate({'amounts': amountReceived, 'to_addresses': process.env.toaddress}, function (error2, data2)
				{
					//console.log(data2);
								//store the network fee.
					var networkfee = data2.data.estimated_network_fee;
					//debug
					//console.log(networkfee);
					//console.log(data2.data.estimated_network_fee);
								//init a new transaction

					let tx = new bitcoin.TransactionBuilder(TestNet);
					//get the WIF from the private key so we can sign the transaction later.
					let hotKeyPair = new bitcoin.ECPair.fromWIF(privateKey, TestNet)
					//debug
					//console.log(privateKey);
					//console.log(hotKeyPair);
					//work out the amount to send 
					//let amountToSend =  amountReceivedSatoshi - networkfee   ;
					let amountToSend =  amountReceived - networkfee   ;
					//turn the amount recieved into satoshis 
					//note : Satoshi information can be found here https://en.bitcoin.it/wiki/Satoshi_(unit)
					amountToSendSatoshi = amountToSend * 100000000;
					//debug
					//console.log(amountReceivedSatoshi);
					//console.log(networkfee);
					//console.log(amountToSend);
					//add the input the transaction we are building
					//note txid = we got fron the get transaction type
					//	   0 = is the first transaction to be safe we could parse data object and return the correct one 
					//	   0xfffffffe = no idea will have to read up on this
					tx.addInput(txid, 0, 0xfffffffe);
					//note : this seems to do the fee on of its own accord.
					tx.addOutput(process.env.toaddress, amountToSendSatoshi);
					//sign the transaction with our private key
					tx.sign(0, hotKeyPair);
					//output it
					//note we have to figure out how to push this to the network and not use https://testnet.blockchain.info/pushtx
					//console.log(tx.build().toHex());

					// Set the headers
					var headers = {
					    'User-Agent':       'Super Agent/0.0.1',
					    'Content-Type':     'application/x-www-form-urlencoded'
					}

					// Configure the request
					var options = {
					    url: 'https://testnet.blockchain.info/pushtx',
					    method: 'POST',
					    headers: headers,
					    form: {'tx': tx.build().toHex()}
					}

					// Start the request
					request(options, function (error, response, body) {
						 //console.log(body)
						 console.log(error)
						 //console.log( response.statusCode)

					     //console.log(response)
					    if (!error && response.statusCode == 200) {
					        // Print out the response body
					        //console.log(body)
					        let sqldata = ['1', address];
							let sql = `UPDATE keys
							            SET swept = ?
							            WHERE address = ?`;
							 
							db.run(sql, sqldata, function(err) {
							  if (err) {
							    return console.error(err.message);
							  }

							 res.send(JSON.stringify({status: "swept"}));
							 
							});
					    }
					})
				});
			}
		});
	  }
	  else
	  {
	  	res.send(JSON.stringify({status: "not swept"}));
	  }
	})
})


//generate an address and output it
app.get('/api/address', (req, res) => {
	//set the headers
	res = setHeaders(res);
	//generate the key pair using the makeRandom functions (there a bunch of ways to make an address btw)
	let keyPair = bitcoin.ECPair.makeRandom({ network: TestNet });
	//extract the publickey
	//note: All the docs say you should use  keyPair.publicKey.toString('hex'); but whenever do that I get the following
	//		error "Error: Expected property "pubkey" of type ?isPoint, got String "03a53ff77bf5234a66f69ce23daea51c4f007669e6b41a6f4f57e0bacbcd93e7b1"
	//		so I do not use it.  I can only assume it was deperacted along the way as a lot of the docs seems to be.
	let publicKey = keyPair.publicKey
	//get the private key
	let privateKey = keyPair.toWIF();
	//debug
	//console.log(keyPair);
	//console.log(publicKey);
	//console.log(privateKey);

	//get an address from the keyPair we generated above. 
	let address  = bitcoin.payments.p2pkh({ pubkey: publicKey,network: TestNet  });
	//debug
	//console.log(address);

	//store it in the database
	//note: Not 100% sure that we have to store the public kkey
	db.run(`INSERT INTO keys(address,privatekey,publickey) VALUES(?,?,?)`, [address.address,privateKey,publicKey], function(err) {
	if (err) {
	  return console.log(err.message);
	}
	// get the last insert id
	//debug
	//console.log(this.lastID);
	});
    res.send(JSON.stringify({address: address.address}));
    return;
})
//console.log('Pay me f00l '+address.address)

var port = process.env.PORT || 3000;
	app.listen( port );

