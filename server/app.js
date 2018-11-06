//load express
const express = require("express");
//include the version package
require( 'pkginfo' )( module, 'version','name','description' );
//display a message to the console.
console.log( module.exports.name+": " + module.exports.version );
console.log( module.exports.description+' is listenting :]');

//load the generic functions
var generichelper = require('./api/helpers/generic.js').Generic;
var generic = new generichelper();

//init it
const app = express();

/*
==============================
START OF BACKOFFICE ROUTING
=============================
*/
app.get("/backoffice/test", (req, res) => {
  //load the back office helper
  let backofficehelper = require('./api/helpers/backoffice.js').backOffice;
  let backoffice = new backofficehelper();

  //debug
  //backoffice.test();
});


/*
==============================
END OF BACKOFFICE ROUTING
=============================
*/

/*
========================
START OF ADMIN FUNCTION
========================
*/

//update the settings
app.get("/admin/updatesettings", (req, res) => {
  //set the headers
  res = generic.setHeaders(res);

  //check if it is a zero and if so return error
  //todo : check for duplicate address and validate the btc adddress
  if (req.query.address == '')
  {
     res.send(JSON.stringify({ error: "no address" }));
     return;
  }
  //load the admin helper
  let adminhelper = require('./api/helpers/admin.js').admin;
  let admin = new adminhelper();
  //add the cold storage address
  admin.addColdStorageAddress(req.query.token,req.query.address,res);
});



//return the admin settings
app.get("/admin/deletesettingsaddress", (req, res) => {

  //set the headers
  res = generic.setHeaders(res);
  //check if it is a zero and if so return error
  if (req.query.address == '')
  {
     res.send(JSON.stringify({ error: "no address" }));
     return;
  }
  //load the admin helper
  let adminhelper = require('./api/helpers/admin.js').admin;
  let admin = new adminhelper();  
  admin.deleteColdStorageAddress(req.query.address,res)
  
});


//return the admin settings
app.get("/admin/settings", (req, res) => {
  //set the headers
  res = generic.setHeaders(res);
  //check if it is a zero and if so return error
  if (req.query.address == '')
  {
     res.send(JSON.stringify({ error: "no address" }));
     return;
  }
  //load the admin helper
  let adminhelper = require('./api/helpers/admin.js').admin;
  let admin = new adminhelper(); 
  //get the settings
  admin.getSettings(req.query.token,db,res);
});

//orders
app.get("/admin/order", (req, res) => {
  //set the headers
  res = generic.setHeaders(res);
  //check if it is a zero and if so return error
  if (req.query.address == '')
  {
     res.send(JSON.stringify({ error: "no address" }));
     return;
  }
  //load the admin helper
  let adminhelper = require('./api/helpers/admin.js').admin;
  let admin = new adminhelper(); 
  //get the products
  admin.getOrder(req.query.address,res);
});

//return a list of payments
app.get("/admin/payments", (req, res) => {
  //set the headers
  res = generic.setHeaders(res);
  //check if it is a zero and if so return error
  if (req.query.address == '')
  {
     res.send(JSON.stringify({ error: "no address" }));
     return;
  }
  //load the admin helper
  let adminhelper = require('./api/helpers/admin.js').admin;
  let admin = new adminhelper(); 
  //call the get orders function
  admin.getOrders(req.query.token,db,res);

});

//login the user in
app.get("/admin/login", (req, res) => {
  //set the headers
  res = generic.setHeaders(res);
  //load the admin helper
  let adminhelper = require('./api/helpers/admin.js').admin;
  let admin = new adminhelper(); 
  //call the login function
  admin.login(req.query.uname,req.query.pass,res);
});



/*
========================
END OF ADMIN FUNCTION
========================
*/

/*
========================
START OF API FUNCTIONS
========================
*/

//pass it an address and it will check if payment has been made.  See this just like monitor js does but it is not on a timer. called from admin
app.get("/api/monitor", (req, res) => {
  //set the headers
  res = generic.setHeaders(res);
  //load the api helper
  let apihelper = require('./api/helpers/api.js').api;
  let api = new apihelper(); 
  //call the login function
  api.monitor(req.query.address,res);
});

//move a payment to cold storage called from admin
//todo: We get the cold storage address from a process env but in the admin we store it a table.  We have to decide how to use the cold
//    storage address and serve it the same way in each function
app.get("/api/sweep", (req, res) => {
  //set the headers
  res = generic.setHeaders(res);
  //load the api helper
  let apihelper = require('./api/helpers/api.js').api;
  let api = new apihelper(); 
  //call the login function
  api.sweep(address,res);
});

//generate an address and output it called rom sr.js
app.get("/api/address", (req, res) => {
    //set the headers
  res = generic.setHeaders(res);
  //load the api helper
  let apihelper = require('./api/helpers/api.js').api;
  let api = new apihelper(); 
  //call the login function
  api.generateAddress(req.query.uid,res);
});

//store user details called rom sr.js
app.get("/api/storeuserdetails", (req, res) => {
  //set the headers
  res = helper.setHeaders(res);
  let data = [req.query.email, req.query.address];
  let sql = `UPDATE product
	            SET email = ?
	           	WHERE address = ?`;

  db.run(sql, data, function(err) {
    if (err) {
      return console.error(err.message);
    }
    //todo: send email saying we are waiting for payment. 

    //console.log(`Row(s) updated: ${this.changes}`);
    res.send(JSON.stringify({ status: "ok" }));
  });
});

//storeproduct  called rom sr.js
app.get("/api/storeproduct", (req, res) => {
  //set the headers
  res = helper.setHeaders(res);
  //check if it is in the product table
  if (req.query.quantity == 0) {
    //delete the record
    let data = [req.query.address];
    let sql = `delete FROM product WHERE address = ?`;
    db.run(sql, data, function(err) {
      if (err) {
        return console.error(err.message);
      }
    });
  } else {
    //see if we have it already
    let sql =
      `SELECT * FROM product where address = "` + req.query.address + `"`;
    //debug
    //console.log(sql);

    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      //check we have a result
      if (rows.length == 0) {
        //insert it
        //delete the record
        db.run(
          `INSERT INTO product(address,name,price,quantity) VALUES(?,?,?,?)`,
          [
            req.query.address,
            req.query.name,
            req.query.price,
            req.query.quantity
          ],
          function(err) {
            if (err) {
              return console.log(err.message);
            }
          }
        );
      } else {
        //update it
        let data = [req.query.quantity, req.query.address];
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
  res.send(JSON.stringify({ status: "ok" }));
});

/*
========================
END OF API FUNCTIONS
========================
*/

//console.log('up and at em ')
//set port not we use an env port so that the server we deploy to can set it to whatever port it wants.
//This is common practice in AWS I am not sure if all server providers use the same method.
var port = process.env.PORT || 3000;
//listen
app.listen(port);


