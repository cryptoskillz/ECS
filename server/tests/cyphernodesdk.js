/*
Note this is unfished code that  will be complered in the next article.


*/
//load dotenv to get accces to the vars in .env
const envs = require('dotenv').config();
process.env.CYPHERNODE_API_KEY='d3c4cc0021e42f6c9ca70567bf96390750582b43a8afede51349ddcb350cc438'
process.env.CYPHER_GATEWAY_URL="https://165.227.28.105:2009/v0/"
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;


console.log(process.env.NODE_TLS_REJECT_UNAUTHORIZED);
const {btcClient} = require('cyphernode-js-sdk');
const client = btcClient();
const balance = client.getBalance();
console.log(`Your balance is ${balance} bitcoins`);
