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

	//billing and shipping addres booleans
	var billingaddress = 0;
	var shippingaddress = 0;
	//note: we could detect the IP to set this automitcally. 
	var startcountry = "US"

	/*
	*	List of countries
	*  source : https://datahub.io/core/country-list#resource-country-list_zip
	*/

	var  countries = [{"Code": "AF", "Name": "Afghanistan"},{"Code": "AX", "Name": "\u00c5land Islands"},{"Code": "AL", "Name": "Albania"},{"Code": "DZ", "Name": "Algeria"},{"Code": "AS", "Name": "American Samoa"},{"Code": "AD", "Name": "Andorra"},{"Code": "AO", "Name": "Angola"},{"Code": "AI", "Name": "Anguilla"},{"Code": "AQ", "Name": "Antarctica"},{"Code": "AG", "Name": "Antigua and Barbuda"},{"Code": "AR", "Name": "Argentina"},{"Code": "AM", "Name": "Armenia"},{"Code": "AW", "Name": "Aruba"},{"Code": "AU", "Name": "Australia"},{"Code": "AT", "Name": "Austria"},{"Code": "AZ", "Name": "Azerbaijan"},{"Code": "BS", "Name": "Bahamas"},{"Code": "BH", "Name": "Bahrain"},{"Code": "BD", "Name": "Bangladesh"},{"Code": "BB", "Name": "Barbados"},{"Code": "BY", "Name": "Belarus"},{"Code": "BE", "Name": "Belgium"},{"Code": "BZ", "Name": "Belize"},{"Code": "BJ", "Name": "Benin"},{"Code": "BM", "Name": "Bermuda"},{"Code": "BT", "Name": "Bhutan"},{"Code": "BO", "Name": "Bolivia, Plurinational State of"},{"Code": "BQ", "Name": "Bonaire, Sint Eustatius and Saba"},{"Code": "BA", "Name": "Bosnia and Herzegovina"},{"Code": "BW", "Name": "Botswana"},{"Code": "BV", "Name": "Bouvet Island"},{"Code": "BR", "Name": "Brazil"},{"Code": "IO", "Name": "British Indian Ocean Territory"},{"Code": "BN", "Name": "Brunei Darussalam"},{"Code": "BG", "Name": "Bulgaria"},{"Code": "BF", "Name": "Burkina Faso"},{"Code": "BI", "Name": "Burundi"},{"Code": "KH", "Name": "Cambodia"},{"Code": "CM", "Name": "Cameroon"},{"Code": "CA", "Name": "Canada"},{"Code": "CV", "Name": "Cape Verde"},{"Code": "KY", "Name": "Cayman Islands"},{"Code": "CF", "Name": "Central African Republic"},{"Code": "TD", "Name": "Chad"},{"Code": "CL", "Name": "Chile"},{"Code": "CN", "Name": "China"},{"Code": "CX", "Name": "Christmas Island"},{"Code": "CC", "Name": "Cocos (Keeling) Islands"},{"Code": "CO", "Name": "Colombia"},{"Code": "KM", "Name": "Comoros"},{"Code": "CG", "Name": "Congo"},{"Code": "CD", "Name": "Congo, the Democratic Republic of the"},{"Code": "CK", "Name": "Cook Islands"},{"Code": "CR", "Name": "Costa Rica"},{"Code": "CI", "Name": "C\u00f4te d'Ivoire"},{"Code": "HR", "Name": "Croatia"},{"Code": "CU", "Name": "Cuba"},{"Code": "CW", "Name": "Cura\u00e7ao"},{"Code": "CY", "Name": "Cyprus"},{"Code": "CZ", "Name": "Czech Republic"},{"Code": "DK", "Name": "Denmark"},{"Code": "DJ", "Name": "Djibouti"},{"Code": "DM", "Name": "Dominica"},{"Code": "DO", "Name": "Dominican Republic"},{"Code": "EC", "Name": "Ecuador"},{"Code": "EG", "Name": "Egypt"},{"Code": "SV", "Name": "El Salvador"},{"Code": "GQ", "Name": "Equatorial Guinea"},{"Code": "ER", "Name": "Eritrea"},{"Code": "EE", "Name": "Estonia"},{"Code": "ET", "Name": "Ethiopia"},{"Code": "FK", "Name": "Falkland Islands (Malvinas)"},{"Code": "FO", "Name": "Faroe Islands"},{"Code": "FJ", "Name": "Fiji"},{"Code": "FI", "Name": "Finland"},{"Code": "FR", "Name": "France"},{"Code": "GF", "Name": "French Guiana"},{"Code": "PF", "Name": "French Polynesia"},{"Code": "TF", "Name": "French Southern Territories"},{"Code": "GA", "Name": "Gabon"},{"Code": "GM", "Name": "Gambia"},{"Code": "GE", "Name": "Georgia"},{"Code": "DE", "Name": "Germany"},{"Code": "GH", "Name": "Ghana"},{"Code": "GI", "Name": "Gibraltar"},{"Code": "GR", "Name": "Greece"},{"Code": "GL", "Name": "Greenland"},{"Code": "GD", "Name": "Grenada"},{"Code": "GP", "Name": "Guadeloupe"},{"Code": "GU", "Name": "Guam"},{"Code": "GT", "Name": "Guatemala"},{"Code": "GG", "Name": "Guernsey"},{"Code": "GN", "Name": "Guinea"},{"Code": "GW", "Name": "Guinea-Bissau"},{"Code": "GY", "Name": "Guyana"},{"Code": "HT", "Name": "Haiti"},{"Code": "HM", "Name": "Heard Island and McDonald Islands"},{"Code": "VA", "Name": "Holy See (Vatican City State)"},{"Code": "HN", "Name": "Honduras"},{"Code": "HK", "Name": "Hong Kong"},{"Code": "HU", "Name": "Hungary"},{"Code": "IS", "Name": "Iceland"},{"Code": "IN", "Name": "India"},{"Code": "ID", "Name": "Indonesia"},{"Code": "IR", "Name": "Iran, Islamic Republic of"},{"Code": "IQ", "Name": "Iraq"},{"Code": "IE", "Name": "Ireland"},{"Code": "IM", "Name": "Isle of Man"},{"Code": "IL", "Name": "Israel"},{"Code": "IT", "Name": "Italy"},{"Code": "JM", "Name": "Jamaica"},{"Code": "JP", "Name": "Japan"},{"Code": "JE", "Name": "Jersey"},{"Code": "JO", "Name": "Jordan"},{"Code": "KZ", "Name": "Kazakhstan"},{"Code": "KE", "Name": "Kenya"},{"Code": "KI", "Name": "Kiribati"},{"Code": "KP", "Name": "Korea, Democratic People's Republic of"},{"Code": "KR", "Name": "Korea, Republic of"},{"Code": "KW", "Name": "Kuwait"},{"Code": "KG", "Name": "Kyrgyzstan"},{"Code": "LA", "Name": "Lao People's Democratic Republic"},{"Code": "LV", "Name": "Latvia"},{"Code": "LB", "Name": "Lebanon"},{"Code": "LS", "Name": "Lesotho"},{"Code": "LR", "Name": "Liberia"},{"Code": "LY", "Name": "Libya"},{"Code": "LI", "Name": "Liechtenstein"},{"Code": "LT", "Name": "Lithuania"},{"Code": "LU", "Name": "Luxembourg"},{"Code": "MO", "Name": "Macao"},{"Code": "MK", "Name": "Macedonia, the Former Yugoslav Republic of"},{"Code": "MG", "Name": "Madagascar"},{"Code": "MW", "Name": "Malawi"},{"Code": "MY", "Name": "Malaysia"},{"Code": "MV", "Name": "Maldives"},{"Code": "ML", "Name": "Mali"},{"Code": "MT", "Name": "Malta"},{"Code": "MH", "Name": "Marshall Islands"},{"Code": "MQ", "Name": "Martinique"},{"Code": "MR", "Name": "Mauritania"},{"Code": "MU", "Name": "Mauritius"},{"Code": "YT", "Name": "Mayotte"},{"Code": "MX", "Name": "Mexico"},{"Code": "FM", "Name": "Micronesia, Federated States of"},{"Code": "MD", "Name": "Moldova, Republic of"},{"Code": "MC", "Name": "Monaco"},{"Code": "MN", "Name": "Mongolia"},{"Code": "ME", "Name": "Montenegro"},{"Code": "MS", "Name": "Montserrat"},{"Code": "MA", "Name": "Morocco"},{"Code": "MZ", "Name": "Mozambique"},{"Code": "MM", "Name": "Myanmar"},{"Code": "NA", "Name": "Namibia"},{"Code": "NR", "Name": "Nauru"},{"Code": "NP", "Name": "Nepal"},{"Code": "NL", "Name": "Netherlands"},{"Code": "NC", "Name": "New Caledonia"},{"Code": "NZ", "Name": "New Zealand"},{"Code": "NI", "Name": "Nicaragua"},{"Code": "NE", "Name": "Niger"},{"Code": "NG", "Name": "Nigeria"},{"Code": "NU", "Name": "Niue"},{"Code": "NF", "Name": "Norfolk Island"},{"Code": "MP", "Name": "Northern Mariana Islands"},{"Code": "NO", "Name": "Norway"},{"Code": "OM", "Name": "Oman"},{"Code": "PK", "Name": "Pakistan"},{"Code": "PW", "Name": "Palau"},{"Code": "PS", "Name": "Palestine, State of"},{"Code": "PA", "Name": "Panama"},{"Code": "PG", "Name": "Papua New Guinea"},{"Code": "PY", "Name": "Paraguay"},{"Code": "PE", "Name": "Peru"},{"Code": "PH", "Name": "Philippines"},{"Code": "PN", "Name": "Pitcairn"},{"Code": "PL", "Name": "Poland"},{"Code": "PT", "Name": "Portugal"},{"Code": "PR", "Name": "Puerto Rico"},{"Code": "QA", "Name": "Qatar"},{"Code": "RE", "Name": "R\u00e9union"},{"Code": "RO", "Name": "Romania"},{"Code": "RU", "Name": "Russian Federation"},{"Code": "RW", "Name": "Rwanda"},{"Code": "BL", "Name": "Saint Barth\u00e9lemy"},{"Code": "SH", "Name": "Saint Helena, Ascension and Tristan da Cunha"},{"Code": "KN", "Name": "Saint Kitts and Nevis"},{"Code": "LC", "Name": "Saint Lucia"},{"Code": "MF", "Name": "Saint Martin (French part)"},{"Code": "PM", "Name": "Saint Pierre and Miquelon"},{"Code": "VC", "Name": "Saint Vincent and the Grenadines"},{"Code": "WS", "Name": "Samoa"},{"Code": "SM", "Name": "San Marino"},{"Code": "ST", "Name": "Sao Tome and Principe"},{"Code": "SA", "Name": "Saudi Arabia"},{"Code": "SN", "Name": "Senegal"},{"Code": "RS", "Name": "Serbia"},{"Code": "SC", "Name": "Seychelles"},{"Code": "SL", "Name": "Sierra Leone"},{"Code": "SG", "Name": "Singapore"},{"Code": "SX", "Name": "Sint Maarten (Dutch part)"},{"Code": "SK", "Name": "Slovakia"},{"Code": "SI", "Name": "Slovenia"},{"Code": "SB", "Name": "Solomon Islands"},{"Code": "SO", "Name": "Somalia"},{"Code": "ZA", "Name": "South Africa"},{"Code": "GS", "Name": "South Georgia and the South Sandwich Islands"},{"Code": "SS", "Name": "South Sudan"},{"Code": "ES", "Name": "Spain"},{"Code": "LK", "Name": "Sri Lanka"},{"Code": "SD", "Name": "Sudan"},{"Code": "SR", "Name": "Suriname"},{"Code": "SJ", "Name": "Svalbard and Jan Mayen"},{"Code": "SZ", "Name": "Swaziland"},{"Code": "SE", "Name": "Sweden"},{"Code": "CH", "Name": "Switzerland"},{"Code": "SY", "Name": "Syrian Arab Republic"},{"Code": "TW", "Name": "Taiwan, Province of China"},{"Code": "TJ", "Name": "Tajikistan"},{"Code": "TZ", "Name": "Tanzania, United Republic of"},{"Code": "TH", "Name": "Thailand"},{"Code": "TL", "Name": "Timor-Leste"},{"Code": "TG", "Name": "Togo"},{"Code": "TK", "Name": "Tokelau"},{"Code": "TO", "Name": "Tonga"},{"Code": "TT", "Name": "Trinidad and Tobago"},{"Code": "TN", "Name": "Tunisia"},{"Code": "TR", "Name": "Turkey"},{"Code": "TM", "Name": "Turkmenistan"},{"Code": "TC", "Name": "Turks and Caicos Islands"},{"Code": "TV", "Name": "Tuvalu"},{"Code": "UG", "Name": "Uganda"},{"Code": "UA", "Name": "Ukraine"},{"Code": "AE", "Name": "United Arab Emirates"},{"Code": "GB", "Name": "United Kingdom"},{"Code": "US", "Name": "United States"},{"Code": "UM", "Name": "United States Minor Outlying Islands"},{"Code": "UY", "Name": "Uruguay"},{"Code": "UZ", "Name": "Uzbekistan"},{"Code": "VU", "Name": "Vanuatu"},{"Code": "VE", "Name": "Venezuela, Bolivarian Republic of"},{"Code": "VN", "Name": "Viet Nam"},{"Code": "VG", "Name": "Virgin Islands, British"},{"Code": "VI", "Name": "Virgin Islands, U.S."},{"Code": "WF", "Name": "Wallis and Futuna"},{"Code": "EH", "Name": "Western Sahara"},{"Code": "YE", "Name": "Yemen"},{"Code": "ZM", "Name": "Zambia"},{"Code": "ZW", "Name": "Zimbabwe"}];

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

	//this function loops through a JSON object and adds the items to a select. 
	//note: It makes the assumpation that you pass it a json object with a Name and Code key value pair, anything else will break
	function populateDropdonw(element,dataset,selected)
	{
		//get the dropdown element
		dropdownelement = document.getElementById(element);
		//empty the dropdown
		dropdownelement.innerHTML = "";
		//loop through the dataset
		Object.keys(dataset).forEach(function(key) {
			//debug
			//console.log(key, countries[key].Name);
		  	//console.log(key)
		  	//console.log(countries[key].Name)

		  	//create an options
		  	newOption = document.createElement("option");
		  	//add the name 
			newOption.text = dataset[key].Name;
			//ad the value
			newOption.value = dataset[key].Code;
			//check if the code matches the selected and if so set it to the selected item
			if (dataset[key].Code == selected)
				newOption.selected = true;
			//add the element
			dropdownelement.appendChild(newOption);
		});
	}

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
		    	//hide the address
		        hideClass(document.getElementById('addresswrapper'));
		    	//hide the check out button
				showClass(document.getElementById('checkout'));
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
		    	if ((shippingaddress == 1) && ( billingaddress == 1))
		    	{
		    		//show the both
		    		showClass(document.getElementById('addresswrapper'));
		    		//hide shipping
		    		hideClass(document.getElementById('shippingaddresswrapper'));
		    		//populate countries dropdown
		    		populateDropdonw('sr-billingcountry',countries,startcountry);
		    		populateDropdonw('sr-shippingcountry',countries,startcountry);

		    	}
		    	else
		    	{
		    		if (shippingaddress == 1)
		    		{
		    			populateDropdonw('sr-shippingcountry',countries,startcountry);
		    			//hide billing and show shipping
		    			showClass(document.getElementById('addresswrapper'));
		    			showClass(document.getElementById('shippingaddresswrapper'));
		    			hideClass(document.getElementById('billingaddressswrapper'));


		    		}
		    		if (billingaddress == 1)
		    		{
		    			populateDropdonw('sr-billingcountry',countries,startcountry);
		    			//hide shipping and show billing
		    			showClass(document.getElementById('addresswrapper'));
		    			hideClass(document.getElementById('shippingaddresswrapper'));
		    			showClass(document.getElementById('billingaddressswrapper'));

		    		}
		    	}
		    	//hide btc stuff
				hideClass(document.getElementById('checkout'));
				//hide the product details
				hideClass(document.getElementById('cartlistitems'));
				//show the customer details
				showClass(document.getElementById('customerdetailswrapper'));
				showClass(document.getElementById('checkoutcustomerdetailsback'));
		    	//hide btc stuff
				hideClass(document.getElementById('bitcoinaddresswrapper'));
		        break;
		    case 3:
		    	//show the check out button
				showClass(document.getElementById('checkout'));
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

			0 = server url
			1 = animated
			2 = quantity count
			3 = cdn url
			4 = uid
    	    5 = theme
			6 = billing address 
			7 = shipping address
			8 = start country

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
			//billing address
			if (_args[6] != "")
			{
				billingaddress = _args[6]
			}
			//shipping address
			if (_args[7] != "")
			{
				shippingaddress = _args[7]
			}
			//start country
			if (_args[8] != "")
			{
				startcountry = _args[8]
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
		,
		checkBilling : function()
		{
			var checkbox =  document.getElementById('sr-billingandshippingcheck');

			if (checkbox.checked) {
			    //Checkbox has been checked
			    alert('checked')
			} else {
			    //Checkbox has been unchecked
			    alert('un checked')
			}
		}
   };
}());