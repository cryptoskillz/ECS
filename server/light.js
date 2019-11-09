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
var imageid;
//loop through the images
docker.command('ps').then(function(data) {
	//console.log('looking for id')
    //console.log(data)
    for (var p in data.containerList) {
        if (data.containerList[p].image == 'cyphernode/clightning:v0.7.1') {
            //console.log(data.containerList[p]['container id'])
            imageid = data.containerList[p]['container id'];
            console.log(imageid);
            docker.command('exec ' + imageid + ' lightning-cli --lightning-dir=.lightning invoice any label desc', function(err, data) {
                console.log('data = ', data.raw);
            });
        }
    }
});
/*

docker.command('images').then(function (data) {
	
//loop through the images
for (var p in data.images) {
	//look for lightning
	if (data.images[p].repository == 'cyphernode/clightning')
	{
		//console.log(data.images[p]['image id'])
		imageid = data.images[p]['image id'];
		console.log(imageid);
		docker.command('exec '+imageid+' curl   -H "content-type: text/plain;"  http://127.0.0.1:8888/ln_getinfo', function (err, data) 
		{
			console.log('data = ', data.raw);
		});
	}
 	
  }
 });

docker.command('ps').then(function (data) {
  for (var i = 0; i < data.length; i++)
  {
  }
});

docker.command('exec 89b35eae3333 curl   -H "content-type: text/plain;"  http://127.0.0.1:8888/ln_getinfo', function (err, data) 
{
	console.log('data = ', data.raw);
});


docker.command('network ls').then(function (data) {
  console.log('data = ', data);
});


docker.command('exec 89b35eae3333 lightning-cli --lightning-dir=.lightning getinfo', function (err, data) 
{
	console.log('data = ', data);
});


/*
//calling API
docker.command('exec eaf667a5b8be curl   -H "content-type: text/plain;"  http://127.0.0.1:8888/getbalance', function (err, data) 
{
	console.log('data = ', data.raw);
});




//lighting info
docker.command('exec 89b35eae3333 curl   -H "content-type: text/plain;"  http://127.0.0.1:8888/ln_getinfo', function (err, data) 
{
	console.log('data = ', data.raw);
});



docker.command('info', function (err, data) {
    console.log('data = ', data);
  });

*/