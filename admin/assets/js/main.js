
//server call to make the AJAX calls to
//set url to production
var serverurl = "http://srcryptoapi.eu-west-1.elasticbeanstalk.com/";
//check if we are local
//note : set this whatever your local instance is 127.0.0.1 for example
if(window.location.href.indexOf("srcryptoadmin") > -1) 
{
	alert('dd');
	serverurl = "http://127.0.0.1:3000/";
}

//hold the return from the server
var ajaxdata = '';
//hold the session token 
var token = '';

//set a cookie
function setCookie(cname, cvalue) {
	document.cookie = cname + "="  +cvalue+ "; path=/";
}

//get a cookie
function getCookie(cname) {
	var i, c, ca, nameEQ = cname + "=";
    ca = document.cookie.split(';');
    for(i=0;i < ca.length;i++) {
        c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return '';
}

//process the return from the server settings calls
function settingsDone()
{
	var result = $.parseJSON(ajaxdata);
	//debug
	//console.log(result.results[0]);
	if (result.results[0] != '0')
	{
		//alert(result.results[0].coldstorageaddress);
		$('#address').val(result.results[0].coldstorageaddress);
	}
	else
	{
		alert('settings not updated');
	}
	
}

//process he return form the update settings call
//note: I know this should be on the post for the settings endpoint but I have been lazy.  Will refactor it later.
function updatesettigsDone()
{
	//get the result
	var result = $.parseJSON(ajaxdata);
	//debug
	//console.log(result.results);
	//check update status
	if (result.results == 'ok')
	{
		alert('settings updated');

	}
	else
	{
		alert('eror updating settings');
	}
	
}

//check the result from the processed server call
function checkProcessedDone()
{
	//process the result
	var result = $.parseJSON(ajaxdata);
	//check the status
	if (result.status == 'confirmed')
	{
		//refresh the payment table
		var geturl = serverurl+'admin/payments?token='+token;
		ajaxGET(geturl,"paymentsDone()");
	}
	else
	{
		//alert the user to an error
		alert('Payment not confirmed');
	}
}

//call the server to see if the payment has been processed
function checkProcessed(address)
{
	var geturl = serverurl+'api/monitor?address='+address+'&token='+token;
	//alert(geturl);
	ajaxGET(geturl,"checkProcessedDone()");
}

//call the server and move the payment to cold storage.
function checkSwept(address)
{
	var geturl = serverurl+'api/sweep?address='+address+'&token='+token;
	//alert(geturl);
	ajaxGET(geturl,"checkSweptDone()");
}

//check the results of the sever 
function checkSweptDone()
{
	//process results
	var result = $.parseJSON(ajaxdata);
	//check if it ws swept
	if (result.status == 'swept')
	{
		//reload the payments page
		var geturl = serverurl+'admin/payments?token='+token;
		ajaxGET(geturl,"paymentsDone()");
	}
	else
	{
		//check the error
		if (result.status == "already swept")
		{
			//already moved to cold storage
			alert('Payment already swept');
			var geturl = serverurl+'admin/payments?token='+token;
			ajaxGET(geturl,"paymentsDone()");
		}
		if (result.status == "not swept")
		{
			//unknown error
			alert('Payment not swept');
		}
	}
}


//process the payments done 
function paymentsDone()
{
	//parse the result
	var result = $.parseJSON(ajaxdata);
	//console.log(result.results);
	//console.log(ajaxdata);

	//grab the table
	var t = $('#example').DataTable();
	//empty the table
	t
    .clear()
    .draw();
    //loop through the results returned from the server
	jQuery.each( result.results, function( index, res )
	{
		//console.log(res);
		//net 1 = live 2 = test

		//vars 
		var processed = 'Yes';
		var swept = 'Yes';
		//set the block explorer url
		var blockexplorerurl = "https://live.blockcypher.com/btc-testnet/address/";
		blockexplorerurl = blockexplorerurl+res.address+'/';
		//actions column
		var actions = '<a href="'+blockexplorerurl+'" target="_blank"><i class="fas fa-external-link-square-alt"></i>View</a>'
		//check if the payment was processed
		if (res.processed == 0)
		{	
			//set processed to no
			processed = 'No';
			//add to the action
			actions = actions + '<a href="javascript:checkProcessed(\''+res.address+'\')"><i class="fas fa-external-link-square-alt"></i>Process</a>'

		}
		else
		{
			//check if it was swept
			//note: you should never have an unprocessed payment that was swept but it does not harm to have this additional check.
			if (res.swept == 0)
			{
				//add to the acction 
				swept = "No";
				actions = actions + '<a href="javascript:checkSwept(\''+res.address+'\')"><i class="fas fa-external-link-square-alt"></i>Sweep</a>'
			}

		}
		
		//add the row to the table
		t.row.add( [
			res.id,
			'<a href="'+blockexplorerurl+'" target="_blank">'+res.address+'</a>',
			processed,
			swept,
			res.amount,
			actions
		] ).draw( false );
	});
	
}

//process the server return call from login
function loginDone()
{
	//parse the results
	var result = $.parseJSON(ajaxdata);
	//debug	
	//console.log(result.token)

	//check for token
	if (result.token != 0)
	{
		//get the cookie
		setCookie('srcookie',result.token);
		//redirect to index page
		window.location.href = "index.html";
	}
	else
	{
		//issue with login
		alert('invalid login details');
	}

}

//generic ajax call function
function ajaxGET(url,parentcallback)
{
	//debug
	//console.log('url'+url);
	//console.log(parentcallback);

	//setup
	$.ajaxSetup ({
   	 cache: false
	});
	//make the call
	var jqxhr = $.get(url, function(data) { })
		.success(function(result) {
			//logIt(result);

			//store the result
			ajaxdata = result;
			//set the done funtion
			var tmpFunc = new Function(parentcallback);
			//call the done funtion
			tmpFunc();
	})
	.error(function(result) {

	})
	.complete(function() {
	});
}

//update settings click
$('#updatesettings').click(function() 
{
	//get the address
  	address = $('#address').val();
  	//debug
  	//alert(address);

  	//call the server updatesettings url
  	var geturl = serverurl+'admin/updatesettigs?address='+address+'&token='+token;
  	ajaxGET(geturl,"updatesettigsDone()");
});

//login click
$('#login').click(function() 
{
	//get detals
 	uname = $('#username').val();
 	pass = $('#password').val();
 	//call the login server url
  	var geturl = serverurl+'admin/login?uname='+uname+'&pass='+pass;
  	ajaxGET(geturl,"loginDone()");
});


$(document).ready(function() 
{
	//get the cookie
    token = getCookie('srcookie');
    //debug
    //console.log(token);
    //setCookie('srcookie','12345');
    //force login
    //setCookie('srcookie','');
    //get the url
    var url = window.location.href;

    //check if it is blank
    if (token == '') 
    {
    	
    	//check if it is not login and redirect
    	if (url.substr(url.lastIndexOf('/') + 1) != 'login.html')
    	{
    		window.location.href = "login.html";
    	}

    }
    else
    {
    	//check what page we are on
		//check if it is the payment page
		if (url.substr(url.lastIndexOf('/') + 1) == 'payments.html')
		{
			//alert(token);
			//make a server call
			var geturl = serverurl+'admin/payments?token='+token;
			ajaxGET(geturl,"paymentsDone()");
		}
		if (url.substr(url.lastIndexOf('/') + 1) == 'settings.html')
		{
			//make a server call
			var geturl = serverurl+'admin/settings?token='+token;
			ajaxGET(geturl,"settingsDone()");
		}
    	$('#wrapper').removeClass('d-none');
    	//load the table
    }

} );