/*
Is this still required?
Audit it
*/

//load commander
const program = require("commander");
const bitcoin = require("bitcoinjs-lib");
const bip39 = require("bip39");
const bip32 = require("bip32");
//set up block.io
var BlockIo = require("block_io");
var version = 2; // API version
var block_io = new BlockIo(
  process.env.blockiokey,
  process.env.blockiosecret,
  version
);
const network = bitcoin.networks.testnet;


console.log(process.env.blockiokey)
program.version("0.0.1").description("Generate Address");
//get the balance of the account.
program
  .command("generate <mnemonic> <number>")
  .alias("a")
  .description("generate addresses")
  .action((mnemonic, number) => {
    //validate the menmonic
    var res = bip39.validateMnemonic(mnemonic);
    //debug
    //console.log(res);

    if (res != false) {
      //generate a seed
      const seed = bip39.mnemonicToSeed(mnemonic);
      //debug
      //console.log(seed);

      //set root
      var root = bip32.fromSeed(seed);
      //debug
      //console.log(seed);
      //console.log(root);

      //recursive generate address function
      function generateAddress(root, addressIndex) {
        //console.log(root);
        //user derive path to get a child
        //research
        child = root.derivePath("m/0/" + addressIndex);
        //debug
        //console.log(child);

        //generate a segwit address
        //research
        var address = bitcoin.payments.p2sh({
          redeem: bitcoin.payments.p2wpkh({ pubkey: child.publicKey, network }),
          network
        }).address;
        //debug
        //console.log(address)

        //debug we know this has been sent funs so it will skip this and move the index on
        //if (addressIndex == 5)
        //  address = "2Mx1TYm5J87WQAuqo4SBMQZJZLRPNjg716N"

        //use block.io to see if this address has been used.
        //note: when we get to the hardware wallet code we will remove this dependency at the moment this is the
        //      only we can check if an address has been used as the block chain does not have the ability for us to
        //      check and address for transactions.  I assume block.io are storing an indexed database to allow this
        //      functionality.  We could check our own database of course but that is not as good as the block.io method.
        block_io.get_transactions(
          { type: "received", address: address },
          function(error, data) {
            //debug
            //console.log(data)

            //move on the index
            addressIndex++;
            //check for transaxtions
            if (data.data.txs.length == 0) {
              //output the address as it has never been used
              console.log(address);
              //check if we are under the number of requested addresses and call the function again if this is the case.
              if (addressIndex <= number) generateAddress(root, addressIndex);
            } else {
              //call the function to get  new address as this one had some transactions.
              generateAddress(root, addressIndex);
            }
          }
        );
      }
      console.log(
        "Generating " + number + " of addresses starting from index 0"
      );
      //call the generate address function
      generateAddress(root, 0);
    }
  });
program.parse(process.argv);