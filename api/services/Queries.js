module.exports = {

  // Search and return a list of provider id whom can't provide service
  searchBusyProvider: function (lng, lat, service, bookTime) {
	  
    return new Promise(function(resolve, reject) {
	        
	  Provider.native(function(err, provider){
	    provider.geoNear(lng, lat, { maxDistance: 10/111.12, query: {'service': {$all: service}, 'schedule.startTime': {$lte: bookTime}, 'schedule.endTime': {$gt: bookTime}}, distanceMultiplier: 6371, spherical: true, uniqueDocs: true}, function (mongoErr, providers) {
	      if (mongoErr) { reject(mongoErr)
	      } else if (providers.results.length === 0) {
	        resolve([]);
	      } else {
	        async.map(providers.results,
	          function (result, callback) {
	            callback (null, result.obj._id);
	          },
	          function (err, results) {
	            if (err) { reject(err); };
	            if (results) { resolve(results) };
	          }
	        );
	      };
	    });              
	  });

	})
  },

  // Search and return at max 3 providers who can perform the job
  searchFreeProvider: function (lng, lat, service, bookTime, ids) {
	  
	return new Promise(function(resolve, reject) {
	        
	  Provider.native(function(err, provider){
	    provider.geoNear(lng, lat, { limit: 3, maxDistance: 10/111.12, query: {'_id': {$nin: ids},'service': {$all: service}}, distanceMultiplier: 6371, spherical: true, uniqueDocs: true}, function (mongoErr, providers) {
	      if (mongoErr) { reject(mongoErr);  
	      } else if (providers.results.length === 0) {
	        reject('Provider not found');
	      } else {
	      	var result = _.map(providers.results, function(obj) {
	      		delete obj.obj.accessToken;
	      		delete obj.obj.email;
	      		delete obj.obj.password;
	      		return obj;
	      	});
	        resolve(result);
	      }
	    });              
	  });

	})
  },

  // Update provider schedule to provide a task. NOTE: id is ObjectID
  updateProviderAddSchedule: function (id, bookTime, endTime) {

	return new Promise(function(resolve, reject) {

      Provider.native(function(err, provider) {
        provider.update({_id: id}, {$push: {schedule: {startTime: bookTime, endTime: endTime }}}, function (err, error) {
          if (err) { reject(err);
          } else { resolve(id); };
	    });
	  });

	})
  },

  // Remove a time slot from schedule. NOTE: id is ObjectID
  updateProviderRemoveSchedule: function (id, bookTime, endTime) {

	return new Promise(function(resolve, reject) {

      Provider.native(function(err, provider) {
        provider.update({_id: id}, {$pull: {schedule: {startTime: bookTime, endTime: endTime }}}, function (err, error) {
          if (err) { 
          	reject(err); 
	      } else { 
	        resolve(id); 
	      };
	    });
	  });
	})
  },

  // Update services in Bookings with bookingId
  updateServiceWithBookingID: function (booking) {

    return new Promise(function(resolve, reject) {
	  async.map(booking.services, function (service, callback) {

	    if (service.name === 'mowing') {
	      Mowing.update(service.id, {bookingId: booking.id}, function(err, service) {
	        callback(null, service);
	      });
	    } else if (service.name === 'leaf_removal') {
	      LeafRemoval.update(service.id, {bookingId: booking.id}, function(err, service) {
	        callback(null, service);
	      });
	    } else if (service.name === 'weed_control') {
	      WeedControl.update(service.id, {bookingId: booking.id}, function(err, service) {
	        callback(null, service);
	      });
	    } else if (service.name === 'yard_cleaning') {
	      YardCleaning.update(service.id, {bookingId: booking.id}, function(err, service) {
	        callback(null, service);
	      });
	    }

	  }, function (err, results) {
	    if (err) { reject(err)};
	    if (results) {resolve({booking: booking, services: results});};
	  });

	})
  },

  // Update services in Bookings with providerId
  updateServiceWithProviderID: function (providerId, id) {

    return new Promise(function(resolve, reject) {
      
      Booking.findOne({id: id}).populateAll().exec(function (err, booking) {
	    if (err) { reject(err); };
        async.parallel([
            function(callback){
              if (booking.mowing) {
			      Mowing.update(booking.mowing.id, {providerId: providerId}, function(err, service) {
			        if (err) { callback(err); };
			        if (service) { callback(null, service); };
			      });
              } else { callback(null, true); };
            },
            function(callback){
              if (booking.leafRemoval) {
			      LeafRemoval.update(booking.leafRemoval.id, {providerId: providerId}, function(err, service) {
			        if (err) { callback(err); };
			        if (service) { callback(null, service); };
			      });
              } else { callback(null, true); };
            },
            function(callback){
              if (booking.weedControl) {
			      WeedControl.update(booking.weedControl.id, {providerId: providerId}, function(err, service) {
			        if (err) { callback(err); };
			        if (service) { callback(null, service); };
			      });
              } else { callback(null, true); };
            },
            function(callback){
              if (booking.yardCleaning) {
			      YardCleaning.update(booking.yardCleaning.id, {providerId: providerId}, function(err, service) {
			        if (err) { callback(err); };
			        if (service) { callback(null, service); };
			      });
              } else { callback(null, true); };
            },
        ],
        function(err, results){
          if (err) { reject(err);
          } else {
            resolve(results);
          }
        });
	  })

	})
  },

  // Search for service (like mowing, etc...)
  searchServiceWithId: function (name, id) {

	return new Promise(function(resolve, reject) {
      if (name === 'mowing') {
        Mowing.findOne(id, function(err, service) {
          if (err) { reject(err) } else if (service) { resolve(service) };
        });
      } else if (name === 'leaf_removal') {
        LeafRemoval.findOne(id, function(err, service) {
          if (err) { reject(err) } else if (service) { resolve(service) };
        });
      } else if (name === 'weed_control') {
        WeedControl.findOne(id, function(err, service) {
          if (err) { reject(err) } else if (service) { resolve(service) };
        });
      } else if (name === 'yard_cleaning') {
        YardCleaning.findOne(id, function(err, service) {
          if (err) { reject(err) } else if (service) { resolve(service) };
        });
      }
	})
  },

  // Search for services in Booking list
  searchServiceInBookings: function (bookings) {

	return new Promise(function(resolve, reject) {
  	  async.map(bookings, 
  	  	function (booking, callback) {
  	  	  async.map(booking.services,
  	  	  	function (service, callback) {
              Queries.searchServiceWithId(service.name, service.id)
                .then(function(service) {
                  callback(null, service);
                })
                .catch(function(err) {
                  callback(err);
                })
  	  	  	},
  	  	  	function (err, results) {
  	  	  	  if (err) callback(err);	
  	  	  	  booking['info'] = results;
  	  	  	  callback(null, booking);
  	  	  	}
  	  	  	)
		  },
		  function (err, results) {
		  	if (err) { 
		  	  reject(err);
		  	} else {
	 	  	 resolve(results);
	 	  	}	
  	  	  }
  	  	)
  	})
  }
}