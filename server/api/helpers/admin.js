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


var admin = function ()
{
	this.test = function test() 
	{
		console.log('yay')
	}

	this.getUsers = function getUsers(res)
	{
		let jsonStr = '{"results":[]}';
		let obj = JSON.parse(jsonStr);
		//build sql
		let sql = `select 
		ecs_user.id,
		ecs_user.username,
		ecs_coldstorageaddresses.userid,
		ecs_coldstorageaddresses.autosendfunds,
		ecs_coldstorageaddresses.address
		from ecs_user 
		LEFT JOIN ecs_coldstorageaddresses
		ON ecs_user.id = ecs_coldstorageaddresses.userid`;
		db.all(sql, [], function(err,rows) {
		    if (err) {
		    }
		    //debug
		    //console.log(rows);

		     rows.forEach(row => {

		    	//debug
		      	//console.log(row);
		      	//myObj.push(row);
		      	//obj.push('dsss');

		      	//add to results object
		      	obj["results"].push(row);

		    });



		    jsonStr = JSON.stringify(obj);
		    //debug
		    //console.log('done');
		    //console.log(jsonStr);

		    //return the orders
		    res.send(jsonStr);

		});
	}

	this.login = function login(uname,pass,res)
	{
		//get username and password passed up
		let data = [uname,pass];
		//build sql
		let sql = `select * from ecs_user WHERE username = ? and password = ?`;

		//run the sql
		db.all(sql, data, (err, rows) => {
			if (err) {
			  throw err;
			}
			//check we have a result
			if (rows.length != 0) 
			{
				//make a guid
				var u = "";
				var i = 0;
				while (i++ < 36) 
				{
					var c = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"[i - 1],
					r = (Math.random() * 16) | 0,
				  	v = c == "x" ? r : (r & 0x3) | 0x8;
					u += c == "-" || c == "4" ? c : v.toString(16);
				}
				sessiontoken = u;
		  		//update the table with the guid
		  		let data = [sessiontoken, rows[0].id];
		 		let sql = `UPDATE ecs_user SET sessiontoken = ? WHERE id = ? `;
				db.run(sql, data, function(err) {
				    if (err) 
				    {
				      return console.error(err.message);
				    }
			    	//oupt guid to api request
			    	res.send(JSON.stringify({ token: sessiontoken }));
			  	});
			} 
			else 
			{
		  		res.send(JSON.stringify({ token: "0" }));
			}
		});
	}

	/*
	*	This function retunrs alll the orders from the orders table. 
	*
	*	Note: We may only want to make this clickable if it has been processed and is in product table.  This can be done 
	*		  in either the server or the amdin side.
	*
	*/
	this.getOrders = function getOrders(token,res)
	{
		//create a reults object
		let jsonStr = '{"results":[]}';
		let obj = JSON.parse(jsonStr);
		//store the data for the query 
		let data = [token];
		//build the query
	  	let sql =`select sessions.id,sessions.address,sessions.processed,sessions.swept,sessions.net,sessions.amount
	    		  from ecs_user
	    		  INNER JOIN sessions ON ecs_user.id = sessions.userid
		          WHERE ecs_user.sessiontoken = ?`;
		 //debug
		 //console.log(sql)

		//run the query
	  	db.all(sql, data, (err, rows) => {

	  		//throw on error
		    if (err) {
		      res.send(JSON.stringify({ results: err.message }));
		    }
		    rows.forEach(row => {

		    	//debug
		      	//console.log(row);
		      	//myObj.push(row);
		      	//obj.push('dsss');

		      	//add to results object
		      	obj["results"].push(row);

		    });
		    jsonStr = JSON.stringify(obj);
		    //debug
		    //console.log('done');
		    //console.log(jsonStr);

		    //return the orders
		    res.send(jsonStr);
		 });
	}


	/*
	*	This function retunrs and order from the prodct table using the address as the key.
	*
	* 	Note: Not 100% sure that order is the correct name here, we may have to change this in the future
	*
	*/
	this.getOrder = function getOrder(address,res)
	{
		//debug
		//console.log(address);
		//create a reults object
		let jsonStr = '{"results":[]}';
		let obj = JSON.parse(jsonStr);
		//store the data for the query 
		let data = [address];
		//build the query
		let sql = `select * from order_product WHERE order_product.address = ?`;
		//debug
		//console.log(sql)
		//run the query
		db.all(sql, data, (err, rows) => {
			if (err) 
			{
			  res.send(JSON.stringify({ results: err.message }));
			}
			rows.forEach(row => {
				//debug
			  	//console.log(row);
			  	//myObj.push(row);
			  	obj["results"].push(row);
			});
			jsonStr = JSON.stringify(obj);
			//debug
			//console.log('done');
			//console.log(jsonStr);

		    //return the order
			res.send(jsonStr);
		});
	}

	/*
	*
	*	This function returns the settings.
	*
	*/
	this.getSettings = function getSettings(token,res)
	{
		//create a reults object
		let jsonStr = '{"results":[]}';
		let obj = JSON.parse(jsonStr);
		//store the data for the query 
		let data = [token];
		//build the sql query
		let sql = `select ecs_coldstorageaddresses.address 
				   from ecs_user
				   INNER JOIN ecs_coldstorageaddresses ON ecs_user.id = ecs_coldstorageaddresses.userid
		           WHERE ecs_user.sessiontoken = ?`;
		 //debug
		 //console.log(sql)

		//run the sql
		db.all(sql, data, (err, rows) => 
		{
			if (err) 
			{
			  res.send(JSON.stringify({ results: err.message }));
			}
			//debug
			//console.log(rows);

			//check we have a result
			if (rows.length == 0) 
			{
			  res.send(JSON.stringify({ results: "0" }));
			} 
			else 
			{
			  //debug
			  //console.log(rows);

			  obj["results"].push(rows);
			  jsonStr = JSON.stringify(obj);
			  //debug
			  //console.log('done');
			  //console.log(jsonStr);

			  res.send(jsonStr);
			}
		});
	}


	/*
	*
	*	This function deletes a cold storage address.
	*
	*/
	this.deleteColdStorageAddress = function deleteColdStorageAddress(address,res)
	{
		//store the data for the query 
		let data = [address];
		//build the sql query
		let sql = `delete FROM ecs_coldstorageaddresses WHERE address = ?`;
		//run the sql
		db.run(sql, data, function(err) {
			if (err) 
			{
			  res.send(JSON.stringify({ results: err.message }));
			}   
			res.send(JSON.stringify({ results: "ok" }));
		});
	}

	/*
	*
	*	This function add a cold storage address
	*/
	this.addColdStorageAddress = function addColdStorageAddress(token,address,res)
	{
		//store the data for the query 
		let data = [token];
		//build the sql query
		let sql =  `select ecs_user.id from ecs_user WHERE ecs_user.sessiontoken = ?`;

		//debug
	  	//console.log(sql);

		//run the sql
		db.all(sql, data, (err, rows) => {

			//console.log(rows)
			if (err) {
			  res.send(JSON.stringify({ results: err.message }));
			}
			//debug
			//console.log(rows);

			//check we have a result
			if (rows.length == 0) {
			  res.send(JSON.stringify({ results: "error" }));
			} 
			else 
			{
				//insert it into the cold storage address
				db.run(
					`INSERT INTO ecs_coldstorageaddresses(address,userid) VALUES(?,?)`,
					[address,rows[0].id],
					function(err) 
					{
						if (err) 
						{
							console.log(err.message)
							res.send(JSON.stringify({ error: err.message }));
							return;
						}
						res.send(JSON.stringify({ results: "ok" }));
					}
				);
			}
		});
	}
}
exports.admin = admin;
