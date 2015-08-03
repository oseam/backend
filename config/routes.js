/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  // Set Authorization: 'Bearer' + token to get access to routes (except signup, login)
  // Carefull with json response in Array or Object format
  // Get location by IP
  'get /api/v1/location': 'LocationController.ip_lookup',
  // Get latlng by address
  'post /api/v1/latlng': 'LocationController.address_lookup',
  // Get adress by latlng
  'get /api/v1/address': 'LocationController.latlng_lookup',
  // Create user
  'post /api/v1/user': 'UserController.create',
  // Find user
  'get /api/v1/user/:id?': 'UserController.find',
  // Update user
  'put /api/v1/user/:id?': 'UserController.update',
  // Delete user
  'delete /api/v1/user/:id?': 'UserController.destroy',
  // User confirm
  'put /api/v1/user_confirm/:id?': 'AuthController.user_confirm',

  // Fetch provider
  'post /api/v1/providers': 'ProviderController.fetch',
  // Create provider
  'post /api/v1/provider': 'ProviderController.create',
  // Find provider
  'get /api/v1/provider/:id?': 'ProviderController.find',
  // Update provider
  'put /api/v1/provider/:id?': 'ProviderController.update',
  // Delete provider
  'delete /api/v1/provider/:id?': 'ProviderController.destroy',
  // Provider confirm
  'put /api/v1/provider_confirm/:id?': 'AuthController.provider_confirm',

  // Admin login
  'post /api/administrator': 'AuthController.admin_login',
  // User login
  'post /api/v1/user_login': 'AuthController.user_login',
  // Provider login 
  'post /api/v1/provider_login': 'AuthController.provider_login',
  // Login
  'post /api/v1/login': 'AuthController.login',
  // Logout
  'get /api/v1/logout': 'AuthController.logout',

  // Login with fb
  'get /api/v1/auth/facebook': 'AuthController.facebook',
  'get /api/v1/auth/facebook/callback': 'AuthController.facebook_callback',
  // Stripe 
  'get /api/v1/auth/stripe': 'AuthController.stripe',
  'get /api/v1/auth/stripe/callback': 'AuthController.stripe_callback',

  // Create booking
  'post /api/v1/booking': 'BookingController.create',
  // Find booking
  'get /api/v1/booking/:id?': 'BookingController.find',
  // Update booking
  'put /api/v1/booking/:id?': 'BookingController.update',
  // Delete booking
  'delete /api/v1/booking/:id?': 'BookingController.destroy',
  // Provider update booking after completed his task
  'get /api/v1/provider_booking/:id?': 'BookingController.provider_update',

  // Fetch service
  'get /api/v1/services': 'ServiceController.fetch',
  // Create service
  'post /api/v1/service': 'ServiceController.create',
  // Find service
  'get /api/v1/service/:id?': 'ServiceController.find',
  // Update service
  'put /api/v1/service/:id?': 'ServiceController.update',
  // Delete service
  'delete /api/v1/service/:id?': 'ServiceController.destroy',
  
  // Find Mowing
  'get /api/v1/mowing/:id?': 'MowingController.find',
  // Update Mowing for provider
  'put /api/v1/provider_mowing/:id?': 'MowingController.provider_update',
  // Delete Mowing
  'delete /api/v1/mowing/:id?': 'MowingController.destroy',
  // Estimate mowing duration

  // Find LeafRemoval
  'get /api/v1/leaf_removal/:id?': 'LeafRemovalController.find',
  // Update LeafRemoval
  'put /api/v1/provider_leaf_removal/:id?': 'LeafRemovalController.provider_update',
  // Delete LeafRemoval
  'delete /api/v1/leaf_removal/:id?': 'LeafRemovalController.destroy',

  // Find WeedControl
  'get /api/v1/weed_control/:id?': 'WeedControlController.find',
  // Update WeedControl
  'put /api/v1/provider_weed_control/:id?': 'WeedControlController.provider_update',
  // Delete WeedControl
  'delete /api/v1/weed_control/:id?': 'WeedControlController.destroy',

  // Find YardCleaning
  'get /api/v1/yard_cleaning/:id?': 'YardCleaningController.find',
  // Update YardCleaning
  'put /api/v1/provider_yard_cleaning/:id?': 'YardCleaningController.provider_update',
  // Delete YardCleaning
  'delete /api/v1/yard_cleaning/:id?': 'YardCleaningController.destroy',

  // Create UserNotification
  'post /api/v1/user_notification': 'UserNotificationController.create',
  // Find UserNotifications
  'get /api/v1/user_notification/:id?': 'UserNotificationController.find',
  // Destroy UserNotification
  'delete /api/v1/user_notification/:id?': 'UserNotificationController.destroy',
  // User find their own notification
  'get /api/v1/read_unotification': 'UserNotificationController.user_find',
  // Update notification to read: true
  'get /api/v1/update_unotification': 'UserNotificationController.user_update',

  // Create ProviderNotification
  'post /api/v1/provider_notification': 'ProviderNotificationController.create',
  // Find UserNotifications
  'get /api/v1/provider_notification/:id?': 'ProviderNotificationController.find',
  // Destroy ProviderNotification
  'delete /api/v1/provider_notification/:id?': 'ProviderNotificationController.destroy',
  // Provider find their own notification
  'get /api/v1/read_pnotification': 'ProviderNotificationController.provider_find',
  // Update notification to read: true
  'get /api/v1/update_pnotification': 'ProviderNotificationController.provider_update',

  // Admin find their own notification
  'get /api/v1/read_anotification': 'AdminNotificationController.admin_find',
  // Update notification to read: true
  'get /api/v1/update_anotification': 'AdminNotificationController.admin_update',

  // View job
  'get /api/v1/provider_job': 'TaskController.provider_job',
  // Reject job
  'delete /api/v1/reject_job/:id?': 'TaskController.reject_job',
  // View booking by user
  'get /api/v1/view_booking': 'TaskController.view_booking',

  // Payment with Stripe
  'post /api/v1/charge': 'PaymentController.charge'
  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
