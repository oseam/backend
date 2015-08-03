/**
 * TaskController.js
 *
 */

module.exports = {

  // View task Provider
  provider_job: function (req, res) {
    var params = req.params.all();
    params['providerId'] = req.provider.id;

    Provider.findOne(params['providerId'])
      .then(function(provider) {
        // Find booking related to provider
        return Booking.find(params).populateAll();
      })
      .then(function(bookings) {
        // Return 200
        return res.ok(bookings);
      })
      .catch(function(err) {
        res.notFound(err);
      })
  },

  // Reject tasks
  reject_job: function (req, res) {
  	var providerId = req.provider.id;
  	var bookingId = req.param('id');
    var ObjectID = require('mongodb').ObjectID;
  	var newProviderId;
    var bookTime;
    var estimatedDuration;
    var endTime;
    var location;
    var services;

    Booking.findOne({id: bookingId, providerId: providerId})
      .then(function(booking) {
        bookTime = booking.bookTime;
        estimatedDuration = booking.estimatedDuration;
        endTime = bookTime + estimatedDuration;
        location = booking.location;
        // create an array of services
        services = booking.services;

        // Search for a list of provider id whom could not perform job
        return Queries.searchBusyProvider(location.coordinates[0], location.coordinates[1], services, bookTime);        
      })
      .then(function(ids) {
        // Search nearest provider who provides  services
        return Queries.searchFreeProvider(location.coordinates[0], location.coordinates[1], services, bookTime, ids);
      })
      .then(function(providers) {
        if (providers[0]) {
          newProviderId = providers[0].obj._id;
        };
        // Update schedule of provider
        return Queries.updateProviderAddSchedule(newProviderId, bookTime, endTime);
      })
      .then(function() {
        // Update providerId to service
        return Queries.updateServiceWithProviderID(newProviderId.toString(), bookingId);
      })
      .then(function(results) {
        // Update booking info
        return Booking.update({id: bookingId}, {providerId: newProviderId.toString()});
      })
      .then(function(booking) {
        // Notify user about the job
        UserNotification.create({userId: booking.userId, booking: booking, mes: "We're sorry, a new provider is replaced"}, function (err, usernote) {
          var nsp = sails.io.of('/user' + booking.userId);
          nsp.on('connection', function(socket) {
            socket.emit('notification', usernote);
          });
        });
        res.status(204).json();
      })
      .catch(function(err) {
        if (err === 'Provider not found') {
          Booking.findOne({id: bookingId, providerId: providerId}, function(err, booking) {
            // Notify user about the job
            AdminNotification.create({booking: booking, mes: "Urgent! A provider canceled task but the system can't find another provider to replace."}, function (err, adminnote) {
              var nsp = sails.io.of('/administrator');
              nsp.on('connection', function(socket) {
                socket.emit('notification', adminnote);
              });
            });                      
          })
        }
        res.badRequest(err);
      })
  },

  // User view booking
  view_booking: function (req, res) {
  	var userId = req.user.id;
  	var params = req.params.all();
  	params['userId'] = userId;

  	Booking.find(params).populateAll()
      .then(function(bookings) {
        return res.ok(bookings);
      })
      .catch(function(err) {
        return res.notFound(err);
      })
  } 
}	
