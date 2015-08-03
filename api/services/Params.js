module.exports = {
	
	check:  function  (obj) {
      // Return a new promises
      return new Promise(function(resolve, reject) {
        // Import Geocoder
        if (!obj['address']) return res.badRequest({err: 'No address'});
        if (!obj['bookTime']) return res.badRequest({err: 'No booktime'});
        if (!obj['estimatedDuration']) return res.badRequest({err: 'No estimatedDuration'});
        if (!obj['services']) return res.badRequest({err: 'No services'});
      });
    },


}