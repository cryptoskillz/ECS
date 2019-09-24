// config.js
const config = {
 bitcoin: {
   network: process.env.NETWORK
 },
 db: {
   host: 'localhost',
   port: 27017,
   name: 'db'
 }
};

//open a connection to the RPC client
const Client = require("bitcoin-core");
//we are working with isolated test and main nets so we removed the if here and get the vars from the .env file.
client = new Client({
  host: process.env.RPCHOST,
  port: process.env.RPCPORT,
  wallet: process.env.WALLET,
  username: process.env.RPCUSERNAME,
  password: process.env.RPCPASSWORD,

});



module.exports = config;
