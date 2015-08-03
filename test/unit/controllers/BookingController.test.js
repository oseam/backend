require("sails-test-helper");
var request = require('supertest');

describe('BookingController', function() {
	var adminToken;
	var userToken;
	var userId;
	var providerId;
	var providerToken;
	var bookingId;
	var bookingId2;
	var jwt = require('jsonwebtoken');
	var secret = '6ab198087a16e6d49b438a7aa514731f';
	before(function(done) {
		Provider.create({email: "provider_test_booking@gmail.com", password: "123456test", firstName: "Tombook", lastName: "Joebook", abn: '3286382734f', service: ['mowing', 'leaf_removal', 'yard_cleaning'], postcode: 3205, address: '1 Test Avenue, South Melbourne', location: { type: 'Point', coordinates: [144.954795, -37.718564]}}, function(err, provider) {
			providerId = provider.id;
			providerToken = jwt.sign({provider: provider}, secret, { expiresInMinutes: 60*24 });
			Provider.update(provider.id, {accessToken: providerToken}, function(err, provider) {
				if (err) console.log(err);
			});
		});
		User.create({email: "user_test_booking@gmail.com", password: "123456test"}, function(err, user) {
			userId = user.id;
			userToken = jwt.sign({user: user}, secret, { expiresInMinutes: 60*24 });

			User.update(userId, {accessToken: userToken}, function(err, user) {
				if (err) console.log(err);
			});

			Booking.create({providerId: providerId, userId: userId, services: ['mowing', 'leaf_removal'], estimatedSize: 'medium', bookTime: 1449977804187, estimatedDuration: 1440000, treeNumber: 'tree trees', location: { type: 'Point', coordinates: [144.954795, -37.718564]}}, function(err, booking) {
				bookingId = booking.id;
			});	

		});
		Admin.create({email: "admin_test_booking@gmail.com", password: "123456test"}, function(err, admin) {
			adminToken = jwt.sign({admin: admin}, secret, { expiresInMinutes: 60*24 });
			Admin.update(admin.id, {accessToken: adminToken}, function(err, admin) {
				if (err) console.log(err);
				done();			
			});
		})
	});

	describe('#find()', function() {
		it('should parse json list of service', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/booking/')
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200)
				.expect(hasBookingsKey)
				.end(done);
		function hasBookingsKey (res) {
			if (!('bookings' in res.body)) return "missing bookings key";
		};
		});

		it('should parse json of booking', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/booking/' + bookingId)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200)
				.expect(hasBookingKey)
				.end(done);			
		});

		it('should return notFound', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/booking/1' + bookingId)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(404)
				.end(done);						
		})

	});

	describe('#create()', function() {
		it('should have  json response', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/booking')
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + userToken)
				.send({services: ['mowing', 'leaf_removal'], address: '1 Test Avenue, South Melbourne', estimatedSize: 'medium', bookTime: 1459977804187, estimatedDuration: 1440000, treeNumber: 'three trees', providerId: providerId, wage: 30})
				.expect(201)
				.expect(hasBookingKey)
				.end(done);
		});

		it('should have  json response', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/booking')
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + userToken)
				.send({services: ['mowing', 'leaf_removal'], address: '1 Test Avenue, South Melbourne', estimatedSize: 'medium', bookTime: 1429977804187, estimatedDuration: 1440000, treeNumber: 'three trees', providerId: providerId, wage: 30})
				.expect(201)
				.expect(hasBookingKey)
				.expect(returnBookingId)
				.end(done);
		});


		it('should return badRequest', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/booking')
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + userToken)
				.send({userId: userId, service: ''})
				.expect(400)
				.end(done);
		})

	});

	describe('#provider_update()', function() {
		it('should return notFound', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/provider_booking/' + bookingId2)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + providerToken)
				.expect(404)
				.end(done);			
		})
	});

	describe('#update()', function() {
		it('should update booking and have json response', function(done) {
			request(sails.hooks.http.app)
				.put('/api/v1/booking/' + bookingId2)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + userToken)
				.send({bookTime: 1459977804187})
				.expect(200)
				.expect(hasBookingKey)
				.end(done);
		});

		it('should return badRequest', function(done) {
			request(sails.hooks.http.app)
				.put('/api/v1/booking/')
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + userToken)
				.send({service: ''})
				.expect(400)
				.end(done);
		});

		it('should return notFound', function(done) {
			request(sails.hooks.http.app)
				.put('/api/v1/booking/1' + bookingId)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + userToken)
				.send({services: ['Cleaning']})
				.expect(404)
				.end(done);
		})

	});

	describe('#destroy()', function() {
		it('should return 204', function(done) {
			request(sails.hooks.http.app)
				.delete('/api/v1/booking/' + bookingId2)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + userToken)
				.expect(204)
				.end(done);
		})
	})	


	function hasBookingKey (res) {
		if (!('booking' in res.body)) return "missing booking key";
	};

	function returnBookingId (res) {
		if ('booking' in res.body) {bookingId2 = res.body.booking.id};
	};

});