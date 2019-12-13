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
//todo move this to a config file as it is used in a few places now
//1 = testnet
//2 = mainnet
const network = process.env.NETWORK;
//console.log(network)
//load the generic functions
//note we could ass this down i am not sure which is th emost efficient way to do this to be honest.  I shall look into that. 
var generichelper = require('./generic.js').Generic;
var generic = new generichelper();
var webhook = function() {
    this.test = function test() {
        console.log('yay')
    }
    /*
    =============================================================================================================================

    This function checks to see if a lightning payment has been paid.

    it checks the invoice using the label. 

    todo: refactot the jwt code etc as it is now being used in 2 places

    todo: send out confirmation emails
  
  
    =============================================================================================================================
    */
    this.checkLightningPaymemt = function checkLightningPaymemt(lightninglabel, res) {
        //note : we can get this from the databse or we can also use the label as it is a much smaller piece of code to work 
        //       with but this is fine for testing purposes
        //debug
        //console.log("ll"+lightninglabel);
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
        //set the method we want to call in this case create invoice
        const method = "ln_getinvoice";
        //create the Bearer header
        const authheaader = "Bearer " + token;
        //console.log(authheaader);
        const options = {
            url: cyphernodeurl + method + '/' + lightninglabel,
            headers: {
                'Authorization': authheaader
            }
        };
        //create the call back
        function callback(error, response, body) {
            //debug 
            //console.log(btcaddress)
            //console.log(body);
            if (!error && response.statusCode == 200) {
                //parse the response
                const info = JSON.parse(body);
                let invoices = info.invoices;
                //debug
                //console.log(invoices);
                if (invoices.length > 0) {
                    if (invoices[0].status == "paid") {
                        let data = [1, 1, lightninglabel];
                        //build the query
                        let sql = `UPDATE sessions SET processed = ? ,addresstype = ? WHERE lightninglabel = ? `;
                        //run the query
                        db.run(sql, data, function(err) {
                            if (err) {
                                return console.error(err.message);
                            }
                            //retun response
                            res.send(JSON.stringify({
                                status: 1
                            }));
                        });
                    } else {
                        res.send(JSON.stringify({
                            status: 0
                        }));
                    }
                } else {
                    res.send(JSON.stringify({
                        status: 0
                    }));
                }
            } else {
                //console.log(error);
                //you done messed up boi
                res.send(JSON.stringify({
                    status: 0
                }));
            }
        }
        //make the calls
        request.get(options, callback);
    }
    /*
    =============================================================================================================================

    This function checks for and unspent transcations in the wallet.  As we are in essence using this as a 
    hot wallet and creating a new address for each transaction (which we only use once) we can safely make 
    the assumpation that anything here is for the transaction.

    In the future we could detect over/under payments and deal with them gracefully but right now we want the flow to 
    be pretty simple.


    todo 

    update this to mirrot checksession function

    =============================================================================================================================

    */
    this.checkPayment = function checkBTCPayment(token, btcaddress, res) {
        //check if it has been processed
        let sqldata = [btcaddress];
        let sql = `select * from sessions where address = ?`;
        db.get(sql, sqldata, function(err, result) {
            if (err) {}
            //console.log(result)
            if (result.processed == 1) {
                res.send(JSON.stringify({
                    status: 1
                }));
            } else {
                //get the unspent transactions for the address we are intrested in.
                //note we could also update the sessions table to processed here if we want.
                client.listUnspent(1, 9999999, [address]).then(result => {
                    //debug
                    //console.log(result);
                    //console.log(result.length)
                    //note we only check the first one as should only use each address once but we can 
                    //easily update this to run through all the results to check for an active paymebt in
                    //the array
                    //check there is a result
                    if (result.length > 0) {
                        //check the confirmations (set int the env var)
                        //note we have set this to one for testing etc but you should up this if you it is going to be used 
                        //in any live enviorment.
                        if (result[0].confirmations >= process.env.CONFIRMATIONS) {
                            //valid
                            res.send(JSON.stringify({
                                status: 1
                            }));
                        } else {
                            //not valid
                            res.send(JSON.stringify({
                                status: 0
                            }));
                        }
                    } else {
                        res.send(JSON.stringify({
                            status: 0
                        }));
                    }
                });
            }
        });
    }
}
exports.webhook = webhook;