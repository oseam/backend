/**
 * AdminNotificationController.js
 *
 */

module.exports = {

  // Find admin notification. Params: read: true/false/null
  admin_find: function (req, res) {
    var params = req.params.all();
    var criteria = _.pick(params, 'read');
    console.log({'hello': criteria});

    AdminNotification.find(criteria, function(err, admin_notifications) {
      if ((err) || (!admin_notifications)) {
        return res.notFound(err);
      } else {
        return res.status(200).json({admin_notifications: admin_notifications})
      };
    });
  },

  // Update admin notification to read: true
  admin_update: function (req, res) {
    
    AdminNotification.update({read: false}, {read: true}, function(err, admin_notifications) {
      if ((err) || (!admin_notifications)) {
        return res.notFound(err);
      } else {
        return res.status(200).json({admin_notifications: admin_notifications})
      };
    });
  },

};