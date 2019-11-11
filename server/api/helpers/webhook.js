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

    This function checks for and unspent transcations in the wallet.  As we are in essence using this as a 
    hot wallet and creating a new address for each transaction (which we only use once) we can safely make 
    the assumpation that anything here is for the transaction.

    In the future we could detect over/under payments and deal with them gracefully but right now we want the flow to 
    be pretty simple.


    todo 

    update this to mirrot checksession function

    =============================================================================================================================

    */
    this.checkPayment = function checkPayment(token, address, res) {
        //check if it has been processed
        let sqldata = [address];
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