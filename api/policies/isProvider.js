var jwt = require('jsonwebtoken');
var secret = sails.config.session.secret;

module.exports = function isProvider(req, res, next) {
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

    if (!decoded.provider) {
      return res.json(401, {err: 'Is not provider'});
    } else {
      Provider.findOne({id: decoded.provider.id, accessToken: token}, function (err, provider) {
        if (err) return res.json(401, {err: 'Invalid provider'});      

        if (!provider) {
          return res.json(401, {err: 'Invalid provider'});
        } else {
          req.provider = decoded.provider;

          next();
        }
      })

    }
  });
};