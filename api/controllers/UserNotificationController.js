/**
 * UserNotificationController.js
 *
 */

module.exports = {

  // Find user notification. Params: read: true/false/null
  user_find: function (req, res) {
    var userId = req.user.id;
    var params = req.params.all();
    params['userId'] = userId;
    var criteria = _.pick(params, ['userId', 'read']);

    UserNotification.find(criteria, function(err, user_notifications) {
      if ((err) || (!user_notifications)) {
        return res.notFound(err);
      } else {
        return res.status(200).json({user_notifications: user_notifications})
      };
    });
  },

  // Update user notification to read: true
  user_update: function (req, res) {
    var userId = req.user.id;
    
    UserNotification.update({userId: userId, read: false}, {read: true}, function(err, user_notifications) {
      if ((err) || (!user_notifications)) {
        return res.notFound(err);
      } else {
        return res.status(200).json({user_notifications: user_notifications})
      };
    });
  },

  // UserNotification.create()
  create: function (req, res) {
    var params = req.params.all();
    
    UserNotification.create(params).exec(function(err, user_notification) {
      if ((err) || (!user_notification)) {
        return res.badRequest(err);
      } else {
        return res.status(201).json({user_notification: user_notification})
      }
    });
  },

  // UserNotification.find(). Return 1 object from id
  find: function (req, res) {
    var id = req.param('id');
    var idShortCut = isShortcut(id);

    if (idShortCut === true) {
      return next();
    };

    if (id) {
      UserNotification.findOne(id, function(err, user_notification) {
        if(user_notification === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({user_notification: user_notification});
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
      UserNotification.find(options, function(err, user_notification) {
        if(user_notification === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({user_notifications: user_notification});
      });

      function isShortcut(id) {
        if (id === 'find'   ||  id === 'update' ||  id === 'create' ||  id === 'destroy') {
        return true;
        };
      }
    }   

  },   

  // a DESTROY action. Return 204 status
  destroy: function (req, res) {
    var id = req.param('id');

    if (!id) {
      return res.badRequest('No id provided.');
    };

    UserNotification.destroy(id, function (err, user_notification) {
      if (err) return res.forbidden(err);

      return res.status(204).json(user_notification);
    });

  },
};