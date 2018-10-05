//https://stackoverflow.com/questions/2190801/passing-parameters-to-javascript-files
/*
function sr_init()
{
	alert('yay');
}


window.onload = function(e)
{ 
	sr_init();
}
*/
var SR = SR || (function(){
    var _args = {}; // private
    //set url to production
	var serverurl = "http://srcryptoapi.eu-west-1.elasticbeanstalk.com/";
	//check if we are local
	//note : set this whatever your local instance is 127.0.0.1 for example
	if(window.location.href.indexOf("srcryptowww") > -1) 
	{
		serverurl = "http://127.0.0.1:3000/";
	}
	//hold the animating flag
	var animating = false;
	//init price var
	var productPrice = 0;
	var cartWrapper = document.getElementsByClassName('.cd-cart-container');
	//set the cart wrapper
	var productCustomization = document.getElementsByClassName('.cd-customization');
	//set the cart
	var cart = document.getElementsByClassName('.cd-cart');

    return {
        init : function(Args) {
        	/*

        	Server vars you can pass set to "" to ignore
        	0 = server url. string
        	1 = animating.  True or false

        	*/

			_args = Args;

			//override the server url
			if (_args[0] != '')
			{
				serverurl = _args[0];
				//alert(serverurl);
			}
				//check if it is a boolean and if so then set it.
			if (typeof(_args[1]) === "boolean")
			{
				animating = _args[1]
			}

			//get an address
			var request = new XMLHttpRequest();
			request.open('GET', serverurl+"api/address", true);
			//call it
			request.onload = function() {
			  if (request.status >= 200 && request.status < 400) {
			    // parse the data
			    var data = JSON.parse(request.responseText);
			    //debug
			    //console.log(data)

			    //set the address
			    address = data.address;
			    //set the address in the checkout
			    var elbtcaddress = document.getElementById('bitcoinaddress');
			    //set the href
			    elbtcaddress.setAttribute('href', "bitcoin:"+address);
			    //set the address
        		elbtcaddress.innerText =address;
        		//debug
			    //console.log(elbtcaddress)

			    //generate the qr code
			    var elbtcqr = document.getElementById('bitcoinqrcode');
				elbtcqr.setAttribute('src', "https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl="+address);
		    	//debug
			    //console.log(elbtcqr)

			  } else {
			    // We reached our target server, but it returned an error

			  }
			};

			request.onerror = function() {
			  // There was a connection error of some sort
			};
			request.send();

        }
        /*
			example adding functions
        ,
        helloWorld : function() {
        	//if (_args[0]
        	///alert(serverurl);
            //alert('Hello World! -' + _args[0]);
        }
        */
    };
}());