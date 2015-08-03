var jwt = require('jsonwebtoken');
var secret = sails.config.session.secret;

module.exports = function isAdmin(req, res, next) {
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

    if (!decoded.admin) {
      return res.json(401, {err: 'Is not admin'});
    } else {
      Admin.findOne({id: decoded.admin.id, accessToken: token}, function (err, admin) {
        if (err) return res.json(401, {err: 'Invalid admin'});      

        if (!admin) {
          return res.json(401, {err: 'Invalid admin'});
        } else {
          req.admin = decoded.admin;

          next();
        }
      })

    }
  });
};