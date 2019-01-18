/*

replace the getaddress function with a functuin that checks fro an address and if its not found only then returns it

*/
var SR = SR || (function()
{
	/*
	**=========================
	*START OF GLOBAL FUNCTIONS
	*=========================
	*/

	//hold a unique session id
	//note we could store this as a cookie to make things persistent.
	var sessionid = '';
	//hold the checkpayment interval function
	var checkpaymentres = ''
	//holdthe number of product
	var itemcount = 0;
	//hold the price of the product
	var price = '';
	//hold the name of the product
	var name = '';
	//hold the addres of the product
	var btcaddress = '';
	//hold the lighing object;
	var lightaddress = '';
	var usepaymenttype = 1; //1 btc, light
	//hold the preview image
	var preview = '';

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
	//emable / disable lightning
	var lightning = 0;

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


	function setCookie(name,value,days) 
	{
		alert('setting '+name)
	    var expires = "";
	    if (days) 
	    {
	        var date = new Date();
	        date.setTime(date.getTime() + (days*24*60*60*1000));
	        expires = "; expires=" + date.toUTCString();
	    }
	    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
	}
	function getCookie(name) 
	{
	    var nameEQ = name + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0;i < ca.length;i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1,c.length);
	        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	    }
	    return null;
	}

	function eraseCookie(name) 
	{   
	    document.cookie = name+'=; Max-Age=-99999999;';  
	}

	function stopPaymentCheck()
	{
    	clearInterval(checkpaymentres);
	}

	function checkPayment()
	{
		//debug
		//console.log('check payment ticker')

		//set vars
		var address = '';
		var type = '';
		//check if it is a BTC payment
		if (btcaddress !='')
		{
			address = btcaddress;
			type = 'BTC'
		}
		//todo : check if it is a lightning payment. 

		//Call the server
		//Note : 	We could send up the session here and get the address on the server that way BTC and Lightning 
		//			could benefit from being called fron the same endpoint.  We are already sending up the type
		//			maybe we do this when we add LDN / C-Lightning support. 
		var url = serverurl+"webhook/checkpayment?address="+address+'&type='+type;
		fetchurl(url,'checkpayment')

	}

	//this function loops through a JSON object and adds the items to a select. 
	//note: It makes the assumpation that you pass it a json object with a Name and Code key value pair, anything else will break
	function populateDropdown(elementarr,dataset,selected)
	{
		elementarr.forEach(function(entry) {
			//console.log(entry)
			dropdownelement = document.getElementById(entry);
			dropdownelement.innerHTML = "";
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
		changeClassText(document.getElementById('sr-checkouttotal'),producttotal);
		//update counter
	  	changeClassText(document.querySelector('.sr-count'),itemcount);	
	  	//store product
		var url = serverurl+"api/storeproduct?name="+name+"&quantity="+itemcount+"&sessionid="+sessionid+"&price="+price;
		//call the store produt endpoint
		fetchurl(url,'storeproduct')
	}

	//this function fetches a payment address.
	function getAddress(type)
	{
		/* 
		get the correct payment type
		1 = bitocin
		2 = lightning
		*/
		switch (type) 
		{
		    case 1:
		    	if (btcaddress == '')
		    	{
		    		var url = serverurl+"api/address?uid="+uid+'&sessionid='+sessionid;
					fetchurl(url,'getaddressbtc');
				}
				else
				{
					setAddressState(1);
				}
		        break;
		    case 2: 

		    	if (lightaddress == '')
		    	{
		    		var url = serverurl+"strike/charge?uid=3&sessionid="+sessionid
					fetchurl(url,'getaddressslight');
				}
				else
				{
					setAddressState(2);
				}
		    	break;
		}
	}

	//this function calls endpoints on the server
	//note : This has to be extended to handle post, put etc it only uses GET at the moment.  
	//		 Also it would be good to have proper called backs for the method if we add many more we will make it asynv
	function fetchurl(url,method)
	{
		//start a loading aimation
		showClass(document.getElementById('sr-loading-Animation'));
		var request = new XMLHttpRequest();
		request.open('GET',url, true);
		//call it
		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {

		  	//stop animation
			hideClass(document.getElementById('sr-loading-Animation'));

			//alert(method);
		  	if (method == "getsession")
		  	{
		  		// parse the data
			   	var data = JSON.parse(request.responseText);
		  		sessionid = data.sessionid;
		  		setCookie('ecs',sessionid);
		  		
		  	}

		    if (method == "getaddressbtc")
		    {

		    	// parse the data
			    var data = JSON.parse(request.responseText);
			    //debug
		    	//console.log(data)
		    	//set the address
		   		btcaddress = data.address;
			   	setAddressState(1);
			    
		    }
		    if (method == "getaddressslight")
		    {
		    	//todo
		    	// parse the data
			    var data = JSON.parse(request.responseText);
			    lightaddress = data.payment.payment_request;
			    //may have to store the light object but maybe not as we have it on the server
			   	setAddressState(2);
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
				clickElements();
				//get an addres if it is just BTC enabled
				//note : change this to call a generic init function which will return a session ID which we use 
				//       for binding in the database.
				var ses = getCookie('ecs');
		  		if (ses == null)
		  		{
					var url = serverurl+"api/session?uid="+uid;
					fetchurl(url,'getsession');
				}
				else
				{
					sessionid = ses;
				}	
	
		    }
		    if (method == "storeuserdetails")
		    {
		    	cartstate(4);
		    }

		    //process the check
		    if (method == "checkpayment")
		    {
		    	//process the resulrs
		    	var data = JSON.parse(request.responseText);
		    	//debug
		    	//console.log(data.status)

		    	//check if we have enough confirmartions
		    	if (data.status == 1)
		    		cartstate(7)
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

	//this function sets the correct addres state. billing / shipping etc
	function setAddressState(type = 1)
	{
		//figure out what payment types to use
		usepaymenttype = type;
		var showUserSetailsScreen = true;
		checkAddressClickState();
		//check if shipping and billing has been enabled
		if ((shippingaddress == 1) && ( billingaddress == 1))
    	{
    		//show the both
    		showClass(document.getElementById('sr-addresswrapper'));
    		showClass(document.getElementById('sr-billingaddressswrapper'));
    		//hide shipping
    		hideClass(document.getElementById('sr-shippingaddresswrapper'));
    		//hide the payment choice
    		hideClass(document.getElementById('sr-paymentmethods'));
    		//show the customer details
			showClass(document.getElementById('sr-customerdetailswrapper'));
			showClass(document.getElementById('sr-back-button'));
    		//populate countries dropdown
    		populateDropdown(['sr-billingcountry','sr-shippingcountry'],countries,startcountry);
			//return(true);
			showUserSetailsScreen = false;
    	}
    	else
    	{
    		//check if shipping is enabled
    		if (shippingaddress == 1)
    		{
    			populateDropdown(['sr-shippingcountry'],countries,startcountry);
    			//hide billing and show shipping
    			showClass(document.getElementById('sr-addresswrapper'));
    			showClass(document.getElementById('sr-shippingaddresswrapper'));
    			hideClass(document.getElementById('sr-sbillingaddressswrapper'));
				//return(true);
				showUserSetailsScreen = false;

    		}
    		//check if billing is enabled
    		if (billingaddress == 1)
    		{
    			populateDropdown(['sr-billingcountry'],countries,startcountry);
    			//hide shipping and show billing
    			showClass(document.getElementById('addresswrapper'));
    			hideClass(document.getElementById('shippingaddresswrapper'));
    			showClass(document.getElementById('billingaddressswrapper'));
    			//return(true);
    			showUserSetailsScreen = false;
    		}
    	}
    	//no address screen
    	//return(false);
    	if (showUserSetailsScreen = true)
    	{
    		//hide the payment methods
			hideClass(document.getElementById('sr-paymentmethods'));
		    //hide btc stuff
			hideClass(document.getElementById('sr-checkout'));
			//hide the product details
			hideClass(document.getElementById('sr-cartlistitems'));
			//show the customer details
			showClass(document.getElementById('sr-customerdetailswrapper'));
			showClass(document.getElementById('sr-back-button'));
		    //hide btc stuff
			hideClass(document.getElementById('sr-paymentwrapper'));
    	}
	}


	function checkAddressClickState()
	{
		var checkbox =  document.getElementById('sr-billingandshippingcheck');

		if (checkbox.checked) 
		{

		    //Checkbox has been checked
	        showClass(document.getElementById('sr-pay'));
		    hideClass(document.getElementById('sr-billing'));
	        hideClass(document.getElementById('sr-shipping'));


		} 
		else 
		{
		    //Checkbox has been unchecked
		    hideClass(document.getElementById('sr-pay'));
		    hideClass(document.getElementById('sr-billing'));
	        showClass(document.getElementById('sr-shipping'));

		}
	}

	//this function works with how the cart should look and sets the correct viusal elements
	/*

		TODO : check the address state here.

	*/
	function cartstate(state)
	{
		/*
			* = redundant and will be replaced / removed 

			1 = show cart product details (initial click on the cart)
			2 = show customer details screen
			3 = customer detals back*
			4 = custmer details pay click
			5 = bitcoin details back click*
			6 = shipping button clicked
			7 = check payment result


		*/
		//alert(state);
		switch (state) {
		    case 1:

		    	stopPaymentCheck()
		    	hideClass(document.getElementById('sr-paymentmethods'));
		    	hideClass(document.getElementById('sr-paid'));
		    	hideClass(document.getElementById('sr-billing'));
		        hideClass(document.getElementById('sr-shipping'));
		    	//hide the address
		        hideClass(document.getElementById('sr-addresswrapper'));
		    	//hide the check out button
				showClass(document.getElementById('sr-checkout'));
		    	//hide btc stuff
				hideClass(document.getElementById('sr-paymentwrapper'));
				//hide the customer details
				hideClass(document.getElementById('sr-customerdetailswrapper'));
				//hide back button
				hideClass(document.getElementById('sr-back-button'));
				//open it
				addClass(document.querySelector('.sr-cart-container'),'cart-open');
				//show the product details
				showClass(document.getElementById('sr-cartlistitems'));
		        break;
		    case 2:
		    	//check out button is pressed 

		    	//check if lighting is enabled
		    	//note (chris) if we add more payment methods then we should make this generic.
		    	//note (chris) if it is to slow getting the address at this point then we can move it to the 
		    	//			   start of the flow


		    	if (lightning == 1)
		    	{
		    		//note (chris) we could fetch a light address and a btc adress here or wait until they select.
		    		//getAddress(2);
		    		//hide btc stuff
					hideClass(document.getElementById('sr-checkout'));
					hideClass(document.getElementById('sr-cartlistitems'));
					hideClass(document.getElementById('sr-paymentwrapper'));
					//show the payment seleciton screen
		    		showClass(document.getElementById('sr-paymentmethods'));


		    	}
		    	else
		    	{
		    		//fetch a BTC address as there is only one payment method so it is fine to do it here
		    		getAddress(1);		    	
		    	}
		        break;
		    case 3:
		    	//check address
		    	setAddressState();
		    	//checkAddressState();
		    	//show the check out button
				showClass(document.getElementById('sr-checkout'));
				//show the product details
		       	showClass(document.getElementById('sr-cartlistitems'));
				//hide the customer details			  	
			    hideClass(document.getElementById('sr-customerdetailswrapper'));
			   	hideClass(document.getElementById('sr-back-button'));
		        break;
		    case 4:
		    	//when paybutton has been pressed
		    	var theAddress = '';
		    	var theType = '';
		    	if (usepaymenttype == 1)
		    	{
		    		theAddress = btcaddress;
		    		theType = 'bitcoin:';
		    	}

		    	if (usepaymenttype == 2)
		    	{
		    		theAddress = lightaddress
		    		theType = 'lightning:';

		    	}

		    	var eladdress = document.getElementById('sr-address');
			    //set the href
			    eladdress.setAttribute('href', "bitcoin:"+theAddress);
			    //set the address
	    		eladdress.innerText =theAddress;
	    		//do pay from wallet also
	    		var eladdresswallet = document.getElementById('sr-addresswallet');
			    //set the href
			    eladdresswallet.setAttribute('href', theType+":"+theAddress);
	    		//debug
			    //console.log(elbtcaddress)
			    //generate the qr code
			    var elqr = document.getElementById('sr-qrcode');
				elqr.setAttribute('src', "https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl="+theAddress);
		    	
		    	//multipily the price by the number of items in the cart
				var producttotal = price * itemcount;
				//set it to 8 decimal places as it's Bitcoin
				//producttotal = parseFloat(producttotal).toFixed(8);
				var payelement = document.getElementById('sr-payment-pay');
				payelement.innerText = 'Pay '+producttotal+' BTC';

		    	//debug
			    //console.log(elbtcqr)

		    	//hide the payment methods
				hideClass(document.getElementById('sr-paymentmethods'));
		    	//hide btc stuff
				hideClass(document.getElementById('sr-checkout'));
				//hide the product details
				hideClass(document.getElementById('sr-cartlistitems'));
				//show the customer details
				showClass(document.getElementById('sr-back-button'));
	    		//show btc stuff		    	
				showClass(document.getElementById('sr-paymentwrapper'));
				//hide the customer details			  					
				showClass(document.getElementById('sr-back-button'));
				hideClass(document.getElementById('sr-customerdetailswrapper'));
				//start the check payment timer
				checkpaymentres = setInterval(checkPayment, 3000)				
		        break;
		    case 5:
		    	//check address
		    	setAddressState();
		    	//checkAddressState();
		    	//hide the product details
		    	hideClass(document.getElementById('sr-cartlistitems'));
				//show the customer details
				showClass(document.getElementById('sr-back-button'));
				showClass(document.getElementById('sr-customerdetailswrapper'));
		    	//show btc stuff
				hideClass(document.getElementById('sr-paymentwrapper'));
		        break; 
		     case 6:
		     	hideClass(document.getElementById('sr-billingaddressswrapper'));
		     	showClass(document.getElementById('sr-shippingaddresswrapper'));
		     	showClass(document.getElementById('sr-pay'));
		     	hideClass(document.getElementById('sr-shipping'));
		     case 7:
		     	//stop payment timer
		     	stopPaymentCheck()
		     	//hide back button
				hideClass(document.getElementById('sr-back-button'));
				//hide payment details
		     	hideClass(document.getElementById('sr-paymentwrapper'))
		     	//show paid screeb
		    	showClass(document.getElementById('sr-paid'));
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
		document.getElementById('sr-back-button').addEventListener('click', function () 
		{
			//reset cart
			cartstate(1);
		});
		//payment click
		document.getElementById('sr-pay').addEventListener('click', function () 
		{
			var checkbox =  document.getElementById('sr-billingandshippingcheck');
			//check if it the shipping / billing the same has been clicked
			if (checkbox.checked) 
			{
				//note we could do this at the server end and cut down on the size of the call but I prefer
				//to keep the server failry agnostic and keep the logic here in this usecase.
				document.getElementById("sr-shippingaddress1").value = document.getElementById("sr-billingaddress1").value;
				document.getElementById("sr-shippingcity").value = document.getElementById("sr-billingcity").value;
				document.getElementById("sr-shippingstate").value = document.getElementById("sr-billingstate").value;
				document.getElementById("sr-shippingzip").value = document.getElementById("sr-billingzip").value;
				document.getElementById("sr-shippingcountry").value = document.getElementById("sr-billingcountry").value;

			}
			var cartstring = "";
			var elements = document.getElementsByClassName("sr-input");
			for (var i = 0, len = elements.length; i < len; i++) {
			    // elements[i].style ...
			    if (cartstring == "" )
			    {
			    	cartstring = "?"+elements[i].name+'='+elements[i].value;
			    }
			    else
			    {
			    	cartstring = cartstring+"&"+elements[i].name+'='+elements[i].value;
			    }
			    //console.log(elements[i].name);
			    //console.log(elements[i].value);
			}


			//get the product meta
			var elements = document.getElementsByClassName("sr-productmeta");
			//loop through them 
			for (var i = 0, len = elements.length; i < len; i++) {
				 if (cartstring == "" )
			    {
			    	cartstring = "?"+elements[i].name+'='+elements[i].value;
			    }
			    else
			    {
			    	cartstring = cartstring+"&"+elements[i].name+'='+elements[i].value;
			    }
			}

			var url = serverurl+"api/storeuserdetails"+cartstring+"&sessionid="+sessionid;
			//console.log(url)
			//call the store produt endpoint
			fetchurl(url,'storeuserdetails')		
			
							
			
		});

		
		document.getElementById('sr-addresscopy').addEventListener('click', function () 
		{
			const el = document.createElement('textarea');  // Create a <textarea> element
			el.value = address;                                 // Set its value to the string that you want copied
			el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
			el.style.position = 'absolute';                 
			el.style.left = '-9999px';                      // Move outside the screen to make it invisible
			document.body.appendChild(el);  
			el.select();                                    // Select the <textarea> content
  			document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
  			document.body.removeChild(el);      
		});
		
		//shipping and billing checbox
		document.getElementById('sr-billingandshippingcheck').addEventListener('click', function () 
		{
			checkAddressClickState()
			
		});
		
		//shipping button clicked
		document.getElementById('sr-shipping').addEventListener('click', function () 
		{
			cartstate(6)			
			
		});

		//add to cart click element
		document.querySelector('.sr-checkout').addEventListener('click', function () 
		{
			cartstate(2);
		});

		//add to cart click element
		document.querySelector('.sr-add-to-cart').addEventListener('click', function () 
		{
			//note we ought to move this string creator into its own function now as it is bound to be used
			//by others

			//get all the product meta
			var elements = document.getElementsByClassName("sr-productmeta");
			//loop through them 
			for (var i = 0, len = elements.length; i < len; i++) {
				//get if is required 
				var required = 0;
				required = elements[i].getAttribute('sr-required');
				//chek it is required and been selectd otherwise halt
				if ((elements[i].value == '') && (required==1))
				{
					var productnametmp = elements[i].name;
					productnametmp = productnametmp.replace("sr-product-", "");
					alert('please select a '+productnametmp);
					return;
				}
			   
			}
			
			//get details
			var elproduct = document.getElementById('sr-add-to-cart');
			price =elproduct.getAttribute('data-price');
			name =elproduct.getAttribute('data-name');
			preview = elproduct.getAttribute('data-preview');
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
		  		showClass(document.querySelector('.sr-cart-container'))	
			  	
			  	//add item to cart
			  	var productlist = document.getElementById('sr-cartlistitems');
				var itemlist  = document.createElement('li');
				itemlist.className = 'sr-product ';

				//build produt
				var prodcuthtml = '';
				//display default image or the one supplied	
				if (preview == "")
				{
					var prodcuthtml = prodcuthtml +'<div class="sr-product-image"><a href="#0"><img src="'+cdnurl+'img/sr-product-preview.png" alt="placeholder"></a></div>';
				}
				else
				{
					var prodcuthtml = prodcuthtml +'<div class="sr-product-image"><a href="#0"><img src="'+preview+'" alt="placeholder"></a></div>';
				}
				//product name
				prodcuthtml = prodcuthtml + '<div class=""><h3><a href="#0">'+name+'</a></h3>';
				//product price
				prodcuthtml = prodcuthtml + '<div class="sr-price">'+price+' BTC</div>';
				//actions div
				prodcuthtml = prodcuthtml + '<div class="sr-actions">';

				//delete option
				prodcuthtml = prodcuthtml + '<a href="javascript:SR.deleteitem()" class="sr-delete-item">Delete</a>';
				prodcuthtml = prodcuthtml + '<div class="sr-quantity">';
				//quantity label
				//quantity select
				prodcuthtml = prodcuthtml + '<span class="select"><select id="sr-productquantity" name="sr-productquantity" onchange="SR.changequantity()">';
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
				productlist.innerHTML = prodcuthtml;
				//note we have to fix this when we add multipile products. 
				//productlist.appendChild(itemlist);
	  		}
		});
		/*
			cart clicked element

			//todo: should show the product variants in the cart view
		*/
		document.querySelector('.sr-cart-trigger').addEventListener('click', function () {	  		
	  		//debug
	  		//itemcount = 1;

	  		//check if cart shoud be shown
	  		if (itemcount == 0)
	  		{
	  			//always remove as its 0
	  			removeClass(document.querySelector('.sr-cart-container'),'cart-open');
	  		}
	  		else
	  		{
	  			//see if the cart is open and toggle it
	  			var res = hasClass(document.querySelector('.sr-cart-container'),'cart-open');
	  			if (res == 1)
	  			{
	  				//stop payment check
	  				stopPaymentCheck()
	  				//close it
	  				removeClass(document.querySelector('.sr-cart-container'),'cart-open');
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
			9 = lightning

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
				animating = _args[1];
			}
			//quantity
			if (_args[2] != "")
			{
				quantity = _args[2];
			}
			//cdn url
			if (_args[3] != "")
			{
				cdnurl = _args[3];
			}	
			//uid
			if (_args[4] != "")
			{
				uid = _args[4];
			}
			//theme
			if (_args[5] != "")
			{
				theme = _args[5];
			}
			//billing address
			if (_args[6] != "")
			{
				billingaddress = _args[6];
			}
			//shipping address
			if (_args[7] != "")
			{
				shippingaddress = _args[7];
			}
			//start country
			if (_args[8] != "")
			{
				startcountry = _args[8];
			}
			//enable lightning
			if (_args[9] != "")
			{
				lightning = _args[9];
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
        	var elquantity = document.getElementById('sr-productquantity');
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
			var productlist = document.getElementById('sr-cartlistitems');
			productlist.innerHTML = "";
			carttotal();
			//close it
	  		removeClass(document.querySelector('.sr-cart-container'),'cart-open');
		},
		bitcoinpayment : function ()
		{
			getAddress(1);
		},
		lightningpayment : function ()
		{
			getAddress(2);
		}
   };
}());