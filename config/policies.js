/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  // '*': "hasToken",
  UserController: {
    create: true,
    find: 'isAdmin',
    update: 'isUser',
    destroy: 'isUser'
  },
  ProviderController: {
    fetch: true,
    create: true,
    find: 'isAdmin',
    update: 'isProvider',
    destroy: 'isProvider'
  },
  BookingController: {
    create: 'isUser',
    find: 'isAdmin',
    update: 'isUser',
    destroy: 'isUser',
    provider_update: 'isProvider'
  },
  ServiceController: {
    fetch: true,
    create: 'isAdmin',
    find: 'isAdmin',
    update: 'isAdmin',
    destroy: 'isAdmin'
  },
  AuthController: {
    '*': true,
  },
  MowingController: {
    '*': 'isAdmin',
    user_update: 'isUser',
    provider_update: 'isProvider'
  }, 
  LeafRemovalController: {
    '*': 'isAdmin',
    user_update: 'isUser',
    provider_update: 'isProvider'
  }, 
  WeedControlController: {
    '*': 'isAdmin',
    user_update: 'isUser',
    provider_update: 'isProvider'
  }, 
  YardCleaningController: {
    '*': 'isAdmin',
    user_update: 'isUser',
    provider_update: 'isProvider'
  }, 
  PaymentController: {
    charge: 'isUser'
  },
  TaskController: {
    provider_job: 'isProvider',
    reject_job: 'isProvider',
    view_booking: 'isUser'
  },
  UserNotificationController: {
    create: 'isAdmin',
    find: 'isAdmin',
    destroy: 'isAdmin',
    user_find: 'isUser',
    user_update: 'isUser'
  },
  ProviderNotificationController: {
    create: 'isAdmin',
    find: 'isAdmin',
    destroy: 'isAdmin',
    provider_find: 'isProvider',
    provider_update: 'isProvider'
  },
  AdminNotificationController: {
    admin_find: 'isAdmin',
    admin_update: 'isAdmin'
  }
  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
	// RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		// '*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy
		// (this overrides `false` above)
		// nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		// feed : ['isNiceToAnimals', 'hasRabbitFood']
	// }
};
