var admin = function ()
{
	this.test = function test() 
	{
		console.log('yay')
	}

	this.addColdStorageAddress = function addColdStorageAddress(token,address,db,res)
	{
		//console.log(token);
		//console.log(address);
		let sql =
	    `select user.id 
	           from user
	             WHERE user.sessiontoken = '` +
	    	token +
	    `'`;

	    //debug
	  //console.log(sql);

	  //run the sql
	  db.all(sql, [], (err, rows) => {
	    if (err) {
	      throw err;
	    }
	    //debug
	    //console.log(rows);

	    //check we have a result
	    if (rows.length == 0) {
	      res.send(JSON.stringify({ results: "error" }));
	    } else {


	         db.run(
	        `INSERT INTO coldstorageaddresses(address,userid) VALUES(?,?)`,
	        [address,rows[0].id],
	        function(err) {
	          if (err) {
	            //debug
	            //console.log(err.message);

	            res.send(JSON.stringify({ error: err.message }));

	          }
	          res.send(JSON.stringify({ results: "ok" }));
	        }
	      );

	    }
	  });
	}
}
exports.admin = admin;
