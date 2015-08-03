require("sails-test-helper");
var request = require('supertest');

describe('AuthController', function() {
	var providerId;
	before(function(done) {
		Provider.create({email: 'provider_confirm_test1@gmail.com', password: '123456test', firstName: 'Tom', lastName: 'Henry', abn: 'ud73gs67e8u', address: '1 Test Avenue, South Melbourne', location: { type: 'Point', coordinates: [144.963089, -37.807880]}, postcode: 3053}, function(err, provider) {
			providerId = provider.id;
			done(); })
	});

	describe('#user_confirm()', function() {
		var userId;
		before(function(done) {
			User.create({email: 'user_confirm_test1@gmail.com', password: '123456test'}, function(err, user) {
				userId = user.id;
				done(); })
		});
		it('should update and confirm user', function(done) {
			request(sails.hooks.http.app)
				.put('/api/v1/user_confirm/' + userId)
				.expect(200)
				.expect(hasUser)
				.end(done);
		function hasUser (res) {
			if (!('user') in res.body) return "missing user key";
		};
		});
		it('should return badRequest', function(done){
			request(sails.hooks.http.app)
				.put('/api/v1/user_confirm/')
				.expect(400)
				.end(done);
		});
		it('should return notFound', function(done) {
			request(sails.hooks.http.app)
				.put('/api/v1/user_confirm/1' + userId)
				.expect(404)
				.end(done);
		})
	});

	describe('#provider_confirm()', function() {
		it('should update and confirm provider', function(done) {
			request(sails.hooks.http.app)
				.put('/api/v1/provider_confirm/' + providerId)
				.expect(200)
				.expect(hasProvider)
				.end(done);
		function hasProvider (res) {
			if (!('provider') in res.body) return "missing provider key";
		};
		});
		it('should return badRequest', function(done){
			request(sails.hooks.http.app)
				.put('/api/v1/user_confirm/')
				.expect(400)
				.end(done);
		});
		it('should return notFound', function(done) {
			request(sails.hooks.http.app)
				.put('/api/v1/user_confirm/1' + providerId)
				.expect(404)
				.end(done);
		})

	});

	describe('#user_login()', function() {
		before(function(done) {
			User.create({email: 'user_login_test@gmail.com', password: '123456test'}, function(req, res) { done(); })
		});
		it('should parse json response and auth token', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/user_login')
				.send({email: 'user_login_test@gmail.com', password: '123456test'})
				.expect(200)
				.expect(hasUserAndToken)
				.end(done);
		});
		it('should parse json response and auth token using normal login', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/login')
				.send({email: 'user_login_test@gmail.com', password: '123456test'})
				.expect(200)
				.expect(hasUserAndToken)
				.end(done);
		});
		it('should return badRequest', function(done){
			request(sails.hooks.http.app)
				.post('/api/v1/user_login')
				.send({email: 'user_login_test@gmail.com'})
				.expect(400)
				.end(done);
		});
		it('should return badRequest with invalid password', function(done){
			request(sails.hooks.http.app)
				.post('/api/v1/user_login')
				.send({email: 'user_login_test@gmail.com', password: '1234567893'})
				.expect(400)
				.end(done);
		})
		function hasUserAndToken (res) {
			if (!('user') in res.body) return "missing user key";
			if (!('token') in res.body) return "missing token";
		};
	});

	describe('#provider_login()', function() {
		it('should parse json response and auth token', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/provider_login')
				.send({email: 'provider_confirm_test1@gmail.com', password: '123456test'})
				.expect(200)
				.expect(hasProviderAndToken)
				.end(done);
		});
		it('should parse json response and auth token with normal login', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/login')
				.send({email: 'provider_confirm_test1@gmail.com', password: '123456test'})
				.expect(200)
				.expect(hasProviderAndToken)
				.end(done);
		});
		it('should return badRequest', function(done){
			request(sails.hooks.http.app)
				.post('/api/v1/provider_login')
				.send({email: 'user_login_test@gmail.com'})
				.expect(400)
				.end(done);
		});
		it('should return badRequest', function(done){
			request(sails.hooks.http.app)
				.post('/api/v1/provider_login')
				.send({email: 'provider_login_test@gmail.com', password: '123456'})
				.expect(400)
				.end(done);
		})
		function hasProviderAndToken (res) {
			if (!('provider') in res.body) return "missing provider key";
			if (!('token') in res.body) return "missing token";
		};

	});

	describe('#admin_login()', function() {
		before(function(done) {
			Admin.create({email: 'admin_login_test@gmail.com', password: 'admin12345'}, function(err, admin) {
				done(); })
		});

		it('should parse json response and auth token', function(done) {
			request(sails.hooks.http.app)
				.post('/api/administrator')
				.send({email: 'admin_login_test@gmail.com', password: 'admin12345'})
				.expect(200)
				.expect(hasAdminAndToken)
				.end(done);
		function hasAdminAndToken (res) {
			if (!('admin') in res.body) return "missing admin key";
			if (!('token') in res.body) return "missing token";
		};
		});
		it('should return badRequest', function(done){
			request(sails.hooks.http.app)
				.post('/api/administrator')
				.send({email: 'testuser@gmail.com'})
				.expect(400)
				.end(done);
		});
		it('should return badRequest', function(done){
			request(sails.hooks.http.app)
				.post('/api/administrator')
				.send({email: 'testuser@gmail.com', password: '123456'})
				.expect(400)
				.expect(invalidPassword)
				.end(done);
		})

	});

	describe('#logout()', function() {
		it('should logout successfully', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/logout')
				.expect(204)
				.end(done);
		})
	});

	function invalidPassword (res) {
		if (res.body.message === 'Invalid Password') return res.body.message;
	}
});
