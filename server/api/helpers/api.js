/*
  todo: *more details in the section where this todo is required
  Cache pay to adddress so it will work with no Bitcoin Core
  Check that bticoin is running and not frozen before calling it
  Finish email temaplates.  Note complitaing removing these complelty out of the database.


*/
const config = require('./config');
//open a database connection
//load SQLlite (use any database you want or none)
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./db/db.db", err => {
  if (err) {
    console.error(err.message);
  }
});

//load the generic functions
//note we could ass this down i am not sure which is th emost efficient way to do this to be honest.  I shall look into that. 
var generichelper = require('./generic.js').Generic;
var generic = new generichelper();

var api = function() {

   /*
  *
  * This function stores the user details 

    note : Check why it is storing adddress in this table (not required)
  *
  */
  this.storeUserDetails = function storeUserDetails(req,res)
  {
    //debug
    //console.log("query")
    //console.log(req.query);

    let data = [req.query.address];
    //console.log(data)
    let sql = `SELECT * FROM order_product where address = "`+req.query.address+`"`;
    //debug

    db.get(sql, [], (err, result) => {
      //console.log(result)
      if (err) {
        console.log(err)
      }

      //check if there is a product id if not set it to 0 so it deletes nothing
      //this is a bit of hack but we can fix it later
      //let data = [0];
      //console.log(result);
      //if(result == undefined)
      //{
          //the product does not exist so we do not have to do any admin stuff.
        //  res.send(JSON.stringify({ status: "ok" }));
      //}
      //else
      //{
        let sql = `delete FROM order_meta WHERE productid = ?`;
        db.run(sql, data, function(err) {
          if (err) {
            return console.error(err.message);
          }
          let data = [result.id];
          let sql = `delete FROM order_product_meta WHERE productid = ?`;
          db.run(sql, data, function(err) {
              if (err) {
                return console.error(err.message);
              }
              for (var metaname in req.query) 
              {

                  if (req.query.hasOwnProperty(metaname)) 
                  {
                      var metavalue = req.query[metaname]
                      
                      if(metaname.indexOf("sr-product-") > -1) 
                      {
                        //console.log('prod:'+req.query[metaname])
                        //inser into proiduct meta
                        if ((req.query[metaname] != '') && (req.query[metaname] != "undefined"))
                        {
                          metaname = metaname.replace("sr-product-", "");
                          //insert into oder meta
                          db.run(
                            `INSERT INTO order_product_meta(productid,metaname,metavalue) VALUES(?,?,?)`,
                            [
                              result.id,
                              metaname,
                              metavalue
                            ],
                            function(err) {
                              if (err) {
                                return console.log(err.message);
                              }
                            }
                          );
                        }

                      }
                      else
                      {
                          //note we should change this to sr-order so it is not just an if else check in the future
                          //debug
                          //console.log('order:'+req.query[metaname])
                          //note the undefined should be cleaned in sr.js but does hurt to also check here
                          if ((req.query[metaname] != '') && (req.query[metaname] != "undefined"))
                          {
                            metaname = metaname.replace("sr-", "");
                            //insert into oder meta
                            db.run(
                              `INSERT INTO order_meta(productid,metaname,metavalue) VALUES(?,?,?)`,
                              [
                                result.id,
                                metaname,
                                metavalue
                              ],
                              function(err) {
                                if (err) {
                                  return console.log(err.message);
                                }
                              }
                            );
                          }
                        //debug
                        //console.log(metaname, metavalue);
                      }

                  }
              }
              res.send(JSON.stringify({ status: "ok" }));
            });
          });

        //}
      });
  
  }

  /*


  This function add a user to the user table.  This is used for SAAS hosted so we can use more than one user 
  we ideally only wnt one user per instance but this allows us to onboard people to the Bitcoin experience easier.

  */

  this.addUser = function storeUser(req,res)
  {
    var generator = require('generate-password');
 
    var password = generator.generate({
        length: 10,
        numbers: true
    });
    //debug
    //console.log(password);
    //console.log(req.query);
    db.run(
        `INSERT INTO ecs_user(username,password,isadmin) VALUES(?,?,?)`,
        [
          req.query.email,
          password,
          1
        ],
        function(err) {
          if (err) {
            //return console.log(err.message);
            res.send(JSON.stringify({ status: "error" }));

          }
          else
          {
             db.run(
              `INSERT INTO ecs_coldstorageaddresses(userid,address) VALUES(?,?)`,
              [
                 this.lastID,
                req.query.btc
              ],
              function(err) {
                if (err) {
                  //return console.log(err.message);
                  res.send(JSON.stringify({ status: "error" }));

                }
                else
                {
                  //debug
                  //console.log(this.lastID);
                  res.send(JSON.stringify({ status: this.lastID }));
                }
              }
            ); 
          }
        }
      );
  }

  /*
  *
  * This function stores the product in the database
  *
  *  TODO: make sure we have an adddress before we store the product without there is no way to process the order
           and we will get result.id errors this falls into the same area as caching addrress we could also benefot 
           from having a check to see if bitcoin core is running correctly.
  *
  */
  this.storeProduct = function storeProduct(req,res)
  {
    //check if it is in the product table
    if (req.query.quantity == 0) {
      //delete the record
      let data = [req.query.address];
      let sql = `delete FROM order_product WHERE address = ?`;
      db.run(sql, data, function(err) {
        if (err) {
          return console.error(err.message);
        }
      });
    } else {
      //see if we have it already
      let sql =
        `SELECT * FROM order_product where address = "` + req.query.address + `"`;
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
            `INSERT INTO order_product(address,name,price,quantity) VALUES(?,?,?,?)`,
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
          let sql = `UPDATE order_product SET quantity = ? WHERE address = ?`;
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
  }

  /*
  =============================================================================================================================

  This function generate a new address
  
  Note if Bitcoin core is slow in returning an addresss this could have an adverse impact on the functionality
  to avoid this we could cache a number of addresses ready to use in the database.
  
  todo 

  add passphrase back. 
  allow nartive, Segwit or Bech32 address to be specified.
  
  =============================================================================================================================

  */
  this.generateAddress = function generateAddress(uid,res)
  {
    //create a new address in theaccount account :]
    client.getNewAddress().then(address => {
      //debug
      //console.log(address);

      //insert it into the database
      db.run(
        `INSERT INTO sessions(address,userid,net) VALUES(?,?,?)`,
        [address, uid, process.env.NETWORK],
        function(err) {
          if (err) {
            //debug
            //return console.log(err.message);

            //return error
            res.send(JSON.stringify({ error: err.message }));
            return;
          }
          //return the address
          res.send(JSON.stringify({ address: address }));
        }
      );
      return;
    });
  }


  /*
	*
	*	This function check if payment has been sent to the address
  *
  * todo: check client is running
          fix small amounts been written to the data base incorrectly (ie 0.00002000 as 2.0e-05) most likely we will have 
          parse it as a string before we write to the database
	*
	*/
  this.monitor = function monitor(address, res) {

    //call the recieved by address RPC call
    //console.log(address)
    client.getReceivedByAddress(address).then(result => {
      //check it is more tha 0
      //note may want to check confirmations here

      //debug
      //console.log(result);

      if (result > 0) {
        //build a data array
        let data = ["1", result, address];
        //build the query
        let sql = `UPDATE sessions
				          SET processed = ?,
				            amount = ?
				          WHERE address = ?`;
        //run the query
        db.run(sql, data, function(err) {
          if (err) {
            return console.error(err.message);
          }
          //retun response
          res.send(JSON.stringify({ status: "confirmed" }));
          //todo: send the email confirmations.
          //send email to customer.
          //console.log('send email in monitor')
          generic.sendMail(2,'cryptoskillz@protonmail.com');
        });
      } else {
        //return error
        res.send(JSON.stringify({ status: "not confirmed" }));
      }
    });
  };

  /*
    This function runs through the session table and looks for unprocessed payments.

  */
  this.checksessionforpayment = function checkSessionForPayment() {
    //get the unprocessed records from the sessions table
    let sqldata = [0];
    let sql = `select * from sessions where processed = ?`;
    db.all(sql, sqldata, (err, rows) => {
      if (err) {
        throw err;
      }
      //loop through it
      rows.forEach((row) => {
        //debug
        //console.log(row);

        //get the address
        let address = row.address;
        //check if the address has any unspent transactions
        client.listUnspent(1, 9999999, [address]).then(listResult => {
          //debug
          //console.log(listResult[0])

          //check there is at least one unspent transaction
          if (listResult.length == 0) 
          {
            //there is not so move on
            //debug
            //console.log(address+' not recieved');
          } 
          else 
          {
            //check we have enough confirmations.
            if (listResult[0].confirmations >= process.env.CONFIRMATIONS) 
            {
              //debug
              //console.log(listResult);

              //get cold storage address for user and if the want to auto send funds (used for SAAS cersion)
              let sqldata = [row.userid,1];
              //build the query 
              let sql =  `select 
                          ecs_user.id,
                          ecs_user.username,
                          ecs_coldstorageaddresses.userid,
                          ecs_coldstorageaddresses.autosendfunds,
                          ecs_coldstorageaddresses.address
                          from ecs_user 
                          LEFT JOIN ecs_coldstorageaddresses
                          ON ecs_user.id = ecs_coldstorageaddresses.userid
                          where ecs_coldstorageaddresses.userid = ? 
                          and ecs_coldstorageaddresses.autosendfunds = ?`;
              db.get(sql, sqldata, function(err,coldstorageaddressesresult) {
                if (err) {
                }
                //debug
                //console.log('coldstorageaddressesresult');
                //console.log(coldstorageaddressesresult);

                //check we have a cold storage address
                if (coldstorageaddressesresult != undefined)
                {
                  //check we want to release the funds straight away, usually SAAS users
                  if (coldstorageaddressesresult.autosendfunds == 1)
                  {
                    //get the amount to send
                    amounttosend = listResult[0].amount.toFixed(8);
                    //debug
                    //console.log('ams'+amounttosend);
                    //console.log(coldstorageaddressesresult.address);
                    
                    //send the address, take the fee from the amount.  
                    client.sendToAddress(coldstorageaddressesresult.address,amounttosend,'','',true).then(result => {
                    //debug
                    //console.log('result');
                    //console.log(result);

                    //update session table
                    let sqldata = ["1","1", address];
                    let sql = `UPDATE sessions
                    SET swept = ?,
                    processed =  ?
                    WHERE address = ?`;
                    //run sql
                    db.run(sql, sqldata, function(err) {
                      if (err) {
                      }

                      //get the address details
                      let sqldata = [address]; 
                      let sql = `select *
                                from order_product  
                                where address =?`
                      db.get(sql, sqldata, function(err,result) {
                        if (err) {
                        }
                        let sqldata = [result.id]; 
                        let sql = `select metavalue FROM order_meta where productid = ? and metaname = 'email'`;
                        db.get(sql, sqldata, (err, result2) => {
                          if (err) {
                            console.error('sql error ' + err.message);
                            return;
                          }
                          let total = result.price*result.quantity;
                          let mailMerge = {
                            ORDEREMAIL: result2.metavalue,
                            ORDERDETAILs:result.price+" BTC "+result.name+" quantity "+result.quantity,
                            ORDERTOTAL:total,
                            COLDSTORAGE:address
                          };
                        });
                      });    
                      //send the sales order to the person in the ecs_user account
                      generic.sendMail(3,coldstorageaddressesresult.email,mailMerge);
                      //send confirmation email 
                      //todo : May make this optional as a flag as well.
                      console.log(amounttosend+' sent from '+address+' to '+coldstorageaddressesresult.address);
                    });
                  });  
                }
              }
            });
          }
          else
          {
            console.log('not enough confs');
          }
        }
       });
      });
    });
 
  };
  /*
	*
	*	This function moves a payment to a cold storge address (admin)

    Note we will have to update this to handle UID's
    note.  

    This function may not be required anymore as we have the timer check now.

	*
	*/
  this.sweep = function sweep(address, res) {

    let sqldata = [0];
    //this has to use the userid to get the correct address from.
    let sql = `select * from ecs_coldstorageaddresses where used = ?`;

    //get a cold storage address
    db.get(sql, sqldata, (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      //save the address
      var coldstorageaddress = result.address;
      client.listUnspent(1, 9999999, [address]).then(result => {
        //debug
        //console.log(result[0])
         if (result.length == 0) 
         {
              //debug
              //console.log(result);
              res.send(
                JSON.stringify({
                  result: "nothing to sweep no unspent transactions"
                })
              );
              return;
          } 
          else 
          {
            if (result[0].confirmations >= process.env.CONFIRMATIONS) 
            {
                amounttosend = result[0].amount.toFixed(8);
                //debug
                //console.log('ams'+amounttosend);
                //return;
                client.sendToAddress(coldstorageaddress,amounttosend).then(result => {
                  //debug
                  //console.log('result');
                  //console.log(result);

                  let sqldata = ["1", address];
                  let sql = `UPDATE sessions
                  SET swept = ?
                  WHERE address = ?`;
                  //run sql
                  db.run(sql, sqldata, function(err) {
                    if (err) {
                    }
                    //update the address in cold storage so it is not used again.
                    //build sql
                    let sqldata = ["1", coldstorageaddress];
                    let sql = `UPDATE ecs_coldstorageaddresses
                               SET used = ?
                              WHERE ecs_coldstorageaddress = ?`;
                    //run sql
                    db.run(sql, sqldata, function(err) {
                      if (err) {
                      }
                      //return status
                      res.send(JSON.stringify({ status: "swept" }));
                      return;
                    });
                  });
                });
              }
              else
              {
                //return status
                res.send(
                  JSON.stringify({
                    status:
                      "not enough confirmations :" + result[0].confirmations
                  })
                );
                return;
              }
            }
          });
       });
    };
  };
  exports.api = api;
