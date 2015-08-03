require("sails-test-helper");
var request = require('supertest');

describe('UserNotificationController', function() {
	var userToken;
	var userId;
	var notificationId;
	var adminToken;
	var jwt = require('jsonwebtoken');
	var secret = '6ab198087a16e6d49b438a7aa514731f';

	before(function(done) {
		User.create({email: "user_test_notification@gmail.com", password: "123456test"}, function(err, user) {
			userId = user.id;
			userToken = jwt.sign({user: user}, secret, { expiresInMinutes: 60*24 });

			User.update(userId, {accessToken: userToken}, function(err, user) {
				if (err) console.log(err);
			});

			UserNotification.create({userId: userId, booking: {test: 'test'}, mes: 'Test notification'}, function(err, user_notification) {
				notificationId = user_notification.id;
			});	

		});

		Admin.create({email: "admin_test_notification@gmail.com", password: "123456test"}, function(err, admin) {
			adminToken = jwt.sign({admin: admin}, secret, { expiresInMinutes: 60*24 });
			Admin.update(admin.id, {accessToken: adminToken}, function(err, admin) {
				if (err) console.log(err);
				done();			
			});
		})

	});

	describe('#find()', function() {
		it('should parse json list of notifications', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/user_notification')
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200)
				.expect(hasNotificationsKey)
				.end(done);
		});

		it('should parse json of user_notification', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/user_notification/' + notificationId)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200)
				.expect(hasNotificationKey)
				.end(done);
		});

		it('should return notFound', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/user_notification/1' + notificationId)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(404)
				.end(done);
		})
	});

	describe('#create()', function() {
		it('should have  json response', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/user_notification')
				.send({userId: userId, booking: {test: 'test'}, mes: 'Test notification'})
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(201)
				.expect(hasNotificationKey)
				.end(done);

		});
		it('should return badRequest', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/user_notification')
				.send({email: '', password: '123456test'})
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(400)
				.end(done);
		});

	});

	function hasNotificationKey(res) {
	  if (!('user_notification' in res.body)) return "user_notification key";
	};

	describe('#user_find()', function() {
		it('should find notification and have json response', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/read_unotification')
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + userToken)
				.expect(200)
				.expect(hasNotificationsKey)
				.end(done);
		});

		it('should return unauthorized', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/update_unotification')
				.set('Content-Type', 'application/json')
				.expect(401)
				.end(done);
		})
	});

	describe('#user_update()', function() {
		it('should update notification and have json response', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/update_unotification')
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + userToken)
				.expect(200)
				.expect(hasNotificationsKey)
				.end(done);
		});

		it('should return notFound', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/update_unotification')
				.set('Content-Type', 'application/json')
				.expect(401)
				.end(done);
		})
	});

	describe('#destroy()', function() {
		it('should return 204', function(done) {
			request(sails.hooks.http.app)
				.delete('/api/v1/user_notification/' + notificationId)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(204)
				.end(done);
		})
	})	

	function hasNotificationsKey (res) {
		if (!('user_notifications' in res.body)) return "no user_notifications key";
	};
});