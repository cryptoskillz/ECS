//load express
const express = require("express");

//load SQLlite (use any database you want or none)
const sqlite3 = require("sqlite3").verbose();
//init it
//open a database connection
let db = new sqlite3.Database("./db/db.db", err => {
  if (err) {
    console.error(err.message);
  }
});
//load the shared functions
var helperfunctions = require('./api/helpers/sharedfunctions.js').HelperFunctions;
//init the helper functions.
var helper = new helperfunctions();
const app = express();

app.get("/backoffice/monitor", (req, res) => {
	res = helper.setHeaders(res);
	res.send(JSON.stringify({ results: "ok" }));
});



//console.log('up and at em ')
//set port not we use an env port so that the server we deploy to can set it to whatever port it wants.
//This is common practice in AWS I am not sure if all server providers use the same method.
//var port = process.env.PORT || 3000;
//listen
//app.listen(port);