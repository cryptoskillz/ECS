
const Client = require('bitcoin-core');

const client = new Client(
  {   
    host: '127.0.0.1',
    port: 18332,
    username: 'test',
    password: 'test'
  }
);

client.estimateSmartFee(6).then((res) => {
  console.log(res)
});





  



