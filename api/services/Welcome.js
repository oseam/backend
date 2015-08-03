exports.sendWelcomeEmail = function(options) {
	var nodemailer = require('nodemailer');

	// create reusable transporter object using SMTP transport
	var transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    auth: {
	        user: '', // gmail Username
	        pass: '' // gmail Password
	    }
	});

	// NB! No need to recreate the transporter object. You can use
	// the same transporter object for all e-mails

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: '', // sender address
	    to: '', // list of receivers
	    subject: '', // Subject line
	    text: '', // plaintext body
	    html: '' // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    }else{
	        console.log('Message sent: ' + info.response);
	    }
	});
};
