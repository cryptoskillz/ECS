var HelperFunctions = function ()
{

	/*
========================
START OF GENERIC FUNCTION
========================
*/

function setHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  ); // If needed
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  ); // If needed
  res.setHeader("Access-Control-Allow-Credentials", true); // If needed
  return res;
}

/*
========================
END OF GENERIC FUNCTION
========================
*/

	this.setHeaders = function setHeaders(res) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
		); // If needed
		res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
		); // If needed
		res.setHeader("Access-Control-Allow-Credentials", true); // If needed
		return res;
	}
}
exports.HelperFunctions = HelperFunctions;
