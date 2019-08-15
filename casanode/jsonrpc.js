let port = 3030;
let WALLETPASSPHRASE = 'uey7p9xCpDgEsAdbfM'
let NETWORK = 1
let RPCUSERNAME = 'casa'
let RPCPASSWORD = 'uey7p9xCpDgEsAdbfM'


const Client = require("bitcoin-core");

client = new Client({
    host: "203.150.152.68",
    port: 8333,
    username: RPCUSERNAME,
    password: RPCPASSWORD
});

//app.listen(PORT);

client.walletPassphrase(WALLETPASSPHRASE, 10).then(() => {
      //create a new address in theaccount account :]
      client.getBlockCount().then(count => {
        res.send(JSON.stringify({ status: "ok","count":count }));
      });
});