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
if (process.env.NETWORK == 1)
{
  client = new Client({
    host: "127.0.0.1",
    port: 18332,
    username: process.env.RPCUSERNAME,
    password: process.env.RPCPASSWORD
  });
}

if (process.env.NETWORK == 2)
{
  client = new Client({
    host: "127.0.0.1",
    port: 8332,
    username: process.env.RPCUSERNAME,
    password: process.env.RPCPASSWORD
  });
}


module.exports = config;
