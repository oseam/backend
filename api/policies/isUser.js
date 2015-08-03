var jwt = require('jsonwebtoken');
var secret = sails.config.session.secret;

module.exports = function isUser(req, res, next) {
  var token;

  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return res.json(401, {err: 'Format is Authorization: Bearer [token]'});
    }
  } else {
    return res.json(401, {err: 'No Authorization header was found'});
  }

  jwt.verify(token, secret, function(err, decoded) {
    if (err) return res.json(401, {err: 'The token is not valid'});

    if (!decoded.user) {
      return res.json(401, {err: 'Is not user'});
    } else {
      User.findOne({id: decoded.user.id, accessToken: token}, function (err, user) {
        if (err) return res.json(401, {err: 'Invalid user'});      

        if (!user) {
          return res.json(401, {err: 'Invalid user'});
        } else {
          req.user = decoded.user;

          next();
        }
      })
    }
  });
};