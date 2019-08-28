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

console.log('config')
console.log(process.env.NETWORK )

//open a connection to the RPC client
const Client = require("bitcoin-core");
if (process.env.NETWORK == 1)
{
  client = new Client({
    host: process.env.RPCHOSTTEST,
    port: 18332,
    wallet: process.env.WALLET,
    username: process.env.RPCUSERNAMETEST,
    password: process.env.RPCPASSWORDTEST,

  });
}

if (process.env.NETWORK == 2)
{
  client = new Client({
    host: process.env.RPCHOSTLIVE,
    port: 8332,
    wallet: process.env.WALLET,
    username: process.env.RPCUSERNAMELIVE,
    password: process.env.RPCPASSWORDLIVE
  });
}


module.exports = config;
