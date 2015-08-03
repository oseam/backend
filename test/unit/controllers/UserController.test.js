require("sails-test-helper");
var request = require('supertest');

describe('UserController', function() {
	var token;
	var userId;
	var adminToken;
	var jwt = require('jsonwebtoken');
	var secret = '6ab198087a16e6d49b438a7aa514731f';

	before(function(done) {
		factory.load();
		factory.create("user", function(user) {
			userId = user.id;
			token = jwt.sign({user: user}, secret, { expiresInMinutes: 60*24 });
			User.update(user.id, {accessToken: token}, function(err, user) {
				if (err) console.log(err);
			})
		});
		Admin.create({email: "admin_test_user@gmail.com", password: "123456test"}, function(err, admin) {
			adminToken = jwt.sign({admin: admin}, secret, { expiresInMinutes: 60*24 });
			Admin.update(admin.id, {accessToken: adminToken}, function(err, admin) {
				if (err) console.log(err);
				done();
			});
		})

	});

	describe('#find()', function() {
		it('should parse json list of users', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/user')
				.set('Content-Type',  'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200)
				.expect(hasUsersKey)
				.end(done);
		function hasUsersKey (res) {
			if (!('users' in res.body)) return "no users key";
		};
		});

		it('should parse json of user', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/user/' + userId)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200)
				.expect(hasUserKey)
				.end(done);
		});

		it('should return notFound', function(done) {
			request(sails.hooks.http.app)
				.get('/api/v1/user/1' + userId)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(404)
				.end(done);
		})
	});

	describe('#create()', function() {
		it('should have  json response', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/user')
				.send({email: 'testuser@gmail.com', password: '123456test'})
				.expect(201)
				.expect(hasUserKey)
				.end(done);

		});
		it('should return badRequest', function(done) {
			request(sails.hooks.http.app)
				.post('/api/v1/user')
				.send({email: '', password: '123456test'})
				.expect(400)
				.end(done);
		});

	});

	function hasUserKey(res) {
	  if (!('user' in res.body)) return "user key";
	};

	describe('#update()', function() {
		it('should update user and have json response', function(done) {
			request(sails.hooks.http.app)
				.put('/api/v1/user/' + userId)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + token)
				.send({email: 'update_user_test@gmail.com'})
				.expect(200)
				.expect(hasUserKey)
				.end(done);
		});

		it('should return badRequest', function(done) {
			request(sails.hooks.http.app)
				.put('/api/v1/user/')
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + token)
				.send({email: ''})
				.expect(400)
				.end(done);
		});

		it('should return notFound', function(done) {
			request(sails.hooks.http.app)
				.put('/api/v1/user/1' + userId)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + token)
				.send({email: 'update_user_test@gmail.com'})
				.expect(404)
				.end(done);
		})
	});

	describe('#destroy()', function() {
		it('should return 204', function(done) {
			request(sails.hooks.http.app)
				.delete('/api/v1/user/' + userId)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + token)
				.expect(204)
				.end(done);
		})
	})
});
