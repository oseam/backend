/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	email: {
  		type: 'email',
  		required: true,
      unique: true,
      protected: true
  	},
  	password: {
  		type: 'string',
  		required: true,
  		minLength: 6,
      string: true,
      protected: true
  	},
    firstName: {
      type: 'string',
      alpha: true,
      maxLength: 15
    },
    lastName: {
      type: 'string',
      maxLength: 15,
      alpha: true
    },
    fullName: function() {
      return this.firstName + ' ' + this.lastName
    },
    address: {
      type: 'string',
      maxLength: 30,
      string: true,
    },
    verified: {
      type: 'boolean',
      defaultsTo: false
    },
    apiProvider: {
      type: 'string',
    },
    accessToken: {
      type: 'string',
      string: true,
      protected: true
    },
    bookings: {
      collection: 'Booking',
      via: 'userId'
    },
    notifications: {
      collection: 'UserNotification',
      via: 'userId'
    },
    avatar: {
      type: 'string'
    }
  },
//model validation messages definitions
  validationMessages: { //hand for i18n & l10n
      email: {
          required: 'Email is required',
          email: 'Provide valid email address',
          unique: 'Email address is already taken'
      },
      password: {
          required: 'Password is required',
          minLength: 'Password must be more than 6 chars'
      }
  },

  beforeCreate: function (attrs, next) {
  	var bcrypt = require('bcryptjs');
  	var jwt = require('jsonwebtoken');
  	
  	bcrypt.genSalt(10, function(err, salt) {
  		if (err) return next(err);
      // Hash password
  		bcrypt.hash(attrs.password, salt, function(err, hash) {
  			if (err) return next(err);

  			attrs.password = hash;
  			next();
  		});
  	});
  },

  // afterCreate: function (attrs, next) {
  //   var nodemailer = require('nodemailer');

  //   // create reusable transporter object using SMTP transport
  //   var transporter = nodemailer.createTransport({
  //       service: 'Gmail',
  //       auth: {
  //           user: 'tuiqwe@gmail.com',
  //           pass: 'dutevcyvlexpmhva'
  //       }
  //   });

  //   // NB! No need to recreate the transporter object. You can use
  //   // the same transporter object for all e-mails

  //   // setup e-mail data with unicode symbols
  //   var mailOptions = {
  //       from: 'tuiqwe@gmail.com', // sender address
  //       to: attrs.email, // list of receivers
  //       subject: 'Welcome', // Subject line
  //       text: 'Welcome', // plaintext body
  //       html: 'http://localhost:1337/api/v1/user_confirm/' + attrs.id // html body
  //   };


  //   // send mail with defined transport object
  //   transporter.sendMail(mailOptions, function(error, info){
  //       if(error){
  //           console.log(error);
  //       }else{
  //           console.log('Message sent: ' + info.response);
  //       }
  //   });
  // }
  
};

