/**
 * YardCleaningController.js
 *
 */

module.exports = {

  // YardCleaning.find(). Return 1 object from id
  find: function (req, res) {
    var id = req.param('id');
    var idShortCut = isShortcut(id);

    if (idShortCut === true) {
      return next();
    };

    if (id) {
      YardCleaning.findOne(id, function(err, yardcleaning) {
        if(yardcleaning === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({yardcleaning: yardcleaning});
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

      console.log("This is the options", options);
      YardCleaning.find(options, function(err, yardcleaning) {
        if(yardcleaning === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({yardcleanings: yardcleaning});
      });

      function isShortcut(id) {
        if (id === 'find'   ||  id === 'update' ||  id === 'create' ||  id === 'destroy') {
        return true;
        };
      }
    }   

  },   

  // an UPDATE action . Return object in array
  provider_update: function (req, res) {
    var criteria = {};

    criteria = _.merge({}, req.params.all(), req.body);

    var id = req.param('id');

    if (!id) {
      return res.badRequest('No id provided.');
      };

    YardCleaning.update(id, criteria, function (err, yardcleanings) {
      if (err) return res.badRequest(err);
      if(yardcleanings.length === 0) return res.notFound();

      if (yardcleanings[0].endTime) {
        var realDuration = yardcleanings[0].endTime - yardcleanings[0].startTime;
        var price = realDuration / 360000 * yardcleanings[0].wage;
        YardCleaning.update(id, {realDuration: realDuration, price: price}, function (err, services) {
          if (err) return res.badRequest(err);
          if(services.length === 0) return res.notFound();

          return res.ok({yardcleaning: services[0]});
        })
      };

      res.ok({yardcleaning: yardcleanings[0]});

    });
  },

  destroy: function (req, res) {
    var id = req.param('id');

    if (!id) {
      return res.badRequest('No id provided.');
    };

    YardCleaning.findOne(id, function (err, yardcleaning) {
      if (err) return res.forbidden(err);
      async.series([
        function (callback) {
          Provider.findOne(yardcleaning.providerId, function (err, provider) {
            var index = provider.schedule.indexOf({startTime: yardcleaning.bookTime, endTime: (yardcleaning.bookTime + yardcleaning.estimatedDuration)});
            provider.schedule.splice(index, 1);
            provider.save(function (err) {
              if (err) console.log(err);
              ProviderNotification.create({providerId: provider.id, serviceId: yardcleaning.id, serviceName: 'yard_cleaning', mes: 'Is canceled'}, function (err, notification) {
                if (err) console.log(err);

                var nsp = sails.io.of('/provider_' + providernote.providerId);
                nsp.on('connection', function(socket) {
                  socket.emit('notification', providernote);
                });

                callback(null)
              })
            })
          })
        },
        function (callback) {
          Booking.findOne(yardcleaning.bookingId, function (err, booking) {
            if (err) console.log(err);

            var index = booking.service.indexOf({name: 'yard_cleaning', id: yardcleaning.id});
            booking.service.splice(index, 1);
            booking.save(function (err) {
              if (err) console.log(err);

              callback(null);
            })
          })
        },
        function (callback) {
          yardcleaning.remove(function (err) {
            if (err) console.log(err);

            callback(null, yardcleaning);
          })
        }],
        function (err, results) {
          if (err) return badRequest(err);
          return res.status(204).json(yardcleaning);
        }
      )  
    });

  },

};