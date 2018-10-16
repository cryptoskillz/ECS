
//load bitcoin core
const Client = require("bitcoin-core");
//open a connection to the RPC client
const client = new Client({
  host: "127.0.0.1",
  port: 18332,
  username: "test",
  password: "test"
});
/*
//run this once to encrypt your wallet id you have not already done so.
client.encryptWallet('test').then((res) => {
  console.log(res)
});
*/
//unlock the waller for 10 seconds
client.walletPassphrase("test", 10).then(() => {
  //create a new address in theaccount account :]
  client.getNewAddress("theaccount").then(address => {
    //debug
    console.log(address);
    //get the private key
    client.dumpPrivKey(address).then(privkey => {
      //debug
      console.log("privkey:" + privkey);

      //now have the prviate key we can sign transactions etc, basically do whatever we did with BitcooinJS
      //do stuff

      //lock the wallet 
      client.walletLock();

    });
  });
});


















  



