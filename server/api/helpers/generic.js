var Generic = function ()
{

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
exports.Generic = Generic;
