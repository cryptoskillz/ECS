
//load commander
const program = require('commander');
const bitcoin = require("bitcoinjs-lib");
const bip39 = require('bip39');
const bip32 = require('bip32')
const network = bitcoin.networks.testnet
program
  .version('0.0.1')
  .description('Generate Address');
//get the balance of the account.
program
.command('generate <mnemonic> <number>')
  .alias('a')
  .description('generate addresses')
  .action((mnemonic,number) => {
    //validate the menmonic
    var res = bip39.validateMnemonic(mnemonic);
    if (res != false)
    {
      //generate a seed
      const seed = bip39.mnemonicToSeed(mnemonic)
      //set root
      var root = bip32.fromSeed(seed);
      //debug
      //console.log(root)
      
      //set the counter
      var i = 0;
      //start the loop
      while (i < number)
      {
        //user derive path to get a child
        child = root.derivePath('m/0/'+i);
        //debug
        //console.log(child);

        //todo : check if there is any activity in this child and if not store otherwise get the next one in the sequence.

        //get the address
       

        //var address = bitcoin.payments.p2wpkh({ pubkey: child.publicKey, network }).address

        var address =   bitcoin.payments.p2sh(
            {redeem: bitcoin.payments.p2wpkh(
              { pubkey: child.publicKey,network}
            ),network}
          ).address
        //bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey })
        //debug
        console.log(address)
        i++;
      }
    }
  });
program.parse(process.argv);