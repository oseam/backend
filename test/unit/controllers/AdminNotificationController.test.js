require("sails-test-helper");
var request = require('supertest');

describe('AdminNotificationController', function() {
	var adminToken;
	var jwt = require('jsonwebtoken');
	var secret = '6ab198087a16e6d49b438a7aa514731f';

	before(function(done) {
		Admin.create({email: "admin_test_notification2@gmail.com", password: "123456test"}, function(err, admin) {
			adminToken = jwt.sign({admin: admin}, secret, { expiresInMinutes: 60*24 });
			Admin.update(admin.id, {accessToken: adminToken}, function(err, admin) {
				AdminNotification.create({booking: {test: 'test'}, mes: 'Test notification'}, function(err, admin_notification) {
				});	
				done();			
			});
		})

	});

	function hasNotificationKey(res) {
	  if (!('admin_notification' in res.body)) return "admin_notification key";
	};

	describe('#admin_find()', function() {
		it('should find notification and have json response', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/read_anotification')
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200)
				.expect(hasNotificationsKey)
				.end(done);
		});

		it('should return unauthorized', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/update_anotification')
				.set('Content-Type', 'application/json')
				.expect(401)
				.end(done);
		})
	});

	describe('#admin_update()', function() {
		it('should update notification and have json response', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/update_anotification')
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200)
				.expect(hasNotificationsKey)
				.end(done);
		});

		it('should return notFound', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/update_anotification')
				.set('Content-Type', 'application/json')
				.expect(401)
				.end(done);
		})
	});

	function hasNotificationsKey (res) {
		if (!('admin_notifications' in res.body)) return "no admin_notifications key";
	};
});