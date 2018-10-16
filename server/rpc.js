
const Client = require('bitcoin-core');

const client = new Client(
  {   
    host: '127.0.0.1',
    port: 18332,
    username: 'test',
    password: 'test'
  }
);

/*
//estimate a fee
client.estimateSmartFee(6).then((res) => {
  console.log(res)
});

//get a balance
client.getReceivedByAddress("2N3Xtg7pBjUG4RPaiwfc2t3wftvLGWv6i2K").then((res) => {
  console.log(res)
});

//get uncofirmed balance
client.getUnconfirmedBalance().then((res) => {
  console.log(res)
});


//get uncofirmed balance
client.getNewAddress().then((res) => {
  console.log(res)
});


//get the account
client.getAccount("2N3Xtg7pBjUG4RPaiwfc2t3wftvLGWv6i2K").then((res) => {
  console.log(res)
});

//get the account
client.getAccount("2N3Xtg7pBjUG4RPaiwfc2t3wftvLGWv6i2K").then((res) => {
  console.log(res)
});

//get the private key for the address
client.dumpPrivKey("2NDqhxGQ4rm2F58XKUiPMmVAyB7TZaFqyf8").then((res) => {
  console.log(res)
});

//generate a new address
client.getNewAddress().then((address) => {
  //get the private key
  client.dumpPrivKey(address).then((privkey) => {
    console.log("address:"+address);
    console.log("private key:"+privkey);
  });
});

//get the account
client.listAccounts().then((res) => {
  console.log(res)
});

//get the account
//looks like this now alwats requires a bitcoin address
client.getAccountAddress('theaccount').then((res) => {
  console.log(res)
});

client.getAddressesByAccount("theaccount").then((res) => {
  console.log(res)
});


client.getWalletInfo().then((res) => {
  console.log(res)
});


client.encryptWallet('test').then((res) => {
  console.log(res)
});




client.walletPassphrase("test",10).then((res) => {
  console.log(res)
});


//get the private key for the address
client.dumpPrivKey("2NDqhxGQ4rm2F58XKUiPMmVAyB7TZaFqyf8").then((res) => {
  console.log(res)
});

client.getNewAddress("theaccount").then((address) => {
  console.log(address)
});

*/






/*
   we can get the pivate key for any wallet this address created allowing us to sign and do all the other good stuff without having to store pricate keys and 
   all that good stuff first. then pleases me.
*/



client.walletPassphrase("test",10).then(() => {
  client.getAddressesByAccount("theaccount").then((address) => {
    console.log(address)
    client.dumpPrivKey(address[0]).then((privkey) => {
      console.log('privkey:'+privkey)
    });
  });
  
});






















  



