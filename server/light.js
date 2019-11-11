

/*
=========================================
START OF DOCKER INTERACTIONS
=========================================
*/
var dockerCLI = require('docker-cli-js');
var DockerOptions = dockerCLI.Options;
var Docker = dockerCLI.Docker;
var docker = new Docker()
var imageid = "30f630c12a87"; //hold the image id (note some tests get this others you will have to set by running docker ps from the command line)
if (process.argv[2] != undefined) imageid = process.argv[2];
else {
    console.log('no container id for c-lightning set run command docker ps and the add it is the first argv I.E "node light.js 12345 2"');
    return;
}
var testid = 0; // set the test id so we can run the various docker instances
//get the passed in id (if there is one)
if (process.argv[3] != undefined) testid = process.argv[3];
//this test gets the Lightning info
if (testid == 0) {
    console.log('Ruuning getinfo:');
    docker.command('exec ' + imageid + ' lightning-cli --lightning-dir=.lightning getinfo', function(err, data) {
        console.log('data = ', data);
    });
}
//this funciton calls the newaddr function on the lightning cli
if (testid == 1) {
    console.log('Ruuning newaddr:');
    docker.command('exec ' + imageid + ' lightning-cli --lightning-dir=.lightning newaddr', function(err, data) {
        console.log('data = ', data);
    });
}
//this test calls the list funds method on the lightning cli
if (testid == 2) {
    console.log('Ruuning Listfunds:');
    docker.command('exec ' + imageid + ' lightning-cli --lightning-dir=.lightning listfunds', function(err, data) {
        console.log('data = ', data);
    });
}

/*
=========================================
END OF DOCKER INTERACTIONS
=========================================
*/

/*
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
                console.log('data = ', data);
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


;


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