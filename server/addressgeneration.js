

//load commander
const program = require('commander');
const bitcoin = require("bitcoinjs-lib");
const bip39 = require('bip39');
const bip32 = require('bip32')
const network = bitcoin.networks.testnet



//set a schema array
var schema = [];
//basic counter
var i = 0;
program
  .version('0.0.1')
  .description('Generate Address');

//get the balance of the account.
program
.command('generate <mnemonic> <number>')
  .alias('a')
  .description('generate addresses')
  .action((mnemonic,number) => {

    console.log(mnemonic.toString())
    
    var res = bip39.validateMnemonic(mnemonic);
    if (res != false)
    {
      
      const seed = bip39.mnemonicToSeed(mnemonic)
      const root = bip32.fromSeed(seed);
      var i = 0;
      while (i < number)
      {
        const address = bitcoin.payments.p2pkh({ pubkey: root.publicKey, network }).address
        //const address = bitcoin.payments.p2pkh({ pubkey: root, network }).address
        //debug
        //console.log(res);
        //console.log(seed);
        //console.log(root.network.bip32.private);
        console.log(address); 
        i++;      
      }
     
    }
    

    /*
    const seed = bip39.mnemonicToSeed(mnemonic)
    const root = bip32.fromSeed(seed)

    // receive addresses
    assert.strictEqual(getAddress(root.derivePath("m/0'/0/0")), '1AVQHbGuES57wD68AJi7Gcobc3RZrfYWTC')
    console.log(bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address)
    */

  });

program.parse(process.argv);