
var serverurl = "http://127.0.0.1:3000/";
var ajaxdata = '';

function setCookie(cname, cvalue) {
	document.cookie = cname + "="  +cvalue+ "; path=/";
}

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

$('#login').click(function() 
{
  uname = $('#username').val();
  pass = $('#password').val();
  var url = serverurl+'admin/login?uname='+uname+'&pass='+pass;
  ajaxGET(url,"loginDone()");
});


$(document).ready(function() 
{
    //check for login

    //debug
    //setCookie('srcookie','12345');
    //force login
    //setCookie('srcookie','');


    //get the cookie
    var x = getCookie('srcookie');
    //debug
    //console.log(x);

    //check if it is blank
    if (x == '')
    {
    	//get the url
    	var url = window.location.href;
    	//check if it is not login and redirect
    	if (url.substr(url.lastIndexOf('/') + 1) != 'login.html')
    	{
    		window.location.href = "login.html";
    	}

    }
    else
    {
    	//check if we are on login page and if so redirect to logged in page
    	var url = window.location.href;
    	if (url.substr(url.lastIndexOf('/') + 1) == 'login.html')
    	{
    		window.location.href = "index.html";
    	}
    	else
    	{
	    	//we could look verify here but we may as welll do that when a request to the server is made
	    	$('#wrapper').removeClass('d-none');
	    	//load the table
	    	$('#example').DataTable();
    	}
    }


} );