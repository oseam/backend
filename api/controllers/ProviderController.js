/**
 * Provider.js
 *
 */

module.exports = {
  
  // Fetch provider
  fetch: function (req, res) {
    var params = req.params.all();

    if (!params['address']) return res.badRequest({err: 'No address'});
    if (!params['bookTime']) return res.badRequest({err: 'No booktime'});
    if (!params['estimatedDuration']) return res.badRequest({err: 'No estimatedDuration'});
    if (!params['services']) return res.badRequest({err: 'No services'});

    if( typeof params.services === 'string' ) {
        params['services'] = [ params.services ];
    };
    var lat;
    var lng;
    var bookTime = parseInt(params.bookTime);
    var estimatedDuration = parseInt(params.estimatedDuration);
    var endTime = bookTime + estimatedDuration;
    // Convert address to lat, lng & point
    Locations.getLocation(params.address)
      .then(function(result) {
        lng = result.lng;
        lat = result.lat;
        params['location'] = result.loc;
        params['postcode'] = result.postcode;
        // Search array of providers who can't provide service
        return Queries.searchBusyProvider(lng, lat, params.services, bookTime);
      })
      .then(function(ids) {
        // Search nearest provider who provides  services
        return Queries.searchFreeProvider(lng, lat, params.services, bookTime, ids);
      })
      .then(function(providers) {
        return res.ok(providers);
      })
      .catch(function(err) {
        return res.notFound(err);
      })
  
  },    

  // Provider.create()
  create: function (req, res) {
    var params = req.params.all();

    if (!params.address) return res.badRequest([{rule: 'address'}, {message: 'Address is required'}]);
    async.waterfall([
      function (callback) {
        if ((params.address) && (!params.lat)) {
          var geocoder = require('geocoder');
          geocoder.geocode(params.address, function ( err, data ) {
            if (data) {
              params['location'] = {type: 'Point', coordinates: [data.results[0].geometry.location.lng, data.results[0].geometry.location.lat]};
              params['postcode'] = data.results[0].address_components[5].long_name;
              callback(null, params);
            }
          });
        };
      },  
      function (callback) {
        Provider.create(params).exec(function(err, provider) {
          if ((err) || (!provider)) {
            var error = err.toJSON();
            if (err.Errors) {
              var errors = _.map(err.Errors, function(n) { return n; });
              errors = _.flatten(errors, true);
              return res.badRequest(errors);
            } else if (error.raw.err.search('email_1  dup key') != -1) {
              return res.badRequest([{rule: 'unique', message: Provider.validationMessages.email.unique}]);
            } else if (error.raw.err.search('abn_1  dup key') != -1) {
              return res.badRequest([{rule: 'unique', message: Provider.validationMessages.abn.unique}]);
            } else {
              res.badRequest(err);
            }
          } else {
            return res.status(201).json({provider: provider})
          }
        });
      }
    ])
  },

  // Provider.find(). Return 1 object from id
  find: function (req, res) {
    var id = req.param('id');
    var idShortCut = isShortcut(id);

    if (idShortCut === true) {
      return next();
    };

    if (id) {
      Provider.findOne(id, function(err, provider) {
        if(provider === undefined) return res.notFound();

        if (err) return next(err);

        res.ok({provider: provider});

      });
    } else {
      var where = req.param('where');

      if (_.isString(where)) {
        where = JSON.parse(where);
      };
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
      Provider.find(options, function(err, provider) {
        if(provider === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({providers: provider});
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

    criteria = _.merge({}, req.params.all(), req.body);

    var id = req.param('id');

    if (!id) {
      return res.badRequest('No id provided.');
      };
    // console.log(req.file());
    // if (req.file('avatar').isNoop === false) {
    //   req.file('avatar').upload({
    //     adapter: require('skipper-s3'),
    //     key: sails.config.aws.key,
    //     secret: sails.config.aws.secret,
    //     bucket: sails.config.aws.bucket
    //   }, function (err, filesUploaded) {
    //     if (err) return res.badRequest(err);
    //     criteria['avatar'] = filesUploaded[0].extra.Location;
    //     Provider.update(id, criteria, function (err, provider) {
    //       if(provider.length === 0) return res.notFound();

    //       if (err) return badRequest(err);

    //       res.ok({provider: provider});
    //     });
    //   });
    // } else {
      Provider.update(id, criteria, function (err, provider) {
        if(provider.length === 0) return res.notFound();

        if (err) return badRequest(err);

        res.ok({provider: provider});
      });      
    // }
  },

  // a DESTROY action. Return 204 status
  destroy: function (req, res) {
    var id = req.param('id');

    if (!id) {
      return res.badRequest('No id provided.');
    };
    Provider.destroy(id).exec(function (err, provider) {
      if (err) return res.serverError(err);

      return res.status(204).json(provider);
    });
  },
};
