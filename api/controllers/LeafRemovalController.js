/**
 * LeafRemovalController.js
 *
 */

module.exports = {

  // LeafRemoval.find(). Return 1 object from id
  find: function (req, res) {
    var id = req.param('id');
    var idShortCut = isShortcut(id);

    if (idShortCut === true) {
      return next();
    };

    if (id) {
      LeafRemoval.findOne(id, function(err, leafremoval) {
        if(leafremoval === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({leafremoval: leafremoval});
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
      LeafRemoval.find(options, function(err, leafremoval) {
        if(leafremoval === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({leafremovals: leafremoval});
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

    LeafRemoval.update(id, criteria, function (err, leafremovals) {
      if (err) return res.badRequest(err);
      if(leafremovals.length === 0) return res.notFound();

      if (leafremovals[0].endTime) {
        var realDuration = leafremovals[0].endTime - leafremovals[0].startTime;
        var price = realDuration / 360000 * leafremovals[0].wage;
        LeafRemoval.update(id, {realDuration: realDuration, price: price}, function (err, services) {
          if (err) return res.badRequest(err);
          if(services.length === 0) return res.notFound();

          return res.ok({leafremoval: services[0]});
        })
      };

      res.ok({leafremoval: leafremovals[0]});

    });
  },

  destroy: function (req, res) {
    var id = req.param('id');

    if (!id) {
      return res.badRequest('No id provided.');
    };

    LeafRemoval.findOne(id, function (err, leafremoval) {
      if (err) return res.forbidden(err);
      async.series([
        function (callback) {
          Provider.findOne(leafremoval.providerId, function (err, provider) {
            var index = provider.schedule.indexOf({startTime: leafremoval.bookTime, endTime: (leafremoval.bookTime + leafremoval.estimatedDuration)});
            provider.schedule.splice(index, 1);
            provider.save(function (err) {
              if (err) console.log(err);
              ProviderNotification.create({providerId: provider.id, serviceId: leafremoval.id, serviceName: 'leaf_removal', mes: 'Is canceled'}, function (err, notification) {
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
          Booking.findOne(leafremoval.bookingId, function (err, booking) {
            if (err) console.log(err);

            var index = booking.service.indexOf({name: 'leaf_removal', id: leafremoval.id});
            booking.service.splice(index, 1);
            booking.save(function (err) {
              if (err) console.log(err);

              callback(null);
            })
          })
        },
        function (callback) {
          leafremoval.remove(function (err) {
            if (err) console.log(err);

            callback(null, leafremoval);
          })
        }],
        function (err, results) {
          if (err) return badRequest(err);
          return res.status(204).json(leafremoval);
        }
      )  
    });

  },

};