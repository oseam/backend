/**
 * Service.js
 *
 */

module.exports = {

  fetch: function (req, res) {
    var params = req.params.all();

    Service.find(params, function (err, services) {
      if (err) return res.badRequest(err);
      res.ok(services);
    });
  },

  // Service.create()
  create: function (req, res) {
    var params = req.params.all();
    
    Service.create(params).exec(function(err, service) {
      if ((err) || (!service)) {
        return res.badRequest(err);
      } else {
        return res.status(201).json({service: service})
      }
    });
  },

  // Service.find(). Return 1 object from id
  find: function (req, res) {
    var id = req.param('id');
    var idShortCut = isShortcut(id);

    if (idShortCut === true) {
      return next();
    };

    if (id) {
      Service.findOne(id, function(err, service) {
        if(service === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({service: service});
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
      Service.find(options, function(err, service) {
        if(service === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({services: service});
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

    Service.update(id, criteria, function (err, service) {
      if(service.length === 0) return res.notFound();

      if (err) return res.badRequest(err);

      res.ok({service: service});

    });
  },

  // a DESTROY action. Return 204 status
  destroy: function (req, res) {
    var id = req.param('id');

    if (!id) {
      return res.badRequest('No id provided.');
    };

    Service.destroy(id, function (err, service) {
      if (err) return res.forbidden(err);

      return res.status(204).json(service);
    });

  },

  lookup: function (req, res) {
    var params = req.params.all();

    if (!params['name']) return res.badRequest({error: 'Service name is missing'});

    Service.find(params, function (err, services) {
      if (err) return res.notFound();

      return res.ok(serivces);

    })    
  }
};