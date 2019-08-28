
const CLightning = require('clightning-rpc')

const client = new CLightning('.lightning')

//Returns Promises. No Callbacks (It is 2018)
/*
client.listNodes()
.then(nodes => {
    console.log(nodes)
})
.catch(e => {
    console.log(e)
})
*/
var dockerCLI = require('docker-cli-js');
var DockerOptions = dockerCLI.Options;
var Docker = dockerCLI.Docker;
var docker = new Docker()
/*
docker.command('exec 99a7103d7ab9 lightning-cli --lightning-dir=.lightning getinfo', function (err, data) 
{
	console.log('data = ', data);
});
*/

//calling API
docker.command('exec eaf667a5b8be curl   -H "content-type: text/plain;"  http://127.0.0.1:8888/getbalance', function (err, data) 
{
	console.log('data = ', data.raw);
});





//lighting info
docker.command('exec eaf667a5b8be curl   -H "content-type: text/plain;"  http://127.0.0.1:8888/ln_getinfo', function (err, data) 
{
	console.log('data = ', data.raw);
});



docker.command('info', function (err, data) {
    console.log('data = ', data);
  });

 
 