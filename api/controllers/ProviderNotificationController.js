/**
 * ProviderNotificationController.js
 *
 */

module.exports = {

  // Find provider notification. Params: read: true/false/null
  provider_find: function (req, res) {
    var providerId = req.provider.id;
    var params = req.params.all();
    params['providerId'] = providerId;
    var criteria = _.pick(params, ['providerId', 'read']);

    ProviderNotification.find(criteria, function(err, provider_notifications) {
      if ((err) || (!provider_notifications)) {
        return res.notFound(err);
      } else {
        return res.status(200).json({provider_notifications: provider_notifications})
      };
    });
  },

  // Update provider notification to read: true
  provider_update: function (req, res) {
    var providerId = req.provider.id;
    
    ProviderNotification.update({providerId: providerId, read: false}, {read: true}, function(err, provider_notifications) {
      if ((err) || (!provider_notifications)) {
        return res.notFound(err);
      } else {
        return res.status(200).json({provider_notifications: provider_notifications})
      };
    });
  },

  // ProviderNotification.create()
  create: function (req, res) {
    var params = req.params.all();
    
    ProviderNotification.create(params).exec(function(err, provider_notification) {
      if ((err) || (!provider_notification)) {
        return res.badRequest(err);
      } else {
        return res.status(201).json({provider_notification: provider_notification})
      }
    });
  },

  // ProviderNotification.find(). Return 1 object from id
  find: function (req, res) {
    var id = req.param('id');
    var idShortCut = isShortcut(id);

    if (idShortCut === true) {
      return next();
    };

    if (id) {
      ProviderNotification.findOne(id, function(err, provider_notification) {
        if(provider_notification === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({provider_notification: provider_notification});
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
      ProviderNotification.find(options, function(err, provider_notification) {
        if(provider_notification === undefined) return res.notFound();

        if (err) return res.badRequest(err);

        res.ok({provider_notifications: provider_notification});
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

    ProviderNotification.destroy(id, function (err, provider_notification) {
      if (err) return res.forbidden(err);

      return res.status(204).json(provider_notification);
    });

  },
};