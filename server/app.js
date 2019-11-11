//check the process env vars
require('dotenv').config();
//load express
const express = require("express");
const bodyParser = require('body-parser');
//include the version package
require('pkginfo')(module, 'version', 'name', 'description');
//load the generic functions
var generichelper = require('./api/helpers/generic.js').Generic;
var generic = new generichelper();
//init it
const app = express();
app.use(bodyParser.json());
app.get("/", (req, res) => {
    let output = module.exports.name + ": " + module.exports.version;
    if (process.env.NETWORK == 2) output = output + ' connected to BTC mainnet '
    if (process.env.NETWORK == 1) output = output + ' connected to BTC testnet'
    res.send(JSON.stringify({
        status: output
    }));
});
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
    backoffice.test(req, res);
});
/*
==============================
END OF BACKOFFICE ROUTING
=============================
*/
/*
==============================
START OF TIMER FUNCTIONS
=============================
*/
function checkforPayment() {
    //set the headers
    //res = generic.setHeaders(res);
    //load the api helper
    let apihelper = require('./api/helpers/api.js').api;
    let api = new apihelper();
    //call the login function
    //console.log('tick')
    api.checksessionforpayment();
}
/*
check if we want to do auto payment, we use this to handle the payments in the SASS mode.  

It is disabled at the moment in time as it is causing time out error and some DB errors between test and mainnet. 


*/
//debug
//checkforPayment();
if (process.env.AUTOPAYMENT == 1) setInterval(checkforPayment, process.env.AUTOPAYMENTTICK);
if (process.env.LIGHTNING == 1) {
    /*

    todo

    check for funded channels
    check for address to fund channel

    */
}
/*
==============================
END OF TIMER FUNCTIONS
=============================
*/
/*
========================
START OF WEBHOOK FUNCTION
========================
*/
/*
This function is used to create a check function to check if a payment has been made

At present I use the bitcoin wallet to check the address for confirmations.  We could also 
use the flags processed and swept in the session table if we wanted but it is not really essential.
because we are using the wallet to check it can only check on addresses that it created which is fine
but if we wanted to make it very generic and check any address we could use the block.io code we have to do 
that.

The usage for this function is so that the sr.js can check for payments and update the UI accordingly if it finds 
a sucessful payment. 


*/
app.get("/webhook/checkpayment", (req, res) => {
    //debug
    //console.log(req.body.data.payment_request)
    //res.send(JSON.stringify({ status: "ok" }));//return;
    //set the headers
    res = generic.setHeaders(res);
    //right now we only check the address is there we could also check token if we wanted to 
    //but it is read only so not overly concerened with doing this. 
    if ((req.query.address == undefined) || (req.query.address == '')) {
        res.send(JSON.stringify({
            error: "no address"
        }));
        return;
    }
    //load the webhook helper helper
    let webhookhelper = require('./api/helpers/webhook.js').webhook;
    let webhook = new webhookhelper();
    //check for payment
    webhook.checkPayment(req.query.token, req.query.address, res);
});
/*
========================
END OF WEBHOOK FUNCTION
========================
*/
/*
========================
START OF ADMIN FUNCTION
========================
*/
//update the settings
app.get("/admin/getusers", (req, res) => {
    //set the headers
    res = generic.setHeaders(res);
    //check if it is a zero and if so return error
    //todo : check for duplicate address and validate the btc adddress
    //load the admin helper
    let adminhelper = require('./api/helpers/admin.js').admin;
    let admin = new adminhelper();
    //add the cold storage address
    admin.getUsers(res);
});
//update the settings
app.get("/admin/updatesettings", (req, res) => {
    //set the headers
    res = generic.setHeaders(res);
    //check if it is a zero and if so return error
    //todo : check for duplicate address and validate the btc adddress
    if ((req.query.address == undefined) || (req.query.address == '')) {
        res.send(JSON.stringify({
            error: "no address"
        }));
        return;
    }
    //load the admin helper
    let adminhelper = require('./api/helpers/admin.js').admin;
    let admin = new adminhelper();
    //add the cold storage address
    admin.addColdStorageAddress(req.query.token, req.query.address, res);
});
//return the admin settings
app.get("/admin/deletesettingsaddress", (req, res) => {
    //set the headers
    res = generic.setHeaders(res);
    //check if it is a zero and if so return error
    if ((req.query.address == undefined) || (req.query.address == '')) {
        res.send(JSON.stringify({
            error: "no address"
        }));
        return;
    }
    //load the admin helper
    let adminhelper = require('./api/helpers/admin.js').admin;
    let admin = new adminhelper();
    admin.deleteColdStorageAddress(req.query.address, res)
});
//return the admin settings
app.get("/admin/settings", (req, res) => {
    //set the headers
    res = generic.setHeaders(res);
    //load the admin helper
    let adminhelper = require('./api/helpers/admin.js').admin;
    let admin = new adminhelper();
    //get the settings
    admin.getSettings(req.query.token, res);
});
//orders
app.get("/admin/order", (req, res) => {
    //set the headers
    res = generic.setHeaders(res);
    //check if it is a zero and if so return error
    if ((req.query.address == undefined) || (req.query.address == '')) {
        res.send(JSON.stringify({
            error: "no address"
        }));
        return;
    }
    //load the admin helper
    let adminhelper = require('./api/helpers/admin.js').admin;
    let admin = new adminhelper();
    //get the products
    admin.getOrder(req.query.address, res);
});
//return a list of payments
app.get("/admin/payments", (req, res) => {
    //set the headers
    res = generic.setHeaders(res);
    //load the admin helper
    let adminhelper = require('./api/helpers/admin.js').admin;
    let admin = new adminhelper();
    //call the get orders function
    admin.getPayments(req.query.token, res);
});
//return a list of payments
app.get("/admin/deletepayment", (req, res) => {
    //set the headers
    res = generic.setHeaders(res);
    //load the admin helper
    let adminhelper = require('./api/helpers/admin.js').admin;
    let admin = new adminhelper();
    //call the get orders function
    admin.deletePayment(req.query.address, res);
});
//login the user in
app.get("/admin/login", (req, res) => {
    //set the headers
    res = generic.setHeaders(res);
    //load the admin helper
    let adminhelper = require('./api/helpers/admin.js').admin;
    let admin = new adminhelper();
    //call the login function
    admin.login(req.query.uname, req.query.pass, res);
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
    api.monitor(req.query.address, res);
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
    api.sweep(req.query.address, res);
});
//generate an address and output it called rom sr.js
app.get("/api/address", (req, res) => {
    //debug
    //generic.test();
    //set the headers
    res = generic.setHeaders(res);
    //load the api helper
    let apihelper = require('./api/helpers/api.js').api;
    let api = new apihelper();
    //call the login function
    api.generateAddress(req.query, res);
});
//store user details called from sr.js
app.get("/api/storeuserdetails", (req, res) => {
    //set the headers
    res = generic.setHeaders(res);
    //load the api helper
    let apihelper = require('./api/helpers/api.js').api;
    let api = new apihelper();
    //call the login function
    api.storeUserDetails(req, res);
});
//storeproduct  called rom sr.js
app.get("/api/storeproduct", (req, res) => {
    //set the headers
    res = generic.setHeaders(res);
    //load the api helper
    let apihelper = require('./api/helpers/api.js').api;
    let api = new apihelper();
    //call the login function
    api.storeProduct(req, res);
});
//storeproduct  called rom sr.js
app.get("/api/adduser", (req, res) => {
    //set the headers
    res = generic.setHeaders(res);
    //load the api helper
    let apihelper = require('./api/helpers/api.js').api;
    let api = new apihelper();
    //call the login function
    api.addUser(req, res);
});
/*
========================
END OF API FUNCTIONS
========================
*/
//console.log('up and at em ')
//set port not we use an env port so that the server we deploy to can set it to whatever port it wants.
//This is common practice in AWS I am not sure if all server providers use the same method.
//note as we are passing this as process env we have to make sure this is set on the server
var port = process.env.PORT
//display a message to the console.
console.log(module.exports.description + ' is listenting :]');
console.log(module.exports.name + ": " + module.exports.version);
console.log('listenting on port:' + port)
if (process.env.NETWORK == 2) console.log('connected to BTC mainnet')
if (process.env.NETWORK == 1) console.log('connected to BTC testnet')
if (process.env.LIGHTNING == 0) console.log('Not using Lightning ')
else console.log('Using Lightning')
//listen
app.listen(port);