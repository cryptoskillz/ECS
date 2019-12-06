/*
  todo: *more details in the section where this todo is required
  Cache pay to adddress so it will work with no Bitcoin Core
  Check that bticoin is running and not frozen before calling it
  Finish email temaplates.  Note complitaing removing these complelty out of the database.


*/
const config = require("./config");
//open a database connection
//load SQLlite (use any database you want or none)
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./db/db.db", err => {
    if (err) {
        console.error(err.message);
    }
});
var dockerCLI = require('docker-cli-js');
var DockerOptions = dockerCLI.Options;
var Docker = dockerCLI.Docker;
var docker = new Docker()
//load the generic functions
//note we could ass this down i am not sure which is th emost efficient way to do this to be honest.  I shall look into that.
var generichelper = require("./generic.js").Generic;
var generic = new generichelper();
var api = function() {
    /*
    *
    * This function stores the user details 

      note : Check why it is storing adddress in this table (not required)
    *
    */
    this.storeUserDetails = function storeUserDetails(req, res) {
        //debug
        //console.log("query")
        //console.log(req.query);
        let data = [req.query.btcaddress];
        //console.log(data)
        let sql = `SELECT * FROM order_product where address = "` + req.query.btcaddress + `"`;
        //debug
        db.get(sql, [], (err, result) => {
            //console.log(result)
            if (err) {
                console.log(err);
            }
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
                    for (var metaname in req.query) {
                        if (req.query.hasOwnProperty(metaname)) {
                            var metavalue = req.query[metaname];
                            if (metaname.indexOf("sr-product-") > -1) {
                                //console.log('prod:'+req.query[metaname])
                                //inser into proiduct meta
                                if (req.query[metaname] != "" && req.query[metaname] != "undefined") {
                                    metaname = metaname.replace("sr-product-", "");
                                    //insert into oder meta
                                    db.run(`INSERT INTO order_product_meta(productid,metaname,metavalue) VALUES(?,?,?)`, [result.id, metaname, metavalue], function(err) {
                                        if (err) {
                                            return console.log(err.message);
                                        }
                                    });
                                }
                            } else {
                                //note we should change this to sr-order so it is not just an if else check in the future
                                //debug
                                //console.log('order:'+req.query[metaname])
                                //note the undefined should be cleaned in sr.js but does hurt to also check here
                                if (req.query[metaname] != "" && req.query[metaname] != "undefined") {
                                    metaname = metaname.replace("sr-", "");
                                    //insert into oder meta
                                    db.run(`INSERT INTO order_meta(productid,metaname,metavalue) VALUES(?,?,?)`, [result.id, metaname, metavalue], function(err) {
                                        if (err) {
                                            return console.log(err.message);
                                        }
                                    });
                                }
                                //debug
                                //console.log(metaname, metavalue);
                            }
                        }
                    }
                    res.send(JSON.stringify({
                        status: "ok"
                    }));
                });
            });
        });
    };
    /*


    This function add a user to the user table.  This is used for SAAS hosted so we can use more than one user 
    we ideally only wnt one user per instance but this allows us to onboard people to the Bitcoin experience easier.

    */
    this.addUser = function storeUser(req, res) {
        var generator = require("generate-password");
        var password = generator.generate({
            length: 10,
            numbers: true
        });
        //debug
        //console.log(password);
        //console.log(req.query);
        db.run(`INSERT INTO ecs_user(username,password,isadmin) VALUES(?,?,?)`, [req.query.email, password, 1], function(err) {
            if (err) {
                //return console.log(err.message);
                res.send(JSON.stringify({
                    status: "error"
                }));
            } else {
                //get the userid
                var userid = this.lastID;
                db.run(`INSERT INTO ecs_coldstorageaddresses(userid,address) VALUES(?,?)`, [userid, req.query.btc], function(err) {
                    if (err) {
                        //return console.log(err.message);
                        res.send(JSON.stringify({
                            status: "error"
                        }));
                    } else {
                        //debug
                        //console.log(this.lastID);
                        res.send(JSON.stringify({
                            status: userid
                        }));
                    }
                });
            }
        });
    };
    /*
    *
    * This function stores the product in the database
    *
    *  TODO: make sure we have an adddress before we store the product without there is no way to process the order
             and we will get result.id errors this falls into the same area as caching addrress we could also benefot 
             from having a check to see if bitcoin core is running correctly.
    *
    */
    this.storeProduct = function storeProduct(req, res) {
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
            let sql = `SELECT * FROM order_product where address = "` + req.query.btcaddress + `"`;
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
                    db.run(`INSERT INTO order_product(address,name,price,quantity) VALUES(?,?,?,?)`, [
                        req.query.btcaddress,
                        req.query.name,
                        req.query.price,
                        req.query.quantity
                    ], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
                    });
                } else {
                    //update it
                    let data = [req.query.quantity, req.query.btcaddress];
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
        res.send(JSON.stringify({
            status: "ok"
        }));
    };
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
    this.generateBTCAddress = function generateBTCAddress(req, res) {
        //generare BTC address
        client.getNewAddress().then(address => {
            //debug
            //console.log(address);
            //insert it into the database
            db.run(`INSERT INTO sessions(address,addresstype,userid,net,carttype) VALUES(?,?,?,?,?)`, [address, req.addresstype, req.uid, process.env.NETWORK, req.carttype], function(err) {
                if (err) {
                    //debug
                    //return console.log(err.message);
                    //return error
                    res.send(JSON.stringify({
                        error: err.message
                    }));
                    return;
                }
                //return the address
                res.send(JSON.stringify({
                    address: address
                }));
            });
            return;
        });
    };
    /*
    =============================================================================================================================

    This function generate a new Lightning invoice
  
    Note: at present it is tied into cyphernode, at a point in the future we will decouple it and make it plaform agnostic
  
    =============================================================================================================================

    */
    this.generateLightningAddress = function generateLightningAddress(req, res) {
        //debug
        //console.log(req)
        //todo : replace this with its own lightning class and/or cryphrnode sdk
        let lightningaddress = '';
        //hold the btc address
        let btcaddress = req.btcaddress;
        //hold the amount
        let amount = req.amount;
        //turn it into a sat amount
        amount = amount / 0.00000001;
        const request = require('request');
        //load crytpo js
        const cryptojs = require("crypto-js");
        //set an expiry time for the tokens.  Not this should be much lower in production, like 100 seconds but for testing it is fine.
        //note maybe this should be an env var
        var expiryInSeconds = 36000;
        //get our API key from the env variables
        var api_key = process.env.CYPHERNODE_API_KEY
        var cyphernodeurl = process.env.CYPHER_GATEWAY_URL
        //create a bearer token
        //build the data
        //set an this the id of the key you want to use which can be found in cyphernode/gatekeeper/keys.properties 
        id = "003";
        //set the expiry time to a point in the future
        exp = Math.round(new Date().getTime() / 1000) + expiryInSeconds;
        //set the algo type we are going to use and base 64 it
        h64 = Buffer.from(JSON.stringify({
            alg: "HS256",
            typ: "JWT"
        })).toString("base64");
        //set the payload and set it to h64
        p64 = Buffer.from(JSON.stringify({
            id: id,
            exp: exp
        })).toString("base64");
        //join them together
        msg = h64 + "." + p64;
        //get a sha256 has or the h64,p64 and the API key (which is the secret in JWT world)
        const hash = cryptojs.HmacSHA256(msg, api_key);
        //create the JWT token
        const token = h64 + "." + p64 + "." + hash
        //debug
        //output it 
        //console.log("token - " + token);
        /*
        ===========================
        END OF JWT TOKEN CREATION
        ===========================
        */
        /*
        ====================================
        START OF REQUEST TO CYPHERNODE PROXY 
        ====================================
        */
        //set the menthod we want to call
        const method = "ln_create_invoice";
        //create a unique label 
        let u = '',
            i = 0;
        while (i++ < 36) {
            var c = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' [i - 1],
                r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            u += (c == '-' || c == '4') ? c : v.toString(16)
        }
        //debug
        //console.log(u)
        //set the body we want to send, this is not required for every method call but it does no harm to send it
        //note: what does bolt11 stand for?
        //todo: pass up description from sr.js?
        //todo: set the expiry in a process env.
        //note: the any for msatoshi is not working as excetped, will have to look into that. 
        //note: removed the optional expiry field, we may decied to put this back later.`
        const body = '{"msatoshi":'+amount+',"label":"' + u + '","description":"order #111"}';
        //debug
        console.log(body);
        //create the Bearer header
        const authheaader = "Bearer " + token;
        //use resuest
        //create the options object
        //note : does CYPHER_GATEWAY_URL have to be different from RPC host?
        /*
        request.defaults({
            strictSSL: false, // allow us to use our self-signed cert for testing
            rejectUnauthorized: false
        });
        */
        const options = {
            url: cyphernodeurl + method,
            headers: {
                'Authorization': authheaader
            },
            body: body
        };
        //create the call back
        function callback(error, response, body) {
            //debug 
            //console.log(btcaddress)
            //console.log(body);
            if (!error && response.statusCode == 200) {
                //parse the response
                const info = JSON.parse(body);
                //get the address
                //note: we may to store all the invloic information table if so we can create a new table for this. 
                lightningaddress = info.bolt11;
                //debug
                console.log(info.bolt11);
                //note: for this to work in this manner we are always using the BTC address as the join this means we would 
                //      not be able to offer a lightning only vrsion of the cart.  At this moment in time it is fine as we do 
                //      not have the UX etc to handle the cart in this way.  If we want to add this in the future then it would
                //      require us to refactor slightly and maybe use a uniqie ID as the join and have rename address field to
                //      BTCaddress
                let data = [lightningaddress, btcaddress];
                //build the query
                let sql = `UPDATE sessions
                  SET lightningaddress = ?
                  WHERE address = ?`;
                //run the query
                db.run(sql, data, function(err) {
                    if (err) {
                        return console.error(err.message);
                    }
                    //retun response
                    res.send(JSON.stringify({
                        address: lightningaddress
                    }));
                });
            } else {
                //console.log(error);
                //you done messed up boi
                //note there can be many reasons for this to fail, we may trap them later for now we do not care a blank address
                //     means it failed and we can work with that for now
                res.send(JSON.stringify({
                    address: ""
                }));
            }
        }
        //make the calls
        request.post(options, callback);
    };
    /*
    *
    * This function check if payment has been sent to the address
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
                    res.send(JSON.stringify({
                        status: "confirmed"
                    }));
                    //todo: send the email confirmations.
                    //send email to customer.
                    //console.log('send email in monitor')
                    generic.sendMail(2, "cryptoskillz@protonmail.com");
                });
            } else {
                //return error
                res.send(JSON.stringify({
                    status: "not confirmed"
                }));
            }
        });
    };
    /*
      This function runs through the session table and looks for unprocessed payments.

    */
    this.checksessionforpayment = function checkSessionForPayment() {
        //get the unprocessed records from the sessions table
        let sqldata = [0, process.env.NETWORK, 1];
        //set the max check to 1000 we can assume if we are not see unconfrimed transactions it requires some kind of mnaual generateAddressreview
        let sql = `select * from sessions where processed = ? and address != ''  and net =? and sessioncountcheck < 1000 ORDER BY sessioncountcheck limit ? `;
        db.all(sql, sqldata, (err, rows) => {
            if (err) {
                throw err;
            }
            //loop through it
            rows.forEach(row => {
                //debug
                console.log(row);
                //get the address
                let address = row.address;
                //client.GetUnconfirmedBalance().then(res => {
                // console.log(res);
                //});
                //check if the address has any unspent transactions
                client.listUnspent(1, 9999999, [address]).then(listResult => {
                    //debug
                    console.log(listResult)
                    //check there is at least one unspent transaction
                    if (listResult.length == 0) {
                        //there is not so move on
                        //debug
                        //console.log(row.id + ' : ' + address + ' no unspent transactions');
                        let sqldata = [row.id];
                        let sql = `UPDATE sessions
                  SET sessioncountcheck = sessioncountcheck+1
                  WHERE id = ?`;
                        //run sql
                        db.run(sql, sqldata, function(err) {
                            if (err) {}
                        });
                    } else {
                        //debug
                        console.log(listResult[0])
                        //check we have enough confirmations.
                        if (listResult[0].confirmations >= process.env.CONFIRMATIONS) {
                            //incement the counter here as we dont want to process items in the session table that are failiing
                            //over and over.
                            let sqldata = [row.id];
                            let sql = `UPDATE sessions
                  SET sessioncountcheck = sessioncountcheck+1
                  WHERE id = ?`;
                            //run sql
                            db.run(sql, sqldata, function(err) {
                                if (err) {}
                                //debug
                                //console.log(listResult);
                                //get cold storage address for user and if the want to auto send funds (used for SAAS cersion)
                                let sqldata = [row.userid, 1];
                                //build the query
                                let sql = `select 
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
                                db.get(sql, sqldata, function(err, coldstorageaddressesresult) {
                                    if (err) {
                                        //no cold storage address.
                                    }
                                    //debug
                                    //console.log('coldstorageaddressesresult');
                                    //console.log(coldstorageaddressesresult);
                                    //check we have a cold storage address
                                    if (coldstorageaddressesresult != undefined) {
                                        //check we want to release the funds straight away, usually SAAS users
                                        if (coldstorageaddressesresult.autosendfunds == 1) {
                                            //get the amount to send
                                            amounttosend = listResult[0].amount.toFixed(8);
                                            //debug
                                            //console.log('ams'+amounttosend);
                                            //console.log(coldstorageaddressesresult.address);
                                            //send the address, take the fee from the amount.
                                            client.sendToAddress(coldstorageaddressesresult.address, amounttosend, "", "", true).then(result => {
                                                //debug
                                                //console.log('result');
                                                //console.log(result);
                                                //update session table
                                                let sqldata = ["1", "1", address];
                                                let sql = `UPDATE sessions
                      SET swept = ?,
                      processed =  ?
                      WHERE address = ?`;
                                                //run sql
                                                db.run(sql, sqldata, function(err) {
                                                    if (err) {}
                                                    //check payment type if it is 2 this is donation mode so it not in order product
                                                    if (row.carttype == 0) {
                                                        let sqldata = [address];
                                                        let sql = `select *
                                  from order_product  
                                  where address =?`;
                                                        db.get(sql, sqldata, function(err, result) {
                                                            if (err) {}
                                                            let sqldata = [result.id];
                                                            let sql = `select metavalue FROM order_meta where productid = ? and metaname = 'email'`;
                                                            db.get(sql, sqldata, (err, result2) => {
                                                                if (err) {
                                                                    console.error("sql error " + err.message);
                                                                    return;
                                                                }
                                                                let total = result.price * result.quantity;
                                                                let mailMerge = {
                                                                    ORDEREMAIL: result2.metavalue,
                                                                    ORDERDETAILS: result.price + " BTC " + result.name + " quantity " + result.quantity,
                                                                    ORDERTOTAL: total,
                                                                    COLDSTORAGE: coldstorageaddressesresult.address
                                                                };
                                                                //todo: send the sales order to the person in the ecs_user account
                                                                //
                                                                //send to admin
                                                                generic.sendMail(3, coldstorageaddressesresult.username, mailMerge);
                                                                console.log(amounttosend + " sent from " + address + " to " + coldstorageaddressesresult.address);
                                                            });
                                                        });
                                                    } else {
                                                        //send donation email
                                                        let total = result.price * result.quantity;
                                                        let mailMerge = {
                                                            ORDEREMAIL: "",
                                                            ORDERDETAILS: "donation",
                                                            ORDERTOTAL: amounttosend,
                                                            COLDSTORAGE: coldstorageaddressesresult.address
                                                        };
                                                        //send to admin
                                                        generic.sendMail(3, coldstorageaddressesresult.username, mailMerge);
                                                        console.log(mailMerge);
                                                    }
                                                });
                                            });
                                        }
                                    }
                                });
                            });
                        } else {
                            console.log("not enough confs");
                        }
                    }
                });
            });
        });
    };
    /*
    *
    * This function moves a payment to a cold storge address (admin)

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
                if (result.length == 0) {
                    //debug
                    //console.log(result);
                    res.send(JSON.stringify({
                        result: "nothing to sweep no unspent transactions"
                    }));
                    return;
                } else {
                    if (result[0].confirmations >= process.env.CONFIRMATIONS) {
                        amounttosend = result[0].amount.toFixed(8);
                        //debug
                        //console.log('ams'+amounttosend);
                        //return;
                        client.sendToAddress(coldstorageaddress, amounttosend).then(result => {
                            //debug
                            //console.log('result');
                            //console.log(result);
                            let sqldata = ["1", address];
                            let sql = `UPDATE sessions
                  SET swept = ?
                  WHERE address = ?`;
                            //run sql
                            db.run(sql, sqldata, function(err) {
                                if (err) {}
                                //update the address in cold storage so it is not used again.
                                //build sql
                                let sqldata = ["1", coldstorageaddress];
                                let sql = `UPDATE ecs_coldstorageaddresses
                               SET used = ?
                              WHERE ecs_coldstorageaddress = ?`;
                                //run sql
                                db.run(sql, sqldata, function(err) {
                                    if (err) {}
                                    //return status
                                    res.send(JSON.stringify({
                                        status: "swept"
                                    }));
                                    return;
                                });
                            });
                        });
                    } else {
                        //return status
                        res.send(JSON.stringify({
                            status: "not enough confirmations :" + result[0].confirmations
                        }));
                        return;
                    }
                }
            });
        });
    };
};
exports.api = api;