/**
 * Booking.js
 *
 */

module.exports = {

  // Booking.create()
  create: function (req, res) {
    var userId = req.user.id;
    var params = req.params.all();

    Params.check;
    if( typeof params.services === 'string' ) {
        params['services'] = [ params.services ];
    };
    var bookTime = parseInt(params.bookTime);
    var estimatedDuration = parseInt(params.estimatedDuration);
    var endTime = bookTime + estimatedDuration;
    var lat;
    var lng;
    var createdService;
    var bookingId;
    var services = params['services'];  

    // Convert address to lat, lng & point
    Locations.getLocation(params.address)
      .then(function(result) {
        lng = result.lng;
        lat = result.lat;
        params['location'] = result.loc;
        params['postcode'] = result.postcode;
        // Search array of providers who can't provide service
        return Provider.findOne(params.providerId);
      })
      .then(function(provider) {
        // Create Booking by hash of services above
        return Booking.create({userId: userId, bookTime: bookTime, estimatedDuration: estimatedDuration, providerId: provider.id, location: params.location, services: services})
      })
      .then(function(booking) {
        bookingId = booking.id;
        params['booking'] = bookingId;
        // Map array of service
        return params.services.reduce(function(sequence, service) {          
          return sequence.then(function() { 
            // Delete services params to create individual service like mowing...
            if (params['services']) { delete params['services'] };
            if (params['bookTime']) { delete params['bookTime'] };
            if (params['estimatedDuration']) { delete params['estimatedDuration'] };

            // Loop through service and create associated service
            if (service === 'mowing') {
              return Mowing.create(params);
            } else if (service === 'leaf_removal') {
              return LeafRemoval.create(params)
            } else if (service === 'weed_control') {
              return WeedControl.create(params)
            } else if (service === 'yard_cleaning') {
              return YardCleaning.create(params)
            };

          })
          .then(function(service) {

            // Loop through service and update associated service
            if (service.name === 'mowing') {
              return Booking.update({id: bookingId}, {mowing: service.id})            
            } else if (service.name === 'leaf_removal') {
              return Booking.update({id: bookingId}, {leafRemoval: service.id})            
            } else if (service.name === 'weed_control') {
              return Booking.update({id: bookingId}, {weedControl: service.id})            
            } else if (service.name === 'yard_cleaning') {
              return Booking.update({id: bookingId}, {yardCleaning: service.id})            
            };
            // Create provider notification and push notfication on socket
          });          ;

        }, Promise.resolve()); 
      })
      .then(function(services) {

        var ObjectID = require('mongodb').ObjectID;

        // Update provider schedule
        return Queries.updateProviderAddSchedule(ObjectID(params.providerId), bookTime, endTime)                   

      })
      .then(function() {
        // Find booking information that was just created 
        return Booking.findOne({id: bookingId}).populateAll();
      })
      .then(function(booking) {
        // Notify provider about the job
        ProviderNotification.create({providerId: params.providerId, booking: booking}, function (err, providernote) {
          var nsp = sails.io.of('/provider_' + params.providerId);
          nsp.on('connection', function(socket) {
            socket.emit('notification', providernote);
          });
        });
        // Return JSON of booking
        return res.status(201).json({booking: booking});
      })
      .catch(function(err) {
        if (err.Errors) {
          var errors = _.map(err.Errors, function(n) { return n; });
          errors = _.flatten(errors, true);
          return res.badRequest(errors);
        } else {
          res.badRequest(err);
        }
      })
  
  },

  // Booking.find(). Return 1 object from id
  find: function (req, res) {
    var id = req.param('id');
    var idShortCut = isShortcut(id);

    if (idShortCut === true) {
      return next();
    };

    if (id) {
      Booking.findOne(id, function(err, booking) {
        if(booking === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({booking: booking});
      });
    } else {
      var where = req.param('where');

      if (_.isString(where)) {
        where = JSON.parse(where);
      }
      // This allows you to put something like id=2 to work.
        // if (!where) {

        //     // Build monolithic parameter object
     //    params = req.params.all();

     //    params = _.omit(params, function (param, key) {

     //        return key === 'limit' || key === 'skip' || key === 'sort'

     //    });

        //   where = params;

        //   console.log("making it here!");

        // }

      var options = {
                  limit: req.param('limit') || undefined,
                  skip: req.param('skip')  || undefined,
                  sort: req.param('sort') || undefined,
                  where: where || undefined
          };

      Booking.find(options, function(err, booking) {
        if(booking === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({bookings: booking});
      });

      function isShortcut(id) {
        if (id === 'find'   ||  id === 'update' ||  id === 'create' ||  id === 'destroy') {
        return true;
        };
      }
    }   

  },   

  // an UPDATE action . Return object in array
  update: function (req, res) {
    var criteria = {};
    var id = req.param('id');

    if (!id) {
      return res.badRequest('No id provided.');
      };

    criteria = _.merge({}, req.params.all(), req.body);

    var firstProviderId;
    var secondProviderId;
    var ObjectID = require('mongodb').ObjectID;
    var oldBooKTime;
    var oldEndTime;
    var lat;
    var lng;
    var services = [];
    var bookTime = parseInt(criteria.bookTime);
    var estimatedDuration;
    var endTime;
    var location;
    var bookingServices;

    Booking.findOne({id: id, userId: req.user.id})
      .then(function(booking) {
        // Pass value to variables
        bookingServices = booking.services;
        oldBookTime = booking.bookTime;
        estimatedDuration = booking.estimatedDuration;
        oldEndTime = oldBookTime + estimatedDuration;
        endTime = bookTime + estimatedDuration;
        location = booking.location;
        // Search for provider who perform job in that booking
        return Provider.findOne({id: booking.providerId});     
      })
      .then(function(provider) {
        firstProviderId = provider.id;
        // Remove schedule of that provider
        return Queries.updateProviderRemoveSchedule(ObjectID(firstProviderId), oldBookTime, oldEndTime);
      })
      .then(function() {
        // Find a list of busy providers
        return Queries.searchBusyProvider(location.coordinates[0], location.coordinates[1], bookingServices, bookTime);        
      })
      .then(function(ids) {
        // Search nearest provider who provides  services
        return Queries.searchFreeProvider(location.coordinates[0], location.coordinates[1], bookingServices, bookTime, ids);
      })
      .then(function(providers) {
        if (providers[0]) { 
          secondProviderId = providers[0].obj._id;
        };        
        if (firstProviderId === secondProviderId.toString()) {
          // Update provider and update time if provider is the same
          Queries.updateProviderAddSchedule(ObjectID(firstProviderId), bookTime, endTime)
            .then(function() {
              return Booking.update({id: id}, {bookTime: bookTime})
            })
            .then(function(booking) {
              // Notify provider about the job
              ProviderNotification.create({providerId: firstProviderId, booking: booking}, function (err, providernote) {
                var nsp = sails.io.of('/provider_' + firstProviderId);
                nsp.on('connection', function(socket) {
                  socket.emit('notification', providernote);
                });
              });
              return res.ok({booking: booking});
            })
        } else {
          // Update provider schedule, update service, update booking if provider is different
          Queries.updateProviderAddSchedule(secondProviderId, bookTime, endTime)
            .then(function() {
              return Queries.updateServiceWithProviderID(secondProviderId.toString(), id);
            })
            .then(function(services) {
              return Booking.update({id: id}, {bookTime: bookTime, providerId: secondProviderId.toString()});
            })
            .then(function(booking) {
              // Notify provider about the job
              ProviderNotification.create({providerId: secondProviderId, booking: booking}, function (err, providernote) {
                var nsp = sails.io.of('/provider_' + secondProviderId);
                nsp.on('connection', function(socket) {
                  socket.emit('notification', providernote);
                });
              });

              return res.ok({booking: booking});
            })
        };
      })
      .catch(function(err) {
        if (err[0] = "TypeError: Cannot read property 'services' of undefined") {
          return res.notFound(err[0]);
        } else if (err[0] === 'Provider not found') {
          Booking.findOne({id: bookingId, providerId: providerId}, function(err, booking) {
            // Notify user about the job
            AdminNotification.create({booking: booking, mes: "Urgent! User change task schedule but the system can't find another provider to replace."}, function (err, adminnote) {
              var nsp = sails.io.of('/administrator');
              nsp.on('connection', function(socket) {
                socket.emit('notification', adminnote);
              });
            });                      
          return res.badRequest(err[0]);
          })
        } else {
          return res.badRequest(err[0]);
        }
      })
  },

  // Provider update booking to completed: true and a request for payment is created.
  provider_update: function (req, res) {
    var id = req.param('id');
    var providerId = req.provider.id;
    var book;

    Booking.findOne({id: id, providerId: providerId}).populateAll()
      .then(function(booking) {
        return ServiceLoop.check(booking);
      })
      .then(function(result) {
        var price = _.reduce(result, function(total, n) { return total + n; });
        return Booking.update(id, {price: price, completed: true})
      })
      .then(function(bookings) {
        book = bookings[0];
        return UserCharge.create({userId: book.userId, providerId: book.providerId, amount: book.price})
      })
      .then(function(userCharge) {
        // Notify user about the job
        UserNotification.create({userId: book.userId, booking: book, mes: "Our wonderful provider had completed job. Please progress to payment and let us know if there is any issue."}, function (err, usernote) {
          var nsp = sails.io.of('/user' + book.userId);
          nsp.on('connection', function(socket) {
            socket.emit('notification', usernote);
          });
        });
        res.ok({booking: book});
      })
      .catch(function(err) {
        res.notFound(err);
      })
  },

  // a DESTROY action. Return 204 status
  destroy: function (req, res) {
    var id = req.param('id');
    var startTime;
    var endTime;
    var bookingInfo;

    if (!id) {
      return res.badRequest('No id provided.');
    };

    Booking.findOne({id: id, userId: req.user.id})
      .then(function(booking) {
        var ObjectID = require('mongodb').ObjectID;
        var providerId = ObjectID(booking.providerId);
        startTime = booking.bookTime;
        endTime = startTime + booking.estimatedDuration;
        bookingInfo = booking;
        // Update provider schedule with mongonative, return objectId
        return Queries.updateProviderRemoveSchedule(providerId, startTime, endTime);
      })
      .then(function(pid) {
        // Create notification
        return ProviderNotification.create({providerId: pid.toString(), booking: JSON.stringify(bookingInfo), mes: 'Is canceled'})
      })
      .then(function(providerNotification) {
        // Create socket
        var nsp = sails.io.of('/provider_' + providerNotification.providerId);
        nsp.on('connection', function(socket) {
          socket.emit('notification', providerNotification);
        });
        // Destroy booking
        return Booking.destroy({id: id, userId: req.user.id});
      })
      .then(function() {
        return res.status(204).json();
      })    
      .catch(function(err) {
        return res.status(500);
      })    
  },
};