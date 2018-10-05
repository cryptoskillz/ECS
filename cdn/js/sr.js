/*
**=========================
*START OF GENERIC FUNCTIONS
*=========================
*/

function addClass(elements, myClass) {

  // if there are no elements, we're done
  if (!elements) { return; }

  // if we have a selector, get the chosen elements
  if (typeof(elements) === 'string') {
    elements = document.querySelectorAll(elements);
  }

  // if we have a single DOM element, make it an array to simplify behavior
  else if (elements.tagName) { elements=[elements]; }

  // add class to all chosen elements
  for (var i=0; i<elements.length; i++) {

    // if class is not already found
    if ( (' '+elements[i].className+' ').indexOf(' '+myClass+' ') < 0 ) {

      // add class
      elements[i].className += ' ' + myClass;
    }
  }
}

function removeClass(elements, myClass) {

  // if there are no elements, we're done
  if (!elements) { return; }

  // if we have a selector, get the chosen elements
  if (typeof(elements) === 'string') {
    elements = document.querySelectorAll(elements);
  }

  // if we have a single DOM element, make it an array to simplify behavior
  else if (elements.tagName) { elements=[elements]; }

  // create pattern to find class name
  var reg = new RegExp('(^| )'+myClass+'($| )','g');

  // remove class from all chosen elements
  for (var i=0; i<elements.length; i++) {
    elements[i].className = elements[i].className.replace(reg,' ');
  }
}

function changeClassText(elements, value) {

  // if there are no elements, we're done
  if (!elements) { return; }

  // if we have a selector, get the chosen elements
  if (typeof(elements) === 'string') {
    elements = document.querySelectorAll(elements);
  }

  // if we have a single DOM element, make it an array to simplify behavior
  else if (elements.tagName) { elements=[elements]; }

  // add class to all chosen elements
  for (var i=0; i<elements.length; i++) {
      elements[i].innerHTML = value;
  }
}

function hasClass(elements, value) {
  // if there are no elements, we're done
  if (!elements) { return; }

  // if we have a selector, get the chosen elements
  if (typeof(elements) === 'string') {
    elements = document.querySelectorAll(elements);
  }

  // if we have a single DOM element, make it an array to simplify behavior
  else if (elements.tagName) { elements=[elements]; }

  //loop the elements
  for (var i=0; i<elements.length; i++) {
  		//check if it is the one
  		//debug
  		//console.log(elements[i].className)
  		//console.log(value);
  		if (elements[i].className.indexOf(value) !=-1) 
      	{
      		return(1);
      	}
  }
  return(0);
}

function hideClass(elements) 
{
	// if there are no elements, we're done
	if (!elements) { return; }

	// if we have a selector, get the chosen elements
	if (typeof(elements) === 'string') {
	elements = document.querySelectorAll(elements);
	}

	// if we have a single DOM element, make it an array to simplify behavior
	else if (elements.tagName) { elements=[elements]; }

	//loop the elements
	for (var i=0; i<elements.length; i++) 
	{
		elements[i].style.display="none";      	
	}
}

function showClass(elements) 
{
	// if there are no elements, we're done
	if (!elements) { return; }

	// if we have a selector, get the chosen elements
	if (typeof(elements) === 'string') {
	elements = document.querySelectorAll(elements);
	}

	// if we have a single DOM element, make it an array to simplify behavior
	else if (elements.tagName) { elements=[elements]; }

	//loop the elements
	for (var i=0; i<elements.length; i++) 
	{
		elements[i].style.display="block";      	
	}
}

/*
*=========================
*END OF GENERIC FUNCTIONS
*=========================
*/


var SR = SR || (function(){

	var _args = {}; // private
    var itemcount = 0;
    //set url to production
	var serverurl = "http://srcryptoapi.eu-west-1.elasticbeanstalk.com/";
	var cdnurl = 'http://s3.eu-west-1.amazonaws.com/srcrypto/';
	//var cdnurl = '../cdn/';
	//check if we are local
	//note : set this whatever your local instance is 127.0.0.1 for example
	if(window.location.href.indexOf("srcryptowww") > -1) 
	{
		serverurl = "http://127.0.0.1:3000/";
	}
	//hold the animating flag
	var animating = false;

	//build the cart and hide it
    var carthtml = '';
    carthtml = carthtml +'<div class="cd-cart-container" style="display:none">';
    carthtml = carthtml +'<a href="#0" class="cd-cart-trigger">';
    carthtml = carthtml +'Cart';
    carthtml = carthtml +'<span class="cd-count">0</span>';
    carthtml = carthtml +'</a>';
    carthtml = carthtml +'<div class="cd-cart">';
    carthtml = carthtml +'<div class="wrapper">';
    carthtml = carthtml +'<header>';
    carthtml = carthtml +'<h2>Cart</h2>';
    carthtml = carthtml +'<span class="bitcoinback" ><a id="checkoutbitocoin" href="#0">Back</a></span>';
    carthtml = carthtml +'</header>';
	carthtml = carthtml +'<div class="body">';
	carthtml = carthtml +'<ul id="cartlistitems">';
	carthtml = carthtml +'</ul>';
	carthtml = carthtml +'<div id="bitcoinaddresswrapper"><div>';
	carthtml = carthtml +'<a id="bitcoinaddress" class="bitcoinaddress" href=""></a>';
	carthtml = carthtml +'</div>';
	carthtml = carthtml +'<div class="bitcoinoptions" >';
	carthtml = carthtml +'<a href="#" class="bitcoinaddresscopy">';
	carthtml = carthtml +'<i class="fa fa-copy"></i>';
	carthtml = carthtml +' Copy';
	carthtml = carthtml +'</a>';
	carthtml = carthtml +'<a href="bitcoin:2N3Xtg7pBjUG4RPaiwfc2t3wftvLGWv6i2K" class="">';
	carthtml = carthtml +'<i class="fa fa-btc"></i>';
	carthtml = carthtml +'Pay from wallet';
	carthtml = carthtml +'</a>';
	carthtml = carthtml +'</div>';
	carthtml = carthtml +'<img id="bitcoinqrcode" src="" />';
	carthtml = carthtml +'</div>';
	carthtml = carthtml +'</div>';
	carthtml = carthtml +'<footer><a href="#0" class="checkout btn"><em>Checkout - $<span>0</span></em></a></footer>';
	carthtml = carthtml +'</div>';
	carthtml = carthtml +'</div>';
	carthtml = carthtml +'</div>';
	//add it to the dom
	document.body.insertAdjacentHTML("beforeend", carthtml);



	//add to cart click element
	var elem = document.getElementsByClassName('.cd-add-to-cart');
	document.querySelector('.cd-add-to-cart').addEventListener('click', function () 
	{
		//get details
		var name = 'lll';
		var price = '66.88';
		var productid = 1;
		var previewpic = '';

		//increment count (quantity)
  		itemcount = itemcount+1;
  		//show it
  		showClass(document.querySelector('.cd-cart-container'))	
	  	
	  	//add item to cart
	  	var productlist = document.getElementById('cartlistitems');
		var itemlist  = document.createElement('li');
		itemlist.className = 'product ';

		//build produt
		var prodcuthtml = '';
		//product image		
		var prodcuthtml = prodcuthtml +'<div class="product-image"><a href="#0"><img src="img/product-preview.png" alt="placeholder"></a></div>';
		//product name
		prodcuthtml = prodcuthtml + '<div class=""><h3><a href="#0">'+name+'</a></h3>';
		//product price
		prodcuthtml = prodcuthtml + '<span class="price">$'+price+'</span>';
		//actions div
		prodcuthtml = prodcuthtml + '<div class="actions">';

		//delete option
		prodcuthtml = prodcuthtml + '<a href="#0" class="delete-item">Delete</a>';
		prodcuthtml = prodcuthtml + '<div class="quantity">';
		//quantity label
		prodcuthtml = prodcuthtml + '<label for="cd-product-'+ productid +'">Qty</label>';
		//quantity select
		prodcuthtml = prodcuthtml + '<span class="select"><select id="productquantity" name="productquantity">';
		var i = 0;
		for (i = 1; i < 11; i++) 
		{ 
			if (i == itemcount)
				prodcuthtml = prodcuthtml +'<option value="'+i+'" selected>'+i+'</option>';

			else
				prodcuthtml = prodcuthtml +'<option value="'+i+'">'+i+'</option>';
		}
		prodcuthtml = prodcuthtml +'</select></span>';
		//end of quantiy div
		var prodcuthtml = prodcuthtml + '</div>';
		//end of actions div
		var prodcuthtml = prodcuthtml + '</div>';
		//end of products details div
		var prodcuthtml = prodcuthtml + '</div>';
		//end of product div
		//add to the list		
		itemlist.innerHTML = prodcuthtml;
		// append  to the end of theParent
		productlist.innerHTML = "";
		productlist.appendChild(itemlist);
  		//update counter
  		changeClassText(document.querySelector('.cd-count'),itemcount);

	});

	//cart clicked element
	var elem = document.getElementsByClassName('.cd-add-to-cart');
	document.querySelector('.cd-cart-trigger').addEventListener('click', function () {
  		//check if cart shoud be shown
  		//debug
  		//itemcount = 1;
  		if (itemcount == 0)
  		{
  			//always remove as its 0
  			removeClass(document.querySelector('.cd-cart-container'),'cart-open');
  			
  		}
  		else
  		{
  			//see if the cart is open and toggle it
  			var res = hasClass(document.querySelector('.cd-cart-container'),'cart-open');
  			if (res == 1)
  			{
  				//close it
  				removeClass(document.querySelector('.cd-cart-container'),'cart-open');
  			}
  			else
  			{
  				//hide back element
  				hideClass(document.querySelector('.bitcoinback'))
  				//hide btc stuff
  				hideClass(document.getElementById('bitcoinaddresswrapper'));
  				//open it
  				addClass(document.querySelector('.cd-cart-container'),'cart-open');
  				
  			}
  			
  		}
	});


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

			    //load the CSS
			    document.head.innerHTML = document.head.innerHTML +'<link href="'+cdnurl+'css/sr.css" rel="stylesheet">'

			  } 
			  else
			  {
			    // We reached our target server, but it returned an error

			  }
			};

			request.onerror = function() {
			  // There was a connection error of some sort
			};
			request.send();

        }
    };
}());