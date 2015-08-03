require("sails-test-helper");
var request = require('supertest');

describe('ProviderNotificationController', function() {
	var providerToken;
	var providerId;
	var notificationId;
	var adminToken;
	var jwt = require('jsonwebtoken');
	var secret = '6ab198087a16e6d49b438a7aa514731f';

	before(function(done) {
		Provider.create({email: "provider_test_notification@gmail.com", password: "123456test", firstName: "Tombook", lastName: "Joebook", abn: '3286392734f', service: ['mowing', 'leaf_removal', 'yard_cleaning'], postcode: 3205, address: '1 Test Avenue, South Melbourne', location: { type: 'Point', coordinates: [144.954795, -37.718564]}}, function(err, provider) {
			providerId = provider.id;
			providerToken = jwt.sign({provider: provider}, secret, { expiresInMinutes: 60*24 });

			Provider.update(providerId, {accessToken: providerToken}, function(err, provider) {
				if (err) console.log(err);
			});

			ProviderNotification.create({providerId: providerId, booking: {test: 'test'}, mes: 'Test notification'}, function(err, provider_notification) {
				notificationId = provider_notification.id;
			});	

		});

		Admin.create({email: "admin_test_notification1@gmail.com", password: "123456test"}, function(err, admin) {
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
				.get('/api/v1/provider_notification')
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200)
				.expect(hasNotificationsKey)
				.end(done);
		});

		it('should parse json of provider_notification', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/provider_notification/' + notificationId)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200)
				.expect(hasNotificationKey)
				.end(done);
		});

		it('should return notFound', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/provider_notification/1' + notificationId)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(404)
				.end(done);
		})
	});

	describe('#create()', function() {
		it('should have  json response', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/provider_notification')
				.send({providerId: providerId, booking: {test: 'test'}, mes: 'Test notification'})
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(201)
				.expect(hasNotificationKey)
				.end(done);

		});
		it('should return badRequest', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/provider_notification')
				.send({email: '', password: '123456test'})
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(400)
				.end(done);
		});

	});

	function hasNotificationKey(res) {
	  if (!('provider_notification' in res.body)) return "provider_notification key";
	};

	describe('#provider_find()', function() {
		it('should find notification and have json response', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/read_pnotification')
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + providerToken)
				.expect(200)
				.expect(hasNotificationsKey)
				.end(done);
		});

		it('should return unauthorized', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/update_pnotification')
				.set('Content-Type', 'application/json')
				.expect(401)
				.end(done);
		})
	});

	describe('#provider_update()', function() {
		it('should update notification and have json response', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/update_pnotification')
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + providerToken)
				.expect(200)
				.expect(hasNotificationsKey)
				.end(done);
		});

		it('should return notFound', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/update_pnotification')
				.set('Content-Type', 'application/json')
				.expect(401)
				.end(done);
		})
	});

	describe('#destroy()', function() {
		it('should return 204', function(done) {
			request(sails.hooks.http.app)
				.delete('/api/v1/provider_notification/' + notificationId)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(204)
				.end(done);
		})
	})	

	function hasNotificationsKey (res) {
		if (!('provider_notifications' in res.body)) return "no provider_notifications key";
	};
});