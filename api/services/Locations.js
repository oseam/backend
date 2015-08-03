module.exports = {
	
	getLocation:  function  (address) {
      // Return a new promises
      return new Promise(function(resolve, reject) {
        // Import Geocoder
        var geocoder = require('geocoder');
         geocoder.geocode(address, function ( err, data ) {
            if (err) { reject('Cant convert')};
            if (data) {
              var lat = data.results[0].geometry.location.lat;
              var lng = data.results[0].geometry.location.lng;
              resolve({lng: lng, lat: lat, loc: {'type': 'Point', 'coordinates': [lng, lat]}, postcode: data.results[0].address_components[5].long_name});
            }
          });
      });
    },


}