require("sails-test-helper");
var request = require('supertest');

describe('BookingController', function() {
	var adminToken;
	var userToken;
	var providerToken;
	var userId;
	var providerId;
	var bookingId;
	var bookingId3;
	var jwt = require('jsonwebtoken');
	var secret = '6ab198087a16e6d49b438a7aa514731f';
	before(function(done) {
		Provider.create({email: "provider_test_task@gmail.com", password: "123456test", firstName: "Tombook", lastName: "Joebook", abn: '3086380734f', service: ['mowing', 'leaf_removal', 'yard_cleaning'], postcode: 3205, address: '1 Test Avenue, South Melbourne', location: { type: 'Point', coordinates: [144.954795, -37.718564]}}, function(err, provider) {
			providerId = provider.id;
			providerToken = jwt.sign({provider: provider}, secret, { expiresInMinutes: 60*24 });
			Provider.update(provider.id, {accessToken: providerToken}, function(err, provider) {
				if (err) console.log(err);
			});
		});
		User.create({email: "user_test_task@gmail.com", password: "123456test"}, function(err, user) {
			userId = user.id;
			userToken = jwt.sign({user: user}, secret, { expiresInMinutes: 60*24 });

			User.update(userId, {accessToken: userToken}, function(err, user) {
				if (err) console.log(err);
			});

			Booking.create({providerId: providerId, userId: userId, services: ['mowing', 'leaf_removal'], estimatedSize: 'medium', bookTime: 1449977804187, estimatedDuration: 1440000, treeNumber: 'tree trees', location: { type: 'Point', coordinates: [144.954795, -37.718564]}}, function(err, booking) {
				bookingId = booking.id;
			});	

		});
		Admin.create({email: "admin_test_task@gmail.com", password: "123456test"}, function(err, admin) {
			adminToken = jwt.sign({admin: admin}, secret, { expiresInMinutes: 60*24 });
			Admin.update(admin.id, {accessToken: adminToken}, function(err, admin) {
				if (err) console.log(err);
				done();			
			});
		})
	});

	describe('boostrap task', function() {
		it('should have  json response', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/booking')
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + userToken)
				.send({services: ['mowing', 'leaf_removal'], address: '1 Test Avenue, South Melbourne', estimatedSize: 'medium', bookTime: 1559977804187, estimatedDuration: 1440000, treeNumber: 'three trees', providerId: providerId, wage: 30})
				.expect(201)
				.expect(returnBookingId)
				.end(done);
		});

	});

	describe('#provider_job()', function() {
		it('should parse json list of service', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/provider_job')
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + providerToken)
				.expect(200)
				.end(done);
		});

	});

	describe('#view_booking()', function() {
		it('should parse json list of service', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/view_booking')
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + userToken)
				.expect(200)
				.end(done);
		});

	});

	describe('#reject_job()', function() {
		it('should reject job', function(done) {
			request(sails.hooks.http.app)
				.delete('/api/v1/reject_job/' + bookingId3)
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + providerToken)
				.expect(204)
				.end(done);
		});

		it('should return badrequest', function(done) {
			request(sails.hooks.http.app)
				.delete('/api/v1/reject_job/1' + bookingId3)
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + providerToken)
				.expect(400)
				.end(done);
		});
	});

	function hasBookingKey (res) {
		if (!('booking' in res.body)) return "missing booking key";
	};

	function returnBookingId (res) {
		if ('booking' in res.body) {bookingId3 = res.body.booking.id};
		console.log(bookingId3);
	};

});