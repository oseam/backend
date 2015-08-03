var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    bcrypt = require('bcryptjs');

// Passport auth for user
passport.use('user-local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({email: email}, function(err, user) {
        if (err) {
          return done(true, null, err);
        }; 
        if (!user) {
          return done(null, false, {
            message: "Email is not registered"
          });
        } else {
          bcrypt.compare(password, user.password, function(err, res) {
            if (!res) {
              return done(null, false, {
                message: 'Invalid Password'
              });
            } else {
              return done(null, user);
            }
          });
        }
      });
    })
);

// Passport auth for service provider
passport.use('provider-local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      Provider.findOne({email: email}, function(err, provider) {
        if (err) {
          return done(true, null, err);
        };

        if (!provider) {
          return done(null, false, {
            message: 'Incorrect Provider'
          });
        } else {
          bcrypt.compare(password, provider.password, function(err, res) {
            if (!res) {
              return done(null, false, {
                message: 'Invalid Password'
              });
            } else {
              return done(null, provider);
            }
          });
        }
      });
    })
);

// Admin auth for service admin
passport.use('admin-local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      Admin.findOne({email: email}, function(err, admin) {
        if (err) {
          return done(err, null);
        };

        if (!admin) {
          return done(null, false, {
            message: 'Incorrect Admin'
          });
        } else {
          bcrypt.compare(password, admin.password, function(err, res) {
            if (!res) {
              return done(null, false, {
                message: 'Invalid Password'
              });
            } else {
              return done(null, admin);
            }
          });
        }
      });
    })
);

// Facebook auth only work online
passport.use(new FacebookStrategy({
    clientID: '', // Add your Facebook Client ID
    clientSecret: '', // Add your Facebook Client Secret
    callbackURL: '', // Add Callback URL
    profileFields: ['emails', 'id', 'displayName', 'photos']
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({email: profile.emails[0].value}, function(err, user) {
      if (err) throw(err);

      if (!err && user != null)      return done(null, user);

      User.create({
        apiProvider: 'Facebook',
        email: profile.emails[0].value,
        password: profile.id,
        verified: true
      }, function (err, user) {
        if (err) return done(err, null);
        
        return done(null, user);
      });
    });
  }
));

module.exports = {
    http: {
        customMiddleware: function(app) {
            app.use(passport.initialize());
            app.use(passport.session());
        }
    }
};
