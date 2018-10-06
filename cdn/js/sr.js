/*
**=========================
*START OF GENERIC FUNCTIONS
*=========================


todo :

clean up css 
all functions inside the namespace

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
		elements[i].style.display="";      	
	}
}



/*
*=========================
*END OF GENERIC FUNCTIONS
*=========================
*/

	var itemcount = 0;
	var price = '';
	var name = '';
	var address = '';
	var uid = '';
	//server url
	var serverurl = "http://srcryptoapi.eu-west-1.elasticbeanstalk.com/";
	var cdnurl = 'http://s3.eu-west-1.amazonaws.com/srcrypto/';
	

	function deleteitem()
	{
		itemcount = 0;
		var productlist = document.getElementById('cartlistitems');
		productlist.innerHTML = "";
		carttotal();
		//close it
  		removeClass(document.querySelector('.cd-cart-container'),'cart-open');
	}

	function changequantity()
	{
		var elquantity = document.getElementById('productquantity');
		itemcountq = elquantity.options[elquantity.selectedIndex];
		itemcount = parseInt(itemcountq.value);
		carttotal();		
	}

	function carttotal()
	{
		
		var producttotal = price * itemcount;
		producttotal = parseFloat(producttotal).toFixed(8);
		changeClassText(document.getElementById('checkouttotal'),producttotal);
		//update counter
	  	changeClassText(document.querySelector('.cd-count'),itemcount);	
	  	//store product
		var url = serverurl+"api/storeproduct?name="+name+"&quantity="+itemcount+"&address="+address+"&price="+price;
		fetchurl(url,'storeproduct')

	}

	function fetchurl(url,method)
	{
		var request = new XMLHttpRequest();
		request.open('GET',url, true);
		//call it
		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    // parse the data
		    var data = JSON.parse(request.responseText);
		    //debug
		    //console.log(data)

		    if (method == "getaddress")
		    {
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
		    }
		    if (method == "storeproduct")
		    {
		    	//do stuff if you want.
		    }

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




	var SR = SR || (function()
	{




	function cartstate(state)
	{
		

		/*
			1 = show cart product details
			2 = show customer details screen
			3 = customer detals back
			4 = custmer details pay click
			5 = bitcoin details back click
		*/

		switch (state) {
		    case 1:
		        hideClass(document.getElementById('checkoutbitocoin'));
				//hide btc stuff
				hideClass(document.getElementById('bitcoinaddresswrapper'));
				//hide the customer details
				hideClass(document.getElementById('customerdetailswrapper'));
				//hide customer detals back
				hideClass(document.getElementById('checkoutcustomerdetailsback'));
				//open it
				addClass(document.querySelector('.cd-cart-container'),'cart-open');
				//show the product details
				showClass(document.getElementById('cartlistitems'));
		        break;
		    case 2:
				hideClass(document.getElementById('cartlistitems'));
				showClass(document.getElementById('customerdetailswrapper'));
				hideClass(document.getElementById('bitcoinaddresswrapper'));
				showClass(document.getElementById('checkoutcustomerdetailsback'));
		        break;
		    case 3:
		       	showClass(document.getElementById('cartlistitems'));
			  	hideClass(document.getElementById('bitcoinaddresswrapper'));
			  	//hideClass(document.querySelector('.bitcoinback'));
			    hideClass(document.getElementById('customerdetailswrapper'));
			   	hideClass(document.getElementById('checkoutcustomerdetailsback'));
		        break;
		    case 4:
		    	hideClass(document.getElementById('cartlistitems'));
				showClass(document.getElementById('bitcoinaddresswrapper'));
				showClass(document.getElementById('checkoutbitocoin'));
				hideClass(document.getElementById('checkoutcustomerdetailsback'));
				hideClass(document.getElementById('customerdetailswrapper'));
		        break;
		    case 5:
		    	hideClass(document.getElementById('cartlistitems'));
				showClass(document.getElementById('customerdetailswrapper'));
				hideClass(document.getElementById('bitcoinaddresswrapper'));
				showClass(document.getElementById('checkoutcustomerdetailsback'));
				hideClass(document.getElementById('checkoutbitocoin'));
		        break;
		   
		}
	}

	var _args = {}; // private
    
    var quantity = 9;
  
	

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
    carthtml = carthtml +'<span class="backbutton" ><a id="checkoutcustomerdetailsback" href="#0">Back</a></span>';
    carthtml = carthtml +'<span class="backbutton" ><a id="checkoutbitocoin" href="#0">Back</a></span>';
    carthtml = carthtml +'</header>';
	carthtml = carthtml +'<div class="body">';
	carthtml = carthtml +'<ul id="cartlistitems">';
	carthtml = carthtml +'</ul>';
	carthtml = carthtml +'<div id="customerdetailswrapper">';
	carthtml = carthtml +'<label>Email</label>  <input type="text" name="sr-email" id="sr-email">';
	carthtml = carthtml +'<a href="#0" id="sr-pay" class="sr-button">Pay</a>';
	carthtml = carthtml +'</div>';
	carthtml = carthtml +'<div id="bitcoinaddresswrapper"><div>';
	carthtml = carthtml +'<a id="bitcoinaddress" class="bitcoinaddress" href=""></a>';
	carthtml = carthtml +'</div>';
	carthtml = carthtml +'<div class="bitcoinoptions" >';
	carthtml = carthtml +'<a href="#" class="bitcoinaddresscopy">';
	carthtml = carthtml +'<i class="fa fa-copy"></i>';
	carthtml = carthtml +'Copy';
	carthtml = carthtml +'</a>';
	carthtml = carthtml +'<a href="bitcoin:2N3Xtg7pBjUG4RPaiwfc2t3wftvLGWv6i2K" class="">';
	carthtml = carthtml +'<i class="fa fa-btc"></i>';
	carthtml = carthtml +'Pay from wallet';
	carthtml = carthtml +'</a>';
	carthtml = carthtml +'</div>';
	carthtml = carthtml +'<img id="bitcoinqrcode" src="" />';
	carthtml = carthtml +'</div>';
	carthtml = carthtml +'</div>';
	carthtml = carthtml +'<footer><a href="#0" class="checkout btn"><em>Checkout - <span id="checkouttotal">0</span> BTC</em></a></footer>';
	carthtml = carthtml +'</div>';
	carthtml = carthtml +'</div>';
	carthtml = carthtml +'</div>';
	//add it to the dom
	document.body.insertAdjacentHTML("beforeend", carthtml);
	document.head.innerHTML = document.head.innerHTML +'<link href="'+cdnurl+'css/sr.css" rel="stylesheet">'

	//pay click

	//bitcoin back click
	document.getElementById('checkoutbitocoin').addEventListener('click', function () 
	{
		cartstate(5);
	});
	

	//payment click
	document.getElementById('sr-pay').addEventListener('click', function () 
	{
		//todo :send it to the server either as a new product or a quantity update along with the customer detail
		cartstate(4);
	});


	//customer back click
	document.getElementById('checkoutcustomerdetailsback').addEventListener('click', function () 
	{
		cartstate(3);
	});

	
	//add to cart click element
	document.querySelector('.checkout').addEventListener('click', function () 
	{
		cartstate(2);
	});

	
	//add to cart click element
	document.querySelector('.cd-add-to-cart').addEventListener('click', function () 
	{
		//get details
		var elproduct = document.getElementById('cd-add-to-cart');
		price =elproduct.getAttribute('data-price');
		name =elproduct.getAttribute('data-name');
		var productid = 1;
		var previewpic = '';

		//increment count (quantity)
		if (itemcount <= quantity)
		{
			itemcount = itemcount+1;
			carttotal(price)
			
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
			prodcuthtml = prodcuthtml + '<span class="price">'+price+' BTC</span>';
			//actions div
			prodcuthtml = prodcuthtml + '<div class="actions">';

			//delete option
			prodcuthtml = prodcuthtml + '<a href="javascript:deleteitem()" class="delete-item">Delete</a>';
			prodcuthtml = prodcuthtml + '<div class="quantity">';
			//quantity label
			prodcuthtml = prodcuthtml + '<label for="cd-product-'+ productid +'">Qty</label>';
			//quantity select
			prodcuthtml = prodcuthtml + '<span class="select"><select id="productquantity" name="productquantity" onchange="changequantity()">';
			var i = 0;
			for (i = 1; i < quantity; i++) 
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

  		}

	});

	//cart clicked element
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
  				cartstate(1);
  			}
  		}
	});


    return {
        init : function(Args) {
        	/*

        	Server vars you can pass set to "" to ignore
        	0 = server url. string
        	1 = animating.  True or false
        	2 = quantity
			3 = cdnurl
			4 = uid

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
			//quantity
			if (typeof(_args[2]) != "")
			{
				quantity = _args[2]
			}
			//cdn url
			if (typeof(_args[3]) != "")
			{
				cdnurl = _args[3]
			}	
			//uid
			if (typeof(_args[4]) != "")
			{
				uid = _args[4]
			}						
			//get an address
			var url = serverurl+"api/address?uid="+uid;
			fetchurl(url,'getaddress')
        }
    };
}());