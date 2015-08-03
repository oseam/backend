/**
 * Quote.js
 *
 */

module.exports = {

  // Quote.create()
  create: function (req, res) {
    var params = req.params.all();
    var providerId = req.provider.id;
    params['providerId'] = providerId;
    
    Quote.create(params).exec(function(err, quote) {
      if ((err) || (!quote)) {
        return res.badRequest(err);
      } else {
        return res.status(201).json({quote: quote})
      }
    });
  },

  // Quote.find(). Return 1 object from id
  find: function (req, res) {
    var id = req.param('id');
    var idShortCut = isShortcut(id);

    if (idShortCut === true) {
      return next();
    };

    if (id) {
      Quote.findOne(id, function(err, quote) {
        if(quote === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({quote: quote});
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
      Quote.find(options, function(err, quote) {
        if(quote === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({quotes: quote});
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

    Quote.update(id, criteria, function (err, quote) {
      if(quote.length === 0) return res.notFound();

      if (err) return res.badRequest(err);

      res.ok({quote: quote});

    });
  },

  // a DESTROY action. Return 204 status
  destroy: function (req, res) {
    var id = req.param('id');

    if (!id) {
      return res.badRequest('No id provided.');
    };

    Quote.destroy(id, function (err, quote) {
      if (err) return res.forbidden(err);

      return res.status(204).json(quote);
    });

  },
};