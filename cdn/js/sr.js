var SR = SR || (function()
{
	/*
	**=========================
	*START OF GLOBAL FUNCTIONS
	*=========================
	*/

	//holdthe number of product
	var itemcount = 0;
	//hold the price of the product
	var price = '';
	//hold the name of the product
	var name = '';
	//hold the addres of the product
	var address = '';

	//hold the email
	var email = '';
	//hold the user id 
	//note : Right now we only allow one user but we will expand this later to make it more of a SAAS product.
	var uid = '';
	//hold the server url can be overridden in init
	var serverurl = "http://srcryptoapi.eu-west-1.elasticbeanstalk.com/";
	//hold the cdn url can be overridden in init
	var cdnurl = 'http://s3.eu-west-1.amazonaws.com/srcrypto/';

		//var to hold the arguments passed in from init
	var _args = {}; // private
    
    var quantity = 9;

	//hold the animating flag
	var animating = false;

	var theme = 'cart';
	/*
	**=========================
	*END OF GLOBAL FUNCTIONS
	*=========================
	*/

	/*
	**=========================
	*START OF GENERIC FUNCTIONS
	*=========================
	*/

	//this function adds a class using a  class or id
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

	//this function removes a class using a class or id
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

	//this function chnages the text of a div/span etc using a class or id
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

	//this function checks if an element has class
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

	//this function hides an element 
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

	//this function shows an element
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

	//this functions updates the totals for the cart
	function carttotal()
	{
		//multipily the price by the number of items in the cart
		var producttotal = price * itemcount;
		//set it to 8 decimal places as it's Bitcoin
		producttotal = parseFloat(producttotal).toFixed(8);
		changeClassText(document.getElementById('checkouttotal'),producttotal);
		//update counter
	  	changeClassText(document.querySelector('.cd-count'),itemcount);	
	  	//store product
		var url = serverurl+"api/storeproduct?name="+name+"&quantity="+itemcount+"&address="+address+"&price="+price;
		//call the store produt endpoint
		fetchurl(url,'storeproduct')
	}

	//this function calls endpoints on the server
	//note : This has to be extended to handle post, put etc it only uses GET at the moment.  
	//		 Also it would be good to have proper called backs for the method if we add many more we will make it asynv
	function fetchurl(url,method)
	{
		var request = new XMLHttpRequest();
		request.open('GET',url, true);
		//call it
		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    if (method == "getaddress")
		    {
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
		    }
		    if (method == "storeproduct")
		    {
		    	//do stuff if you want.
		    }
		    if (method == "carttemplate")
		    {
		    	//debug
		    	//console.log(request.responseText);

		    	//add the cart templatehtml
				document.body.insertAdjacentHTML("beforeend", request.responseText);
				//add the click elements listeners
				clickElements()
				//get an address
				var url = serverurl+"api/address?uid="+uid;
				fetchurl(url,'getaddress')
		    }
		    if (method == "storeuserdetails")
		    {
		    	cartstate(4);
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

	//this function works with how the cart should look and sets the correct viusal elements
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
		    	//hide btc stuff
		        hideClass(document.getElementById('checkoutbitocoin'));
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
				//hide the product details
				hideClass(document.getElementById('cartlistitems'));
				//show the customer details
				showClass(document.getElementById('customerdetailswrapper'));
				showClass(document.getElementById('checkoutcustomerdetailsback'));
		    	//hide btc stuff
				hideClass(document.getElementById('bitcoinaddresswrapper'));
		        break;
		    case 3:
				//show the product details
		       	showClass(document.getElementById('cartlistitems'));
		    	//hide btc stuff
			  	hideClass(document.getElementById('bitcoinaddresswrapper'));
				//hide the customer details			  	
			    hideClass(document.getElementById('customerdetailswrapper'));
			   	hideClass(document.getElementById('checkoutcustomerdetailsback'));
		        break;
		    case 4:
				//hide the product details
		    	hideClass(document.getElementById('cartlistitems'));
		    	//show btc stuff		    	
				showClass(document.getElementById('bitcoinaddresswrapper'));
				showClass(document.getElementById('checkoutbitocoin'));
				//hide the customer details			  					
				hideClass(document.getElementById('checkoutcustomerdetailsback'));
				hideClass(document.getElementById('customerdetailswrapper'));
		        break;
		    case 5:
		    	//hide the product details
		    	hideClass(document.getElementById('cartlistitems'));
				//show the customer details
				showClass(document.getElementById('checkoutcustomerdetailsback'));
				showClass(document.getElementById('customerdetailswrapper'));
		    	//show btc stuff
				hideClass(document.getElementById('bitcoinaddresswrapper'));
				hideClass(document.getElementById('checkoutbitocoin'));
		        break;  
		}
	}

	/*
	*=========================
	*END OF GENERIC FUNCTIONS
	*=========================
	*/
	
	function clickElements()
	{
		/*
		*===============================
		*START OF ELEMENT CLICK FUNCTIONS
		*================================
		*/

		//bitcoin back click
		document.getElementById('checkoutbitocoin').addEventListener('click', function () 
		{
			cartstate(5);
		});
		//payment click
		document.getElementById('sr-pay').addEventListener('click', function () 
		{
			//get the email
			//note: We want to update this when we collect more than email, shipping address etc. 
			var useremail = document.getElementById('sr-email').value; 
			//only send the email if it has not been sent
			if (email != useremail)
			{
				email = useremail
				var url = serverurl+"api/storeuserdetails?email="+email+"&address="+address;
				//call the store produt endpoint
				fetchurl(url,'storeuserdetails')		
			}
			else
			{
				cartstate(4);
			}
							
			
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
			//will update when we use multipile products
			var productid = 1;
			//todo
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
				prodcuthtml = prodcuthtml + '<a href="javascript:SR.deleteitem()" class="delete-item">Delete</a>';
				prodcuthtml = prodcuthtml + '<div class="quantity">';
				//quantity label
				prodcuthtml = prodcuthtml + '<label for="cd-product-'+ productid +'">Qty</label>';
				//quantity select
				prodcuthtml = prodcuthtml + '<span class="select"><select id="productquantity" name="productquantity" onchange="SR.changequantity()">';
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
		/*
		*===============================
		*END OF ELEMENT CLICK FUNCTIONS
		*================================
		*/
	}
    return {
        init : function(Args) 
        {
        	/*

        	Server vars you can pass set to "" to ignore
        	0 = server url. string
        	1 = animating.  True or false
        	2 = quantity
			3 = cdnurl
			4 = uid
			5 = theme

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
			if (_args[2] != "")
			{
				quantity = _args[2]
			}
			//cdn url
			if (_args[3] != "")
			{
				cdnurl = _args[3]
			}	
			//uid
			if (_args[4] != "")
			{
				uid = _args[4]
			}
			//theme
			if (_args[5] != "")
			{
				theme = _args[5]
			}

			//load css

        	document.head.innerHTML = document.head.innerHTML +'<link href="'+cdnurl+'theme/'+theme+'.css" rel="stylesheet">'	

			//fetch the template so we can use themes 
			fetchurl(cdnurl+'theme/'+theme+'.html','carttemplate');
        }
        ,
        //this function changes the quantity of the item in the cart
        //note : it is in the name space like this as the cart items are created dynamically so the dom does not always know about it's existence 
       	//		 which means that we have to call it from the onchange in the select old school I.E javascript:SR.chanagequantity() which is not ideal
       	//		 and we will fix it later.
        changequantity : function() {
        	var elquantity = document.getElementById('productquantity');
			itemcountq = elquantity.options[elquantity.selectedIndex];
			itemcount = parseInt(itemcountq.value);
			carttotal();	
        }
        ,
        //this function deletes an item in the cart
        //note : it is in the name space like this as the cart items are created dynamically so the dom does not always know about it's existence 
       	//		 which means that we have to call it from the onchange in the select old school I.E javascript:SR.chanagequantity() which is not ideal
       	//		 and we will fix it later.        
        deleteitem : function ()
		{
			itemcount = 0;
			var productlist = document.getElementById('cartlistitems');
			productlist.innerHTML = "";
			carttotal();
			//close it
	  		removeClass(document.querySelector('.cd-cart-container'),'cart-open');
		}
   };
}());