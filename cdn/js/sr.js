var SR = SR || (function() {
    /*
     **=========================
     *START OF GLOBAL FUNCTIONS
     *=========================
     */
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
    //hold the lightning invoice address
    var lightningaddress = '';
    //hold the preview image
    var preview = '';
    //hold the cart type
    //0 = normal cart
    //1 = anon cart (todo)
    //2 = donation cart type
    var carttype = 0;
    //hold the total for the cart
    var producttotal = 0;
    //hold the email
    var email = '';
    //hold the user id 
    //note : Right now we only allow one user but we will expand this later to make it more of a SAAS product.
    var uid = '';
    //hold the server url from init
    var serverurl = "";
    //hold the cdn url from init
    var cdnurl = "";
    //var to hold the arguments passed in from init
    var _args = {}; // private
    //max quantity
    var quantity = 9;
    //shipping addres boolean
    var shippingaddress = 0;
    //note: we could detect the IP to set this automitcally. 
    var startcountry = "US"
    //hold if it is serverless or not 
    var serverless = 0; // 0 = no 1 = yes
    var serverlessbtcaddress = ''; // replace this with a proper one for testing or let the debugger pass it in.
    var addresstype = 0; //hold the address type 0 = BTC, 1 = LIGHTNING
    //notewe have hard coded this for now but it should either be sent down from the server or
    //loaded from the init (maybe both) as this will set if we support lightnng or not.
    var acceptlightning = 1; //hold payment toggle state.
    /*
     *  List of countries
     *      source : https://datahub.io/core/country-list#resource-country-list_zip
     */
    var countries = [{
        "Code": "AF",
        "Name": "Afghanistan"
    }, {
        "Code": "AX",
        "Name": "\u00c5land Islands"
    }, {
        "Code": "AL",
        "Name": "Albania"
    }, {
        "Code": "DZ",
        "Name": "Algeria"
    }, {
        "Code": "AS",
        "Name": "American Samoa"
    }, {
        "Code": "AD",
        "Name": "Andorra"
    }, {
        "Code": "AO",
        "Name": "Angola"
    }, {
        "Code": "AI",
        "Name": "Anguilla"
    }, {
        "Code": "AQ",
        "Name": "Antarctica"
    }, {
        "Code": "AG",
        "Name": "Antigua and Barbuda"
    }, {
        "Code": "AR",
        "Name": "Argentina"
    }, {
        "Code": "AM",
        "Name": "Armenia"
    }, {
        "Code": "AW",
        "Name": "Aruba"
    }, {
        "Code": "AU",
        "Name": "Australia"
    }, {
        "Code": "AT",
        "Name": "Austria"
    }, {
        "Code": "AZ",
        "Name": "Azerbaijan"
    }, {
        "Code": "BS",
        "Name": "Bahamas"
    }, {
        "Code": "BH",
        "Name": "Bahrain"
    }, {
        "Code": "BD",
        "Name": "Bangladesh"
    }, {
        "Code": "BB",
        "Name": "Barbados"
    }, {
        "Code": "BY",
        "Name": "Belarus"
    }, {
        "Code": "BE",
        "Name": "Belgium"
    }, {
        "Code": "BZ",
        "Name": "Belize"
    }, {
        "Code": "BJ",
        "Name": "Benin"
    }, {
        "Code": "BM",
        "Name": "Bermuda"
    }, {
        "Code": "BT",
        "Name": "Bhutan"
    }, {
        "Code": "BO",
        "Name": "Bolivia, Plurinational State of"
    }, {
        "Code": "BQ",
        "Name": "Bonaire, Sint Eustatius and Saba"
    }, {
        "Code": "BA",
        "Name": "Bosnia and Herzegovina"
    }, {
        "Code": "BW",
        "Name": "Botswana"
    }, {
        "Code": "BV",
        "Name": "Bouvet Island"
    }, {
        "Code": "BR",
        "Name": "Brazil"
    }, {
        "Code": "IO",
        "Name": "British Indian Ocean Territory"
    }, {
        "Code": "BN",
        "Name": "Brunei Darussalam"
    }, {
        "Code": "BG",
        "Name": "Bulgaria"
    }, {
        "Code": "BF",
        "Name": "Burkina Faso"
    }, {
        "Code": "BI",
        "Name": "Burundi"
    }, {
        "Code": "KH",
        "Name": "Cambodia"
    }, {
        "Code": "CM",
        "Name": "Cameroon"
    }, {
        "Code": "CA",
        "Name": "Canada"
    }, {
        "Code": "CV",
        "Name": "Cape Verde"
    }, {
        "Code": "KY",
        "Name": "Cayman Islands"
    }, {
        "Code": "CF",
        "Name": "Central African Republic"
    }, {
        "Code": "TD",
        "Name": "Chad"
    }, {
        "Code": "CL",
        "Name": "Chile"
    }, {
        "Code": "CN",
        "Name": "China"
    }, {
        "Code": "CX",
        "Name": "Christmas Island"
    }, {
        "Code": "CC",
        "Name": "Cocos (Keeling) Islands"
    }, {
        "Code": "CO",
        "Name": "Colombia"
    }, {
        "Code": "KM",
        "Name": "Comoros"
    }, {
        "Code": "CG",
        "Name": "Congo"
    }, {
        "Code": "CD",
        "Name": "Congo, the Democratic Republic of the"
    }, {
        "Code": "CK",
        "Name": "Cook Islands"
    }, {
        "Code": "CR",
        "Name": "Costa Rica"
    }, {
        "Code": "CI",
        "Name": "C\u00f4te d'Ivoire"
    }, {
        "Code": "HR",
        "Name": "Croatia"
    }, {
        "Code": "CU",
        "Name": "Cuba"
    }, {
        "Code": "CW",
        "Name": "Cura\u00e7ao"
    }, {
        "Code": "CY",
        "Name": "Cyprus"
    }, {
        "Code": "CZ",
        "Name": "Czech Republic"
    }, {
        "Code": "DK",
        "Name": "Denmark"
    }, {
        "Code": "DJ",
        "Name": "Djibouti"
    }, {
        "Code": "DM",
        "Name": "Dominica"
    }, {
        "Code": "DO",
        "Name": "Dominican Republic"
    }, {
        "Code": "EC",
        "Name": "Ecuador"
    }, {
        "Code": "EG",
        "Name": "Egypt"
    }, {
        "Code": "SV",
        "Name": "El Salvador"
    }, {
        "Code": "GQ",
        "Name": "Equatorial Guinea"
    }, {
        "Code": "ER",
        "Name": "Eritrea"
    }, {
        "Code": "EE",
        "Name": "Estonia"
    }, {
        "Code": "ET",
        "Name": "Ethiopia"
    }, {
        "Code": "FK",
        "Name": "Falkland Islands (Malvinas)"
    }, {
        "Code": "FO",
        "Name": "Faroe Islands"
    }, {
        "Code": "FJ",
        "Name": "Fiji"
    }, {
        "Code": "FI",
        "Name": "Finland"
    }, {
        "Code": "FR",
        "Name": "France"
    }, {
        "Code": "GF",
        "Name": "French Guiana"
    }, {
        "Code": "PF",
        "Name": "French Polynesia"
    }, {
        "Code": "TF",
        "Name": "French Southern Territories"
    }, {
        "Code": "GA",
        "Name": "Gabon"
    }, {
        "Code": "GM",
        "Name": "Gambia"
    }, {
        "Code": "GE",
        "Name": "Georgia"
    }, {
        "Code": "DE",
        "Name": "Germany"
    }, {
        "Code": "GH",
        "Name": "Ghana"
    }, {
        "Code": "GI",
        "Name": "Gibraltar"
    }, {
        "Code": "GR",
        "Name": "Greece"
    }, {
        "Code": "GL",
        "Name": "Greenland"
    }, {
        "Code": "GD",
        "Name": "Grenada"
    }, {
        "Code": "GP",
        "Name": "Guadeloupe"
    }, {
        "Code": "GU",
        "Name": "Guam"
    }, {
        "Code": "GT",
        "Name": "Guatemala"
    }, {
        "Code": "GG",
        "Name": "Guernsey"
    }, {
        "Code": "GN",
        "Name": "Guinea"
    }, {
        "Code": "GW",
        "Name": "Guinea-Bissau"
    }, {
        "Code": "GY",
        "Name": "Guyana"
    }, {
        "Code": "HT",
        "Name": "Haiti"
    }, {
        "Code": "HM",
        "Name": "Heard Island and McDonald Islands"
    }, {
        "Code": "VA",
        "Name": "Holy See (Vatican City State)"
    }, {
        "Code": "HN",
        "Name": "Honduras"
    }, {
        "Code": "HK",
        "Name": "Hong Kong"
    }, {
        "Code": "HU",
        "Name": "Hungary"
    }, {
        "Code": "IS",
        "Name": "Iceland"
    }, {
        "Code": "IN",
        "Name": "India"
    }, {
        "Code": "ID",
        "Name": "Indonesia"
    }, {
        "Code": "IR",
        "Name": "Iran, Islamic Republic of"
    }, {
        "Code": "IQ",
        "Name": "Iraq"
    }, {
        "Code": "IE",
        "Name": "Ireland"
    }, {
        "Code": "IM",
        "Name": "Isle of Man"
    }, {
        "Code": "IL",
        "Name": "Israel"
    }, {
        "Code": "IT",
        "Name": "Italy"
    }, {
        "Code": "JM",
        "Name": "Jamaica"
    }, {
        "Code": "JP",
        "Name": "Japan"
    }, {
        "Code": "JE",
        "Name": "Jersey"
    }, {
        "Code": "JO",
        "Name": "Jordan"
    }, {
        "Code": "KZ",
        "Name": "Kazakhstan"
    }, {
        "Code": "KE",
        "Name": "Kenya"
    }, {
        "Code": "KI",
        "Name": "Kiribati"
    }, {
        "Code": "KP",
        "Name": "Korea, Democratic People's Republic of"
    }, {
        "Code": "KR",
        "Name": "Korea, Republic of"
    }, {
        "Code": "KW",
        "Name": "Kuwait"
    }, {
        "Code": "KG",
        "Name": "Kyrgyzstan"
    }, {
        "Code": "LA",
        "Name": "Lao People's Democratic Republic"
    }, {
        "Code": "LV",
        "Name": "Latvia"
    }, {
        "Code": "LB",
        "Name": "Lebanon"
    }, {
        "Code": "LS",
        "Name": "Lesotho"
    }, {
        "Code": "LR",
        "Name": "Liberia"
    }, {
        "Code": "LY",
        "Name": "Libya"
    }, {
        "Code": "LI",
        "Name": "Liechtenstein"
    }, {
        "Code": "LT",
        "Name": "Lithuania"
    }, {
        "Code": "LU",
        "Name": "Luxembourg"
    }, {
        "Code": "MO",
        "Name": "Macao"
    }, {
        "Code": "MK",
        "Name": "Macedonia, the Former Yugoslav Republic of"
    }, {
        "Code": "MG",
        "Name": "Madagascar"
    }, {
        "Code": "MW",
        "Name": "Malawi"
    }, {
        "Code": "MY",
        "Name": "Malaysia"
    }, {
        "Code": "MV",
        "Name": "Maldives"
    }, {
        "Code": "ML",
        "Name": "Mali"
    }, {
        "Code": "MT",
        "Name": "Malta"
    }, {
        "Code": "MH",
        "Name": "Marshall Islands"
    }, {
        "Code": "MQ",
        "Name": "Martinique"
    }, {
        "Code": "MR",
        "Name": "Mauritania"
    }, {
        "Code": "MU",
        "Name": "Mauritius"
    }, {
        "Code": "YT",
        "Name": "Mayotte"
    }, {
        "Code": "MX",
        "Name": "Mexico"
    }, {
        "Code": "FM",
        "Name": "Micronesia, Federated States of"
    }, {
        "Code": "MD",
        "Name": "Moldova, Republic of"
    }, {
        "Code": "MC",
        "Name": "Monaco"
    }, {
        "Code": "MN",
        "Name": "Mongolia"
    }, {
        "Code": "ME",
        "Name": "Montenegro"
    }, {
        "Code": "MS",
        "Name": "Montserrat"
    }, {
        "Code": "MA",
        "Name": "Morocco"
    }, {
        "Code": "MZ",
        "Name": "Mozambique"
    }, {
        "Code": "MM",
        "Name": "Myanmar"
    }, {
        "Code": "NA",
        "Name": "Namibia"
    }, {
        "Code": "NR",
        "Name": "Nauru"
    }, {
        "Code": "NP",
        "Name": "Nepal"
    }, {
        "Code": "NL",
        "Name": "Netherlands"
    }, {
        "Code": "NC",
        "Name": "New Caledonia"
    }, {
        "Code": "NZ",
        "Name": "New Zealand"
    }, {
        "Code": "NI",
        "Name": "Nicaragua"
    }, {
        "Code": "NE",
        "Name": "Niger"
    }, {
        "Code": "NG",
        "Name": "Nigeria"
    }, {
        "Code": "NU",
        "Name": "Niue"
    }, {
        "Code": "NF",
        "Name": "Norfolk Island"
    }, {
        "Code": "MP",
        "Name": "Northern Mariana Islands"
    }, {
        "Code": "NO",
        "Name": "Norway"
    }, {
        "Code": "OM",
        "Name": "Oman"
    }, {
        "Code": "PK",
        "Name": "Pakistan"
    }, {
        "Code": "PW",
        "Name": "Palau"
    }, {
        "Code": "PS",
        "Name": "Palestine, State of"
    }, {
        "Code": "PA",
        "Name": "Panama"
    }, {
        "Code": "PG",
        "Name": "Papua New Guinea"
    }, {
        "Code": "PY",
        "Name": "Paraguay"
    }, {
        "Code": "PE",
        "Name": "Peru"
    }, {
        "Code": "PH",
        "Name": "Philippines"
    }, {
        "Code": "PN",
        "Name": "Pitcairn"
    }, {
        "Code": "PL",
        "Name": "Poland"
    }, {
        "Code": "PT",
        "Name": "Portugal"
    }, {
        "Code": "PR",
        "Name": "Puerto Rico"
    }, {
        "Code": "QA",
        "Name": "Qatar"
    }, {
        "Code": "RE",
        "Name": "R\u00e9union"
    }, {
        "Code": "RO",
        "Name": "Romania"
    }, {
        "Code": "RU",
        "Name": "Russian Federation"
    }, {
        "Code": "RW",
        "Name": "Rwanda"
    }, {
        "Code": "BL",
        "Name": "Saint Barth\u00e9lemy"
    }, {
        "Code": "SH",
        "Name": "Saint Helena, Ascension and Tristan da Cunha"
    }, {
        "Code": "KN",
        "Name": "Saint Kitts and Nevis"
    }, {
        "Code": "LC",
        "Name": "Saint Lucia"
    }, {
        "Code": "MF",
        "Name": "Saint Martin (French part)"
    }, {
        "Code": "PM",
        "Name": "Saint Pierre and Miquelon"
    }, {
        "Code": "VC",
        "Name": "Saint Vincent and the Grenadines"
    }, {
        "Code": "WS",
        "Name": "Samoa"
    }, {
        "Code": "SM",
        "Name": "San Marino"
    }, {
        "Code": "ST",
        "Name": "Sao Tome and Principe"
    }, {
        "Code": "SA",
        "Name": "Saudi Arabia"
    }, {
        "Code": "SN",
        "Name": "Senegal"
    }, {
        "Code": "RS",
        "Name": "Serbia"
    }, {
        "Code": "SC",
        "Name": "Seychelles"
    }, {
        "Code": "SL",
        "Name": "Sierra Leone"
    }, {
        "Code": "SG",
        "Name": "Singapore"
    }, {
        "Code": "SX",
        "Name": "Sint Maarten (Dutch part)"
    }, {
        "Code": "SK",
        "Name": "Slovakia"
    }, {
        "Code": "SI",
        "Name": "Slovenia"
    }, {
        "Code": "SB",
        "Name": "Solomon Islands"
    }, {
        "Code": "SO",
        "Name": "Somalia"
    }, {
        "Code": "ZA",
        "Name": "South Africa"
    }, {
        "Code": "GS",
        "Name": "South Georgia and the South Sandwich Islands"
    }, {
        "Code": "SS",
        "Name": "South Sudan"
    }, {
        "Code": "ES",
        "Name": "Spain"
    }, {
        "Code": "LK",
        "Name": "Sri Lanka"
    }, {
        "Code": "SD",
        "Name": "Sudan"
    }, {
        "Code": "SR",
        "Name": "Suriname"
    }, {
        "Code": "SJ",
        "Name": "Svalbard and Jan Mayen"
    }, {
        "Code": "SZ",
        "Name": "Swaziland"
    }, {
        "Code": "SE",
        "Name": "Sweden"
    }, {
        "Code": "CH",
        "Name": "Switzerland"
    }, {
        "Code": "SY",
        "Name": "Syrian Arab Republic"
    }, {
        "Code": "TW",
        "Name": "Taiwan, Province of China"
    }, {
        "Code": "TJ",
        "Name": "Tajikistan"
    }, {
        "Code": "TZ",
        "Name": "Tanzania, United Republic of"
    }, {
        "Code": "TH",
        "Name": "Thailand"
    }, {
        "Code": "TL",
        "Name": "Timor-Leste"
    }, {
        "Code": "TG",
        "Name": "Togo"
    }, {
        "Code": "TK",
        "Name": "Tokelau"
    }, {
        "Code": "TO",
        "Name": "Tonga"
    }, {
        "Code": "TT",
        "Name": "Trinidad and Tobago"
    }, {
        "Code": "TN",
        "Name": "Tunisia"
    }, {
        "Code": "TR",
        "Name": "Turkey"
    }, {
        "Code": "TM",
        "Name": "Turkmenistan"
    }, {
        "Code": "TC",
        "Name": "Turks and Caicos Islands"
    }, {
        "Code": "TV",
        "Name": "Tuvalu"
    }, {
        "Code": "UG",
        "Name": "Uganda"
    }, {
        "Code": "UA",
        "Name": "Ukraine"
    }, {
        "Code": "AE",
        "Name": "United Arab Emirates"
    }, {
        "Code": "GB",
        "Name": "United Kingdom"
    }, {
        "Code": "US",
        "Name": "United States"
    }, {
        "Code": "UM",
        "Name": "United States Minor Outlying Islands"
    }, {
        "Code": "UY",
        "Name": "Uruguay"
    }, {
        "Code": "UZ",
        "Name": "Uzbekistan"
    }, {
        "Code": "VU",
        "Name": "Vanuatu"
    }, {
        "Code": "VE",
        "Name": "Venezuela, Bolivarian Republic of"
    }, {
        "Code": "VN",
        "Name": "Viet Nam"
    }, {
        "Code": "VG",
        "Name": "Virgin Islands, British"
    }, {
        "Code": "VI",
        "Name": "Virgin Islands, U.S."
    }, {
        "Code": "WF",
        "Name": "Wallis and Futuna"
    }, {
        "Code": "EH",
        "Name": "Western Sahara"
    }, {
        "Code": "YE",
        "Name": "Yemen"
    }, {
        "Code": "ZM",
        "Name": "Zambia"
    }, {
        "Code": "ZW",
        "Name": "Zimbabwe"
    }];
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
    function stopPaymentCheck() {
        if (checkpaymentres != null)
            clearInterval(checkpaymentres);
    }

    function startPaymentCheck() {
        //debug
        //console.log('check payment ticker')
        //var url = serverurl+"/webhook/checkpayment?address="+address+"&token="+token;

        var url = serverurl + "webhook/checkbtcpayment?btcaddress=" + btcaddress;
        fetchurl(url, 'checkpayment')
    }
    //this function loops through a JSON object and adds the items to a select. 
    //note: It makes the assumpation that you pass it a json object with a Name and Code key value pair, anything else will break
    function populateDropdown(elementarr, dataset, selected) {
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
                if (dataset[key].Code == selected) newOption.selected = true;
                //add the element
                dropdownelement.appendChild(newOption);
            });
        });
    }
    //this function adds a class using a  class or id
    function addClass(elements, myClass) {
        // if there are no elements, we're done
        if (!elements) {
            return;
        }
        // if we have a selector, get the chosen elements
        if (typeof(elements) === 'string') {
            elements = document.querySelectorAll(elements);
        }
        // if we have a single DOM element, make it an array to simplify behavior
        else if (elements.tagName) {
            elements = [elements];
        }
        // add class to all chosen elements
        for (var i = 0; i < elements.length; i++) {
            // if class is not already found
            if ((' ' + elements[i].className + ' ').indexOf(' ' + myClass + ' ') < 0) {
                // add class
                elements[i].className += ' ' + myClass;
            }
        }
    }
    //this function removes a class using a class or id
    function removeClass(elements, myClass) {
        // if there are no elements, we're done
        if (!elements) {
            return;
        }
        // if we have a selector, get the chosen elements
        if (typeof(elements) === 'string') {
            elements = document.querySelectorAll(elements);
        }
        // if we have a single DOM element, make it an array to simplify behavior
        else if (elements.tagName) {
            elements = [elements];
        }
        // create pattern to find class name
        var reg = new RegExp('(^| )' + myClass + '($| )', 'g');
        // remove class from all chosen elements
        for (var i = 0; i < elements.length; i++) {
            elements[i].className = elements[i].className.replace(reg, ' ');
        }
    }
    //this function chnages the text of a div/span etc using a class or id
    function changeClassText(elements, value) {
        // if there are no elements, we're done
        if (!elements) {
            return;
        }
        // if we have a selector, get the chosen elements
        if (typeof(elements) === 'string') {
            elements = document.querySelectorAll(elements);
        }
        // if we have a single DOM element, make it an array to simplify behavior
        else if (elements.tagName) {
            elements = [elements];
        }
        // add class to all chosen elements
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = value;
        }
    }
    //this function checks if an element has class
    function hasClass(elements, value) {
        // if there are no elements, we're done
        if (!elements) {
            return;
        }
        // if we have a selector, get the chosen elements
        if (typeof(elements) === 'string') {
            elements = document.querySelectorAll(elements);
        }
        // if we have a single DOM element, make it an array to simplify behavior
        else if (elements.tagName) {
            elements = [elements];
        }
        //loop the elements
        for (var i = 0; i < elements.length; i++) {
            //check if it is the one
            //debug
            //console.log(elements[i].className)
            //console.log(value);
            if (elements[i].className.indexOf(value) != -1) {
                return (1);
            }
        }
        return (0);
    }
    //this function hides an element 
    function hideClass(elements) {
        // if there are no elements, we're done
        if (!elements) {
            return;
        }
        // if we have a selector, get the chosen elements
        if (typeof(elements) === 'string') {
            elements = document.querySelectorAll(elements);
        }
        // if we have a single DOM element, make it an array to simplify behavior
        else if (elements.tagName) {
            elements = [elements];
        }
        //loop the elements
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "none";
        }
    }
    //this function shows an element
    function showClass(elements) {
        // if there are no elements, we're done
        if (!elements) {
            return;
        }
        // if we have a selector, get the chosen elements
        if (typeof(elements) === 'string') {
            elements = document.querySelectorAll(elements);
        }
        // if we have a single DOM element, make it an array to simplify behavior
        else if (elements.tagName) {
            elements = [elements];
        }
        //loop the elements
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "";
        }
    }
    //this functions updates the totals for the cart
    function carttotal() {
        //multipily the price by the number of items in the cart
        producttotal = price * itemcount;
        //set it to 8 decimal places as it's Bitcoin
        producttotal = parseFloat(producttotal).toFixed(8);
        changeClassText(document.getElementById('sr-checkouttotal'), producttotal);
        //update counter
        changeClassText(document.querySelector('.sr-count'), itemcount);
        //store product
        if (serverless == 0) {
            var url = serverurl + "api/storeproduct?name=" + name + "&quantity=" + itemcount + "&btcaddress=" + btcaddress + "&price=" + price;
            //call the store produt endpoint
            fetchurl(url, 'storeproduct')
        }
    }
    //this function calls endpoints on the server
    //note : This has to be extended to handle post, put etc it only uses GET at the moment.  
    //       Also it would be good to have proper called backs for the method if we add many more we will make it asynv
    function fetchurl(url, method) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        //call it
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                if (method == "getbtcaddress") {
                    // parse the data
                    var data = JSON.parse(request.responseText);
                    //debug
                    //console.log(data)
                    //set the address
                    btcaddress = data.address;
                    //set the address in the checkout
                    var elbtcaddress = document.getElementById('sr-bitcoinaddress');
                    //set the href
                    elbtcaddress.setAttribute('href', "bitcoin:" + btcaddress);
                    //set the address
                    elbtcaddress.innerText = btcaddress;
                    //do pay from wallet also
                    var elbtcaddress = document.getElementById('sr-bitcoinaddresswallet');
                    //set the href
                    elbtcaddress.setAttribute('href', "bitcoin:" + btcaddress);
                    //do pay from wallet alo
                    //debug
                    //console.log(elbtcaddress)
                    //generate the qr code
                    var elbtcqr = document.getElementById('sr-bitcoinqrcode');
                    elbtcqr.setAttribute('src', "https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=" + btcaddress);
                    //debug
                    //console.log(elbtcqr)
                }
                if (method == "getlightningaddress")
                {
                     // parse the data
                    var data = JSON.parse(request.responseText);
                    //debug
                    //console.log(data);
                    lightningaddress = data.address;
                    console.log(lightningaddress);
                    //set the address in the checkout
                    var eladdress = document.getElementById('sr-lightningaddress');
                    //set the href (*todo)
                    eladdress.setAttribute('href', "lightning:" + lightningaddress);
                    //set the address
                    eladdress.innerText = lightningaddress;
                    //do pay from wallet also
                    var eladdress = document.getElementById('sr-lightningaddresswallet');
                    //set the href
                    eladdress.setAttribute('href', "lightning:" + lightningaddress);
                    //debug
                    //console.log(elbtcaddress)
                    //generate the qr code
                    var elqr = document.getElementById('sr-lightningqrcode');
                    elqr.setAttribute('src', "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=" + lightningaddress);
                    //debug
                    //console.log(elbtcqr)
                    
                    //todo build the liughtning invoice

                    //draw the lightning view
                    cartstate(8);
                }
                if (method == "storeproduct") {
                    //do stuff if you want.
                }
                if (method == "carttemplate") {
                    //debug
                    //console.log(request.responseText);
                    //add the cart templatehtml
                    document.body.insertAdjacentHTML("beforeend", request.responseText);
                    //add the click elements listeners
                    clickElements()
                    //get an address
                    if (serverless == 0) {
                        //todo : this is code is called in 2 place so we can refactor it into the init
                        var elproduct = document.getElementById('sr-add-to-cart');
                        if (elproduct.getAttribute('cart-type') != null) {
                            carttype = elproduct.getAttribute('cart-type');
                            //alert(carttype)
                        }
                        var url = serverurl + "api/btcaddress?uid=" + uid + "&carttype=" + carttype;
                        fetchurl(url, 'getbtcaddress')
                    } else {
                        btcaddress = serverlessbtcaddress;
                        //set the address in the checkout
                        var elbtcaddress = document.getElementById('sr-bitcoinaddress');
                        //set the href
                        elbtcaddress.setAttribute('href', "bitcoin:" + btcaddress);
                        //set the address
                        elbtcaddress.innerText = btcaddress;
                        //do pay from wallet also
                        var elbtcaddress = document.getElementById('sr-bitcoinaddresswallet');
                        //set the href
                        elbtcaddress.setAttribute('href', "bitcoin:" + btcaddress);
                        //do pay from wallet alo
                        //debug
                        //console.log(elbtcaddress)
                        //generate the qr code
                        var elbtcqr = document.getElementById('sr-bitcoinqrcode');
                        elbtcqr.setAttribute('src', "https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=" + btcaddress);
                    }
                }
                if (method == "storeuserdetails") {
                    cartstate(3);
                }
                //process the check
                if (method == "checkpayment") {
                    //process the resulrs
                    var data = JSON.parse(request.responseText);
                    //debug
                    //console.log(data.status)
                    //check if we have enough confirmartions
                    if (data.status == 1) cartstate(4)
                }
            } else {
                // We reached our target server, but it returned an error
            }
        };
        request.onerror = function() {
            // There was a connection error of some sort
        };
        request.send();
    }
    //this function sets the correct addres state, shipping etc
    function checkAddressState() {
        //check if shipping is enabled
        if (shippingaddress == 1) {
            populateDropdown(['sr-shippingcountry'], countries, startcountry);
            //show shipping
            showClass(document.getElementById('sr-addresswrapper'));
            showClass(document.getElementById('sr-shippingaddresswrapper'));
        }
    }
    //this function works with how the cart should look and sets the correct viusal elements
    function cartstate(state) {
        /*
            * = redundant and will be replaced / removed 

            1 = show cart product details
            2 = show customer details screen
            3 = customer detals back*
            4 = custmer details pay click
            5 = bitcoin details back click*
            6 = shipping button clicked
            7 = check payment result
            8 = show lightning view
        */
        //alert(state);
        switch (state) {
            case 1:
                stopPaymentCheck()
                //hide the pay button
                hideClass(document.getElementById('sr-pay'));
                //hide the paid view
                hideClass(document.getElementById('sr-paid'));
                //hide the shipping view
                hideClass(document.getElementById('sr-shipping'));
                //hide the address
                hideClass(document.getElementById('sr-addresswrapper'));
                //hide the check out button
                showClass(document.getElementById('sr-checkout'));
                //hide btc stuff
                hideClass(document.getElementById('sr-bitcoinaddresswrapper'));
                //hide lightning view
                hideClass(document.getElementById('sr-lightningwrapper'));
                //hide the payment toggle, not necessary but may clear up some odd ux flows and costs us nothing. 
                hideClass(document.getElementById('sr-choosepaymenttype'));
                //hide the customer details
                hideClass(document.getElementById('sr-customerdetailswrapper'));
                //hide back button
                hideClass(document.getElementById('sr-back-button'));
                //open it
                addClass(document.querySelector('.sr-cart-container'), 'cart-open');
                //show the product details
                showClass(document.getElementById('sr-cartlistitems'));

                break;
            case 2:
                //show the pay button
                showClass(document.getElementById('sr-pay'));
                //check address
                checkAddressState();
                //hide btc stuff
                hideClass(document.getElementById('sr-checkout'));
                //hide the product details
                hideClass(document.getElementById('sr-cartlistitems'));
                //show the customer details
                showClass(document.getElementById('sr-customerdetailswrapper'));
                showClass(document.getElementById('sr-back-button'));
                //hide btc stuff
                hideClass(document.getElementById('sr-bitcoinaddresswrapper'));
                break;
            case 3: //btc address cart mode 0
                //set the amount to pay in the btc address screen
                //note we are updating the BTC and Lightning totals here we will have to refactor this code is we ever
                //     have a lightning only version of the cart (as stated elsewhere in the notes)
                changeClassText(document.getElementById('sr-lightningtotal'), producttotal + ' BTC');
                changeClassText(document.getElementById('sr-bitcointotal'), producttotal + ' BTC');
                //hide the pay button
                hideClass(document.getElementById('sr-pay'));
                //hide the product details
                hideClass(document.getElementById('sr-cartlistitems'));
                //show btc stuff                
                showClass(document.getElementById('sr-bitcoinaddresswrapper'));
                //hide the customer details                             
                showClass(document.getElementById('sr-back-button'));
                hideClass(document.getElementById('sr-customerdetailswrapper'));
                //check if we are allowing Lightning payment and enable the toggle if we are
                if (acceptlightning == 1)
                {
                    //show payment toggle
                    showClass(document.getElementById('sr-choosepaymenttype'));
                }
                else
                {
                    //hide the payment toggle, not necessary but may clear up some odd ux flows and costs us nothing. 
                    hideClass(document.getElementById('sr-choosepaymenttype'));

                }
                //call the check payment
                //note in serverless mode we will have to make it move to the payment successful page. 
                //note only check if it is a btc paymemt
                if ((serverless == 0) && (addresstype == 0))
                {
                    checkpaymentres = setInterval(startPaymentCheck, 3000)
                }
                break;
            case 4:
                //stop payment timer
                stopPaymentCheck()
                //hide back button
                hideClass(document.getElementById('sr-back-button'));
                //hide payment details
                hideClass(document.getElementById('sr-bitcoinaddresswrapper'))
                //show paid screeb
                showClass(document.getElementById('sr-paid'));
                break;
            case 5: //donaton mode (cart mode 2)
                //get the total no product so this is just the amount in the sr button
                carttotal();
                //sto the payment checker
                stopPaymentCheck();
                //hide the pay button
                hideClass(document.getElementById('sr-pay'));
                //set the amount to pay in the btc address screen
                changeClassText(document.getElementById('sr-btctotal'), producttotal + ' BTC');
                //hide the paid view
                hideClass(document.getElementById('sr-paid'));
                //hide the shiping view
                hideClass(document.getElementById('sr-shipping'));
                //hide the cart header
                hideClass(document.getElementById('sr-cart-header'));
                //hide the customer details
                hideClass(document.getElementById('sr-customerdetailswrapper'));
                //hide back button
                hideClass(document.getElementById('sr-back-button'));
                //hide the product details
                hideClass(document.getElementById('sr-cartlistitems'));
                //hide the check out button
                hideClass(document.getElementById('sr-checkout'));
                //open it
                addClass(document.querySelector('.sr-cart-container'), 'cart-open');
                //show btc stuff                
                showClass(document.getElementById('sr-bitcoinaddresswrapper'));
            case 8: //lightning view
                //debug
                //console.log(lightningaddress);
                //set address type to lightning
                addresstype = 1;
                //show lightning view
                showClass(document.getElementById('sr-lightningwrapper'));
                //hide the btc view
                hideClass(document.getElementById('sr-bitcoinaddresswrapper'));
                //stop the payment timer
                stopPaymentCheck();
                break;
        }
    }
    /*
     *=========================
     *END OF GENERIC FUNCTIONS
     *=========================
     */
    function clickElements() {
        /*
         *===============================
         *START OF ELEMENT CLICK FUNCTIONS
         *================================
         */
        //bitcoin back click
        document.getElementById('sr-back-button').addEventListener('click', function() {
            //reset cart
            cartstate(1);
        });
        //payment click
        document.getElementById('sr-pay').addEventListener('click', function() {
            var cartstring = "";
            var elements = document.getElementsByClassName("sr-input");
            for (var i = 0, len = elements.length; i < len; i++) {
                // elements[i].style ...
                if (cartstring == "") {
                    cartstring = "?" + elements[i].name + '=' + elements[i].value;
                } else {
                    cartstring = cartstring + "&" + elements[i].name + '=' + elements[i].value;
                }
                //console.log(elements[i].name);
                //console.log(elements[i].value);
            }
            //get the product meta
            var elements = document.getElementsByClassName("sr-productmeta");
            //loop through them 
            for (var i = 0, len = elements.length; i < len; i++) {
                if (cartstring == "") {
                    cartstring = "?" + elements[i].name + '=' + elements[i].value;
                } else {
                    cartstring = cartstring + "&" + elements[i].name + '=' + elements[i].value;
                }
            }
            if (serverless == 0) {
                var url = serverurl + "api/storeuserdetails" + cartstring + "&btcaddress=" + btcaddress;
                //console.log(url)
                //call the store produt endpoint
                fetchurl(url, 'storeuserdetails')
            } else {
                cartstate(3)
            }
        });

        //todo : these can be refactoed into one generic copy function
        document.getElementById('sr-bitcoinaddresscopy').addEventListener('click', function() {
            const el = document.createElement('textarea'); // Create a <textarea> element
            el.value = btcaddress; // Set its value to the string that you want copied
            el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
            el.style.position = 'absolute';
            el.style.left = '-9999px'; // Move outside the screen to make it invisible
            document.body.appendChild(el);
            el.select(); // Select the <textarea> content
            document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
            document.body.removeChild(el);
        });

        document.getElementById('sr-lightningaddresscopy').addEventListener('click', function() {
            const el = document.createElement('textarea'); // Create a <textarea> element
            el.value = lightningaddress; // Set its value to the string that you want copied
            el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
            el.style.position = 'absolute';
            el.style.left = '-9999px'; // Move outside the screen to make it invisible
            document.body.appendChild(el);
            el.select(); // Select the <textarea> content
            document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
            document.body.removeChild(el);
        });


        //add to cart click element
        document.querySelector('.sr-checkout').addEventListener('click', function() {
            cartstate(2);
        });
        //add to cart click element
        document.querySelector('.sr-add-to-cart').addEventListener('click', function() {
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
                if ((elements[i].value == '') && (required == 1)) {
                    var productnametmp = elements[i].name;
                    productnametmp = productnametmp.replace("sr-product-", "");
                    alert('please select a ' + productnametmp);
                    return;
                }
            }
            //get details
            var elproduct = document.getElementById('sr-add-to-cart');
            price = elproduct.getAttribute('data-price');
            name = elproduct.getAttribute('data-name');
            preview = elproduct.getAttribute('data-preview');
            //check if cart type has been set and if so override default.
            if (elproduct.getAttribute('cart-type') != null) {
                carttype = elproduct.getAttribute('cart-type');
            }
            /*
            check the cart type.
            note we can (and shall) refactor this as we this is not required for cart type and if we add more in the future we ]
            want this to funciton slicker.
            */
            if (carttype == 0) {
                //will update when we use multipile products
                var productid = 1;
                //todo
                var previewpic = '';
                //increment count (quantity)
                if (itemcount <= quantity) {
                    itemcount = itemcount + 1;
                    carttotal(price)
                    //show it
                    showClass(document.querySelector('.sr-cart-container'))
                    //add item to cart
                    var productlist = document.getElementById('sr-cartlistitems');
                    var itemlist = document.createElement('li');
                    itemlist.className = 'sr-product ';
                    //build produt
                    var prodcuthtml = '';
                    //display default image or the one supplied 
                    if (preview == "") {
                        var prodcuthtml = prodcuthtml + '<div class="sr-product-image"><a href="#0"><img src="' + cdnurl + 'img/sr-product-preview.png" alt="placeholder"></a></div>';
                    } else {
                        var prodcuthtml = prodcuthtml + '<div class="sr-product-image"><a href="#0"><img src="' + preview + '" alt="placeholder"></a></div>';
                    }
                    //product name
                    prodcuthtml = prodcuthtml + '<div class=""><h3><a href="#0">' + name + '</a></h3>';
                    //product price
                    prodcuthtml = prodcuthtml + '<div class="sr-price">' + price + ' BTC</div>';
                    //actions div
                    prodcuthtml = prodcuthtml + '<div class="sr-actions">';
                    //delete option
                    prodcuthtml = prodcuthtml + '<a href="javascript:SR.deleteitem()" class="sr-delete-item">Delete</a>';
                    prodcuthtml = prodcuthtml + '<div class="sr-quantity">';
                    //quantity label
                    //quantity select
                    prodcuthtml = prodcuthtml + '<span class="select"><select id="sr-productquantity" name="sr-productquantity" onchange="SR.changequantity()">';
                    var i = 0;
                    for (i = 1; i < quantity; i++) {
                        if (i == itemcount) prodcuthtml = prodcuthtml + '<option value="' + i + '" selected>' + i + '</option>';
                        else prodcuthtml = prodcuthtml + '<option value="' + i + '">' + i + '</option>';
                    }
                    prodcuthtml = prodcuthtml + '</select></span>';
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
            } else {
                //increment the itemcount as this is a one time donation then let us just set it to 1 for now. 
                //we could make this an incemental thing later.
                itemcount = 1;
                //open the container;   
                showClass(document.querySelector('.sr-cart-container'));
                //render the cart state
                cartstate(5);
            }
        });
        document.querySelector('.sr-paymentoggle').addEventListener('click', function() {
            //check toggle
            if (this.checked == true) {
                //check if we have a lighning address or not 
                if (lightningaddress != '')
                {
                    cartstate(8)

                }
                else
                {
                    //var url = serverurl + "api/lightningaddress?uid=" + uid + "&carttype=" + carttype;
                    //fetchurl(url, 'getlightningaddress'
                    //note: as there is going to be a delay with the toggle to get the lightning address we should disable the toggle 
                    //      button until it has been fetched. 
                    //Stop the payment check timer here as it may take more than a tick to complete
                    stopPaymentCheck();
                    var url = serverurl + "api/lightningaddress?uid=" + uid + "&carttype=" + carttype+'&btcaddress='+btcaddress+'&amount='+producttotal;
                    fetchurl(url, 'getlightningaddress');
                }
            }
            else
            {
                //todo there should a cart state for this.  We can maybe use cartstate 3 if not this may be a good time to
                //     refactor the rendering of the different views.  
                //hide the lightning view
                hideClass(document.getElementById('sr-lightningwrapper'));
                //show the btc view
                showClass(document.getElementById('sr-bitcoinaddresswrapper'));
                //set address type to btc
                addresstype = 0;
                //start the payment checker again
                if ((serverless == 0) && (addresstype == 0))
                {
                    checkpaymentres = setInterval(startPaymentCheck, 3000)
                }

            }
        });
        /*
            cart clicked element

            //todo: should show the product variants in the cart view
        */
        document.querySelector('.sr-cart-trigger').addEventListener('click', function() {
            //debug
            //itemcount = 1;
            //check if cart shoud be shown
            if (itemcount == 0) {
                //always remove as its 0
                removeClass(document.querySelector('.sr-cart-container'), 'cart-open');
            } else {
                if (carttype == 2) {
                    hideClass(document.getElementById('sr-cart-container'));
                } else {
                    //see if the cart is open and toggle it
                    var res = hasClass(document.querySelector('.sr-cart-container'), 'cart-open');
                    if (res == 1) {
                        //stop payment check
                        stopPaymentCheck()
                        //close it
                        removeClass(document.querySelector('.sr-cart-container'), 'cart-open');
                    } else {
                        cartstate(1);
                    }
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
        init: function(Args) {
            /*

            Server vars you can pass set to "" to ignore

             0 = server url
             1 = quantity
             2 = cdn url
             3 = uid
             4 = shipping address
             5 = start country
             6 = serverless
             7 = serverless btc address
             8 = lightning support

            */
            _args = Args;
            //override the server url
            if (_args[0] != '') {
                serverurl = _args[0];
                //alert(serverurl);
            }
            //quantity
            if (_args[1] != "") {
                quantity = _args[1]
            }
            //cdn url
            if (_args[2] != "") {
                cdnurl = _args[2]
            }
            //uid
            if (_args[3] != "") {
                uid = _args[3]
            }
            //shipping address
            if (_args[4] != "") {
                shippingaddress = _args[4]
            }
            //start country
            if (_args[5] != "") {
                startcountry = _args[5]
            }
            //run in serverless mode (mainly a quick way to debug)
            if (_args[6] != "") {
                serverless = _args[6]
            }
            //we require a btc address for serverless mode
            if (_args[7] != "") {
                serverlessbtcaddress = _args[7]
            }
            //set the lightning
            if (_args[8] != "") {
                acceptlightning = _args[8]
            }            
            //load css
            document.head.innerHTML = document.head.innerHTML + '<link href="' + cdnurl + 'cart.css" rel="stylesheet">'
            //fetch the template so we can use themes 
            fetchurl(cdnurl + 'cart.html', 'carttemplate');
        },
        //this function changes the quantity of the item in the cart
        //note : it is in the name space like this as the cart items are created dynamically so the dom does not always know about it's existence 
        //       which means that we have to call it from the onchange in the select old school I.E javascript:SR.chanagequantity() which is not ideal
        //       and we will fix it later.
        changequantity: function() {
            var elquantity = document.getElementById('sr-productquantity');
            itemcountq = elquantity.options[elquantity.selectedIndex];
            itemcount = parseInt(itemcountq.value);
            carttotal();
        },
        //this function deletes an item in the cart
        //note : it is in the name space like this as the cart items are created dynamically so the dom does not always know about it's existence 
        //       which means that we have to call it from the onchange in the select old school I.E javascript:SR.chanagequantity() which is not ideal
        //       and we will fix it later.        
        deleteitem: function() {
            itemcount = 0;
            var productlist = document.getElementById('sr-cartlistitems');
            productlist.innerHTML = "";
            carttotal();
            //close it
            removeClass(document.querySelector('.sr-cart-container'), 'cart-open');
        }
    };
}());