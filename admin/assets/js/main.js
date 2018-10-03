
//server call to make the AJAX calls to
//note:  we should find to set this less manually
var serverurl = "http://127.0.0.1:3000/";
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

function checkProcessed(address)
{
	var geturl = serverurl+'api/monitor?address='+address+'&token='+token;
	//alert(geturl);
	ajaxGET(geturl,"checkProcessedDone()");
}

function checkSwept(address)
{
	var geturl = serverurl+'api/sweep?address='+address+'&token='+token;
	//alert(geturl);
	ajaxGET(geturl,"checkSweptDone()");
}


function checkSweptDone()
{
	var result = $.parseJSON(ajaxdata);
	if (result.status == 'swept')
	{
		var geturl = serverurl+'admin/payments?token='+token;
		ajaxGET(geturl,"paymentsDone()");
	}
	else
	{
		if (result.status == "already swept")
		{
			alert('Payment already swept');
			var geturl = serverurl+'admin/payments?token='+token;
			ajaxGET(geturl,"paymentsDone()");
		}
		if (result.status == "not swept")
			alert('Payment not swept');
	}
}



function paymentsDone()
{
	var result = $.parseJSON(ajaxdata);
	//console.log(result.results);
	//console.log(ajaxdata);
	var t = $('#example').DataTable();
	t
    .clear()
    .draw();
	jQuery.each( result.results, function( index, res )
	{
		//console.log(res);
		//net 1 = live 2 = test
		var processed = 'Yes';
		var swept = 'No';
		var blockexplorerurl = "https://live.blockcypher.com/btc-testnet/address/";
		//set the block explorer url
		blockexplorerurl = blockexplorerurl+res.address+'/';
		var actions = '<a href="'+blockexplorerurl+'" target="_blank"><i class="fas fa-external-link-square-alt"></i>View</a>'
		if (res.processed == 0)
		{	
			//set processed to no
			processed = 'No';
			//add the check button
			actions = actions + '<a href="javascript:checkProcessed(\''+res.address+'\')"><i class="fas fa-external-link-square-alt"></i>Process</a>'

		}
		else
		{
			if (res.swept == 0)
			{
				actions = actions + '<a href="javascript:checkSwept(\''+res.address+'\')"><i class="fas fa-external-link-square-alt"></i>Sweep</a>'
			}

		}
		
	
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

function loginDone()
{
	var result = $.parseJSON(ajaxdata);
	if (result.token != 0)
	{
		
		setCookie('srcookie',result.token);
		window.location.href = "index.html";
	}
	else
	{
		alert('invalid login details');
	}

	//console.log(result.token)
}
function ajaxGET(url,parentcallback)
{
   // console.log('dddd');
   //console.log('url'+url);

  //console.log(parentcallback);
  	$.ajaxSetup ({
	    cache: false
	});
	var jqxhr = $.get(url, function(data) { })
  	.success(function(result) {
  		//logIt(result);
  		ajaxdata = result;
  		
  		var tmpFunc = new Function(parentcallback);
		tmpFunc();

	})
  	.error(function(result) {

   	})
  	.complete(function() {
  	});
}


$('#updatesettings').click(function() 
{
  address = $('#address').val();
  //alert(address);
 // pass = $('#password').val();
  var geturl = serverurl+'admin/updatesettigs?address='+address+'&token='+token;
  ajaxGET(geturl,"updatesettigsDone()");
});

$('#login').click(function() 
{
  uname = $('#username').val();
  pass = $('#password').val();
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