// Service provider model
module.exports = {

  attributes: {
  	email: {
  		type: 'email',
  		unique: true,
  		required: true,
      protected: true
  	},
  	password: {
  		type: 'string',
  		required: true,
      string: true,
  		minLength: 6,
      protected: true
  	},
    firstName: {
      type: 'string',
      required: true,
      maxLength: 15,
      alpha: true
    },
    lastName: {
      type: 'string',
      required: true,
      maxLength: 15,
      alpha: true
    },
    fullName: function() {
      return this.firstName + ' ' + this.lastName
    },
    businessName: {
      type: 'string',
      maxLength: 20,
      string: true
    },
    address: {
      type: 'string',
      maxLength: 100,
      required: true,
      string: true
    },
    postcode: {
      type: 'integer',
      required: true,
      min: 0,
      max: 10000
    },
    location: {
      type: 'json',
      index:'2dsphere',
      required: true
    },
    service: {
      type: 'array',
      array: true
    },
    verified: {
      type: 'boolean',
      defaultsTo: false
    },
    abn: {
      type: 'string',
      required: true,
      alphanumeric: true,
      unique: true,
      minLength: 11,
      maxLength: 11
    },
    stripe_account: {
      type: 'boolean',
      defaultsTo: false,
      protected: true
    },
    stripeId: {
      type: 'string',
      string: true,
      unique: true,
      protected: true
    },
    schedule: {
      type: 'array',
      array: true,
      protected: true
    },
    accessToken: {
      type: 'string',
      string: true,
      protected: true
    },
    bookings: {
      collection: 'Booking',
      via: 'providerId'
    },
    notifications: {
      collection: 'ProviderNotification',
      via: 'providerId'
    },
    avatar: {
      type: 'string'
    },
    wage: {
      type: 'integer',
      integer: true
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
      },
      firstName: {
        required: 'Sir name is required',
        maxLength: 'Name is too long'
      },
      lastName: {
        required: 'Family name is required',
        maxLength: 'Name is too long'
      },
      address: {
        required: 'Address is required',
        maxLength: 'Address excess 100 chars',
        string: 'Incorrect format'
      },
      abn: {
        required: 'ABN is required',
        alphanumeric: 'Incorrect format',
        unique: 'Wrong ABN',
        minLength: 'ABN is only 11 chars',
        maxLength: 'ABN is only 11 chars'
      }
  },

  seedData:[
      {
        email: 'provider1@oseam.com',
        password: '123456789',
        firstName: 'Tom',
        lastName: 'Hank',
        abn: 'hie83h8fyh6',
        service: ['mowing', 'leaf_removal', 'yard_cleaning'],
        address: '400 Swanton Street, Carton',
        location: { type: 'Point', coordinates: [144.963089, -37.807880]},
        avatar: 'https://cheerseeng.s3.amazonaws.com/fe51cc03-9d90-4746-a5ce-26b540e30b41.jpg',
        postcode: 3053,
        wage: 20
      },
      {
        email: 'provider2@oseam.com',
        password: '123456789',
        firstName: 'Jery',
        lastName: 'Code',
        abn: 'hie83h90yh6',
        service: ['mowing', 'leaf_removal', 'yard_cleaning'],
        address: '600 Victoria Street, Brunswick East',
        location: { type: 'Point', coordinates: [144.946327, -37.804458]},
        avatar: 'https://cheerseeng.s3.amazonaws.com/9dde429d-6ff2-45f9-9a5d-fdc16c585df1.jpg',
        postcode: 3057,
        wage: 21
      },
      {
        email: 'provider3@oseam.com',
        password: '123456789',
        firstName: 'Marry',
        lastName: 'Code',
        abn: 'hie93h90yh6',
        service: ['mowing', 'leaf_removal', 'yard_cleaning'],
        address: '1 Burgundy street, Heidelberg',
        location: { type: 'Point', coordinates: [145.071978, -37.756504]},
        avatar: 'https://cheerseeng.s3.amazonaws.com/4aa88884-a103-4631-b86b-faeac4ca9a6c.jpg',
        postcode: 3084,
        wage: 22
      },
      {
        email: 'provider4@oseam.com',
        password: '123456789',
        firstName: 'Marry',
        lastName: 'Lyn',
        abn: 'hqw93h90yh6',
        service: ['mowing', 'leaf_removal', 'yard_cleaning'],
        address: '1 Mary Street, Hawthorn',
        location: { type: 'Point', coordinates: [145.027939, -37.817065]},
        avatar: 'https://cheerseeng.s3.amazonaws.com/f63cc380-2d6e-4721-98a2-ce70be8855e9.jpg',
        postcode: 3122,
        wage: 20        
      },
      {
        email: 'provider5@oseam.com',
        password: '123456789',
        firstName: 'Justin',
        lastName: 'Lyn',
        abn: 'aqw93h90yh6',
        service: ['mowing', 'leaf_removal', 'yard_cleaning'],
        address: '1 Neerim Road, Caulfield',
        location: { type: 'Point', coordinates: [145.029717, -37.885509]},
        avatar: 'https://cheerseeng.s3.amazonaws.com/8703bfb1-1d67-437c-a29c-8202dcb21024.jpg',
        postcode: 3162,
        wage: 21        
      },
      {
        email: 'provider6@oseam.com',
        password: '123456789',
        firstName: 'Justi',
        lastName: 'Lew',
        abn: 'aqw23h90yh6',
        service: ['mowing', 'leaf_removal', 'yard_cleaning'],
        address: '1 Clow Street, Dandenong',
        location: { type: 'Point', coordinates: [145.212165, -37.984322]},
        avatar: 'https://cheerseeng.s3.amazonaws.com/fe51cc03-9d90-4746-a5ce-26b540e30b41.jpg',
        postcode: 3175,
        wage: 22        
      },
      {
        email: 'provider7@oseam.com',
        password: '123456789',
        firstName: 'Hook',
        lastName: 'Lew',
        abn: 'aqw23h90yh4',
        service: ['mowing', 'leaf_removal', 'yard_cleaning'],
        address: '1 Clelland Road, Brooklyn',
        location: { type: 'Point', coordinates: [144.832144, -37.823342]},
        avatar: 'https://cheerseeng.s3.amazonaws.com/9dde429d-6ff2-45f9-9a5d-fdc16c585df1.jpg',
        postcode: 3012,
        wage: 23        
      },
      {
        email: 'provider8@oseam.com',
        password: '123456789',
        firstName: 'Cook',
        lastName: 'Lew',
        abn: 'aqw23h90ys4',
        service: ['mowing', 'leaf_removal', 'yard_cleaning'],
        address: '1 Main Street, Thomastown',
        location: { type: 'Point', coordinates: [145.012958, -37.680443]},
        avatar: 'https://cheerseeng.s3.amazonaws.com/4aa88884-a103-4631-b86b-faeac4ca9a6c.jpg',
        postcode: 3074,
        wage: 20        
      },
    ],

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
  //       html: 'http://localhost:1337/api/v1/provider_confirm/' + attrs.id // html body
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

