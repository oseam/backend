/**
 * WeedControlController.js
 *
 */

module.exports = {

  // WeedControl.find(). Return 1 object from id
  find: function (req, res) {
    var id = req.param('id');
    var idShortCut = isShortcut(id);

    if (idShortCut === true) {
      return next();
    };

    if (id) {
      WeedControl.findOne(id, function(err, weedcontrol) {
        if(weedcontrol === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({weedcontrol: weedcontrol});
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
      WeedControl.find(options, function(err, weedcontrol) {
        if(weedcontrol === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({weedcontrols: weedcontrol});
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

    WeedControl.update(id, criteria, function (err, weedcontrols) {
      if (err) return res.badRequest(err);
      if(weedcontrols.length === 0) return res.notFound();

      if (weedcontrols[0].endTime) {
        var realDuration = weedcontrols[0].endTime - weedcontrols[0].startTime;
        var price = realDuration / 360000 * weedcontrols[0].wage;
        WeedControl.update(id, {realDuration: realDuration, price: price}, function (err, services) {
          if (err) return res.badRequest(err);
          if(services.length === 0) return res.notFound();

          return res.ok({weedcontrol: services[0]});
        })
      };

      res.ok({weedcontrol: weedcontrols[0]});

    });
  },

  destroy: function (req, res) {
    var id = req.param('id');

    if (!id) {
      return res.badRequest('No id provided.');
    };

    WeedControl.findOne(id, function (err, weedcontrol) {
      if (err) return res.forbidden(err);
      async.series([
        function (callback) {
          Provider.findOne(weedcontrol.providerId, function (err, provider) {
            var index = provider.schedule.indexOf({startTime: weedcontrol.bookTime, endTime: (weedcontrol.bookTime + weedcontrol.estimatedDuration)});
            provider.schedule.splice(index, 1);
            provider.save(function (err) {
              if (err) console.log(err);
              ProviderNotification.create({providerId: provider.id, serviceId: weedcontrol.id, serviceName: 'weed_control', mes: 'Is canceled'}, function (err, notification) {
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
          Booking.findOne(weedcontrol.bookingId, function (err, booking) {
            if (err) console.log(err);

            var index = booking.service.indexOf({name: 'weed_control', id: weedcontrol.id});
            booking.service.splice(index, 1);
            booking.save(function (err) {
              if (err) console.log(err);

              callback(null);
            })
          })
        },
        function (callback) {
          weedcontrol.remove(function (err) {
            if (err) console.log(err);

            callback(null, weedcontrol);
          })
        }],
        function (err, results) {
          if (err) return badRequest(err);
          return res.status(204).json(weedcontrol);
        }
      )  
    });

  },

};