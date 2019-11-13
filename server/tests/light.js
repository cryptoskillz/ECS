/*
=========================================
START OF DOCKER INTERACTIONS
=========================================

This is a simple script to allow us easily interact with the different cyphernode docker images. 
It is a standalone script that is not require for ECS but allows to debug easily.

usage (from terminal)

node light.js <testid> <containderid>
node light.js 0 ded324549726 

if you just run node light.js you will get a list of all running containers which you can use as the second paramater.

*/
var dockerCLI = require('docker-cli-js');
var DockerOptions = dockerCLI.Options;
var Docker = dockerCLI.Docker;
var docker = new Docker()
var containerid = ""; //hold the image id (note some tests get this others you will have to set by running docker ps from the command line)
var testid = 0; // set the test id so we can run the various docker instances
//check if we have a contatinerid and if not show the ones to chose from.
if (process.argv[3] != undefined) containerid = process.argv[3];
else {
    console.log('no container id listing all containers use  "node light.js <testid>x <containerid> 2"');
    //list all the containers running. Copy the one you are interested in and pass it in as the first parameter.
    docker.command('ps').then(function(data) {
        console.log(data);
    })
    return;
}
/*
==============================================================
START OF DOCKER COMMANDS TO DIRECTLY INTERACT WITH C-LIGHTNING
==============================================================

There are the main lightning commands that we use as well as a 4th which can use to pass any command into to get the results.

*/
//get the passed in id (if there is one)
if (process.argv[4] != undefined) testid = process.argv[4];
//this test gets the Lightning info
if (testid == 0) {
    console.log('Ruuning getinfo:');
    docker.command('exec ' + containerid + ' lightning-cli --lightning-dir=.lightning getinfo', function(err, data) {});
}
//this funciton calls the newaddr function on the lightning cli
if (testid == 1) {
    console.log('Ruuning newaddr:');
    docker.command('exec ' + containerid + ' lightning-cli --lightning-dir=.lightning newaddr', function(err, data) {});
}
//this test calls the list funds method on the lightning cli
if (testid == 2) {
    console.log('Ruuning Listfunds:');
    docker.command('exec ' + containerid + ' lightning-cli --lightning-dir=.lightning listfunds', function(err, data) {});
}
//this runs any c-lightn ing command you pass to it
if (testid == 3) {
    console.log('Ruuning ' + process.argv[4] + ':');
    docker.command('exec ' + containerid + ' lightning-cli --lightning-dir=.lightning ' + process.argv[4], function(err, data) {});
}
/*
==============================================================
END OF DOCKER COMMANDS TO DIRECTLY INTERACT WITH C-LIGHTNING
==============================================================
*/
/*
==============================================================
START OF GENERIC DOCKER COMMANDS 
==============================================================
*/
//list all the images
if (testid == 4) {
    docker.command('images').then(function(data) {})
}
/*
==============================================================
END OF GENERIC DOCKER COMMANDS 
==============================================================
*/
/*
==============================================================
START OF DOCKER COMMANDS TO INTERACT WITH THE PROXY 
==============================================================

The tests are pretty much the same as the above but we are going through the proxy instead of the Lightning container directly.
*/
if (testid == 5) {
    //calling API
    docker.command('exec ' + containerid + ' curl   -H "content-type: text/plain;"  http://127.0.0.1:8888/getbalance', function(err, data) {});
}
if (testid == 6) {
    //lighting info
    docker.command('exec ' + containerid + ' curl   -H "content-type: text/plain;"  http://127.0.0.1:8888/ln_getinfo', function(err, data) {});
}
if (testid == 7) {
    docker.command('info', function(err, data) {});
}
/*
==============================================================
END OF DOCKER COMMANDS TO INTERACT WITH THE PROXY 
==============================================================
*/
/*
=========================================
END OF DOCKER INTERACTIONS
=========================================
*/