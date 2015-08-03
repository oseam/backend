require("sails-test-helper");
var request = require('supertest');

describe('ProviderController', function() {

	var token;
	var providerId;
	var adminToken;
	var secret = '6ab198087a16e6d49b438a7aa514731f';
	var jwt = require('jsonwebtoken');

	before(function(done) {
		factory.load();
		factory.create("provider", function(provider) {
			providerId = provider.id;
			token = jwt.sign({provider: provider}, secret, { expiresInMinutes: 60*24 });
			Provider.update(provider.id, {accessToken: token}, function(err, provider) {
				if (err) console.log(err);
			})
		});
		Admin.create({email: "admin_test_provider@gmail.com", password: "123456test"}, function(err, admin) {
			adminToken = jwt.sign({admin: admin}, secret, { expiresInMinutes: 60*24 });
			Admin.update(admin.id, {accessToken: adminToken}, function(err, admin) {
				if (err) console.log(err);
				done();			
			});
		})

	});

	describe('#fetch()', function () {

		it('should reponse with a json list of providers', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/providers')
				.send({services: ['mowing', 'leaf_removal'], address: '1 Test Avenue, South Melbourne', bookTime: 1469977804187, estimatedDuration: 1440000})
				.expect(200)
				.end(done);			
		});

		it('should reponse with badRequest', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/providers')
				.send({services: ['mowing', 'leaf_removal'], address: '488 George Street, Sydney', bookTime: 1469977804187, estimatedDuration: 1440000})
				.expect(404)
				.end(done);			
		});

		it('should reponse with badRequest', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/providers')
				.send({services: ['mowing', 'leaf_removal', 'eating'], address: '1 Test Avenue, South Melbourne', bookTime: 1469977804187, estimatedDuration: 1440000})
				.expect(404)
				.end(done);			
		});

		it('should reponse with badRequest', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/providers')
				.send({address: '1 Test Avenue, South Melbourne', bookTime: 1469977804187, estimatedDuration: 1440000})
				.expect(400)
				.end(done);			
		});
	});

	describe('#find()', function() {

		it('should parse json list of providers', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/provider')
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200)
				.expect(hasProvidersKey)
				.end(done);
		function hasProvidersKey (res) {
			if (!('providers' in res.body)) return "no provider key";
		};
		});

		it('should parse json of provider', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/provider/' + providerId)
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200)
				.expect(hasProviderKey)
				.end(done);
		function hasProviderKey (res) {
			if (!('provider' in res.body)) return "no provider key";
		};
		});

		it('should return notFound', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/provider/1' + providerId)
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(404)
				.end(done);
		})

	});

	describe('#create()', function() {
		it('should have  json response', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/provider')
				.send({email: 'provider_create_test1@gmail.com', password: '123456test', firstName: 'Tom', lastName: 'Henry', abn: 'ud73gs37e8u', address: '1 Test Avenue, South Melbourne'})
				.expect(201)
				.expect(hasProviderKey)
				.end(done);

		});
		it('should return badRequest', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/provider')
				.send({email: '', password: '123456test'})
				.expect(400)
				.end(done);
		});

	});

	describe('#update()', function() {
		it('should update provider and have json response', function(done) {
			request(sails.hooks.http.app)
				.put('/api/v1/provider/' + providerId)
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + token)
				.send({firstName: 'Yeal'})
				.expect(200)
				.expect(hasProviderKey)
				.end(done);
		});

		it('should return badRequest', function(done) {
			request(sails.hooks.http.app)
				.put('/api/v1/provider/')
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + token)
				.send({firstName: 'Hell Yeal'})
				.expect(400)
				.end(done);			
		});

		it('should return notFound', function(done) {
			request(sails.hooks.http.app)
				.put('/api/v1/provider/1' + providerId)
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + token)
				.send({firstName: 'Yeal'})
				.expect(404)
				.end(done);
		});

	});

	function hasProviderKey(res) {
	  if (!('provider' in res.body)) return "provider key";
	};

	describe('#destroy()', function() {
		it('should return 204', function(done) {
			request(sails.hooks.http.app)
				.delete('/api/v1/provider/' + providerId)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + token)
				.expect(204)
				.end(done);
		});
	})	
});