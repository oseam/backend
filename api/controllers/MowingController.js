/**
 * Mowing.js
 *
 */

module.exports = {

  // Mowing.find(). Return 1 object from id
  find: function (req, res) {
    var id = req.param('id');
    var idShortCut = isShortcut(id);

    if (idShortCut === true) {
      return next();
    };

    if (id) {
      Mowing.findOne(id, function(err, mowing) {
        if(mowing === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({mowing: mowing});
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
      Mowing.find(options, function(err, mowing) {
        if(mowing === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({mowings: mowing});
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

    Mowing.update(id, criteria, function (err, mowings) {      
      if (err) return res.badRequest(err);
      if(mowings.length === 0) return res.notFound();

      if (mowings[0].endTime) {
        var realDuration = mowings[0].endTime - mowings[0].startTime;
        var price = realDuration / 360000 * mowings[0].wage;
        Mowing.update(id, {realDuration: realDuration, price: price}, function (err, services) {
          if (err) return res.badRequest(err);
          if(services.length === 0) return res.notFound();

          return res.ok({mowing: services[0]});
        })
      };

      res.ok({mowing: mowings[0]});

    });
  },

  // a DESTROY action. Return 204 status
  destroy: function (req, res) {
    var id = req.param('id');

    if (!id) {
      return res.badRequest('No id provided.');
    };

    Mowing.findOne(id, function (err, mowing) {
      if (err) return res.forbidden(err);
      async.series([
        function (callback) {
          Provider.findOne(mowing.providerId, function (err, provider) {
            var index = provider.schedule.indexOf({startTime: mowing.bookTime, endTime: (mowing.bookTime + mowing.estimatedDuration)});
            provider.schedule.splice(index, 1);
            provider.save(function (err) {
              if (err) console.log(err);
              ProviderNotification.create({providerId: provider.id, serviceId: mowing.id, serviceName: 'mowing', mes: 'Is canceled'}, function (err, notification) {
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
          Booking.findOne(mowing.bookingId, function (err, booking) {
            if (err) console.log(err);

            var index = booking.service.indexOf({name: 'mowing', id: mowing.id});
            booking.service.splice(index, 1);
            booking.save(function (err) {
              if (err) console.log(err);

              callback(null);
            })
          })
        },
        function (callback) {
          mowing.remove(function (err) {
            if (err) console.log(err);

            callback(null, mowing);
          })
        }],
        function (err, results) {
          if (err) return badRequest(err);
          return res.status(204).json(mowing);
        }
      )  
    });

  },

};