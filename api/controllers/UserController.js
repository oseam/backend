/**
 * User.js
 *
 */

module.exports = {

  // User.create()
  create: function (req, res) {
    var params = req.params.all();
    
    User.create({email: params.email, password: params.password}, function(err, user) {
      if ((err) || (!user)) {
        var error = err.toJSON();
        if (err.Errors) {
          var errors = _.map(err.Errors, function(n) { return n; });
          errors = _.flatten(errors, true);
          return res.badRequest(errors);
        } else if (error.raw.err.search('dup key') != -1) {
          return res.badRequest([{rule: 'unique', message: User.validationMessages.email.unique}]);
        } 
      } else {
        return res.status(201).json({user: user})
      }
    });
  },

  // User.find(). Return 1 object from id
  find: function (req, res) {
    var id = req.param('id');

    var idShortCut = isShortcut(id);

    if (idShortCut === true) {
        return next();
    };

    if (id) {
      User.findOne(id, function(err, user) {
        if(user === undefined) return res.notFound();

        if (err) return badRequest(err);

        res.ok({user: user});

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
      User.find(options, function(err, user) {

      if(user === undefined) return res.notFound();

      if (err) return res.badRequest(err);

      res.ok({users: user});

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
    
    // if (req.file('avatar').isNoop === false) { 
    //   req.file('avatar').upload({
    //     adapter: require('skipper-s3'),
    //     key: sails.config.aws.key,
    //     secret: sails.config.aws.secret,
    //     bucket: sails.config.aws.bucket
    //   }, function (err, filesUploaded) {
    //     if (err) return res.badRequest(err);
    //     criteria['avatar'] = filesUploaded[0].extra.Location;
    //     User.update(id, criteria, function (err, user) {
    //       if(user.length === 0) return res.notFound();

    //       if (err) return res.badRequest(err);

    //       res.ok({user: user});

    //     });
    //   });
    // } else {
        User.update(id, criteria, function (err, user) {
          if(user.length === 0) return res.notFound();

          if (err) return res.badRequest(err);

          res.ok({user: user});

        });      
    // };

  },

  // a DESTROY action. Return 204 status
  destroy: function (req, res) {
    var id = req.param('id');

    if (!id) {
      return res.badRequest('No id provided.');
    };

    User.destroy(id, function (err, user) {
      if (err) return res.forbidden(err);

      return res.status(204).json(user);
    });
  },
  
};