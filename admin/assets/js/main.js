
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