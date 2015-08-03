/**
 * Location Controller
 *
 */
module.exports = {

  ip_lookup: function (req, res) {

    // var geoip = require('geoip-lite');
    var request = require('request');
    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;

    // var geo = geoip.lookup(ip);

    // if (!geo) return res.notFound();

    // res.ok(geo);
    url = 'http://freegeoip.net/json/' + ip

    request.get(url, function(error, response, body) {
      if (error) return res.notFound();
      res.ok(body);
    })
  },
  address_lookup: function (req, res) {
    var geocoder = require('geocoder');
    var address = req.param('address');

    // Geocoding
    geocoder.geocode(address, function ( err, data ) {
      if (err) return res.notFound();
      res.ok(data.results[0]);
    });
  },
  latlng_lookup: function (req, res) {
    var geocoder = require('geocoder');
    var lat = req.param('lat');
    var lng = req.param('lng');

    geocoder.reverseGeocode(lat, lng, function ( err, data ) {
      if (err) return res.notFound();
      res.ok(data.results[0]);
    });
  }
}