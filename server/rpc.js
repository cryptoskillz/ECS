
const express = require('express');

var bitcoin = require('bitcoin');
var client = new bitcoin.Client({
  host: 'localhost',
  port: 18332,
  user: 'test',
  pass: 'test'
});

client.getDifficulty(function(err, difficulty) {
  if (err) {
    return console.error(err);
  }

  console.log('Difficulty: ' + difficulty);
});

 const app = express();


var port = process.env.PORT || 3000;
app.listen( port );
  



