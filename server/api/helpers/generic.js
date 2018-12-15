

//load SQLlite (use any database you want or none)
const sqlite3 = require("sqlite3").verbose();
//open a database connection
let db = new sqlite3.Database("./db/db.db", err => {
  if (err) {
    console.error(err.message);
  }
});

var Generic = function ()
{
	this.test = function test() {
		console.log('yay')
		console.log(mailOptions);
	}

	/*

		This function mocks the API calls so you can test the API without having to have
		bitcoin core etc set up.  It essentially fakes the output.
	*/
	this.mock = function mock(fakefunction,res)
	{
		//check we are in mock mode
		if (process.env.MOCK == 1)
    	{
    		//todo make switch
			if (fakefunction == 1)
			{
				res.send(JSON.stringify({ address: "2MunEhszXsxiXC1eq4FNpnbH3w5qbyYnooB" }));
				return true;
			}
		}
	}

	/*
	*
	*	This function sends an email. 
	*
	*/
	this.sendMail = function sendMail(id,email) {

		//debug
		//console.log(process.env.emailusername)
		//console.log(process.env.emailpassword)
		//console.log(process.env.emailsmtp);

		const nodemailer = require('nodemailer');
		//create reusable transporter object using the default SMTP transport
		//note : We are usint hte ethereal email servie which fake emails for this demo you can repalce the details with amazons ses, send grid or whatever your preference is.
		let transporter = nodemailer.createTransport({
		    host: process.env.EMAILSMTP,
		    port: 587,
		    secure: false, // true for 465, false for other ports
		    auth: {
		        user: process.env.EMAILUSERNAME, // generated ethereal user
		        pass: process.env.EMAILPASSWORD // generated ethereal password
		    }
		});

		//set up the mail options object
		let mailOptions = {};
		let data = [id]; 
		let sql = `select * FROM emailtemplates where id = ?`;
		db.all(sql, data, (err, rows) => {
			if (err) {
			   console.error('sql error ' + err.message);
			   return;
			}

			if (rows.length > 0)
			{
				//debug
				//console.log(rows[0].fromname);

				// setup email data with unicode symbols
				 mailOptions = {
				    from: '"'+rows[0].fromname+'"<'+rows[0].fromemail+'>', // sender address
				    to: email+','+email, // list of receivers
				    subject: rows[0].subject, // Subject line
				    text: rows[0].body, // plain text body
				    html: rows[0].body // html body
				};

				//debug
				console.log(mailOptions);


				 // send mail with defined transport object
			    transporter.sendMail(mailOptions, (error, info) => {
			        if (error) {
			        	console.error('Failed to send email. ' + error);
			            return console.log(error);
			        }

			        ///debug
			        console.log('Message sent: %s', info.messageId);
			        // Preview only available when sending through an Ethereal account
			        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

			        return

			        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
			        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
			    });
			 }
			 else
			 {
			 	console.log('email id not found')
			 	return
			 }


		});
       
    };

	/*
	*
	*	This function sets the origin headers i have just allowed everything you can set your corrs policy however you want.
	*
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
exports.Generic = Generic;
