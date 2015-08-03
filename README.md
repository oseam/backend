# oseam Application
* <a href="#requirements">Requirements</a>
* <a href="#how-to-install-dependencies">How to install & run</a>
* <a href="#online-api-test">Online API test</a>
* <a href="#use-cases">Use cases</a>
* <a href="#location">Location</a>
* <a href="#get-different-service-information">Service Information</a>
* <a href="#user-flow">User Flow</a>
* <a href="#provider-flow">Provider Flow</a>
* <a href="#socketio">Socketio</a>
* <a href="#admin-flow">Admin Flow</a>

# Requirements
* <a href="https://www.mongodb.org/downloads">Mongodb</a>
* <a href="https://nodejs.org/">Node.js</a> or <a href="https://iojs.org/en/index.html">io.js</a>

# How to Install & Run
Open Terminal/Powershell & CD into where oseam-app is located & Run these commands
```
$ sudo npm install
```
In a new terminal, Run This command *(Required for Database)*
```
$ mongod
```
Then in the other terminal (where you installed the dependencies) Run this command
```
$ npm start
```
* You might not need to run as Super user (sudo)
* Don't include ```$``` into your commands
* To access authorize location, set Authorization header with *'Bearer' + token* .

# Online API test
http://oseam.herokuapp.com

# Use cases

##### User
1. Landing.
2. User select service. Example:
  * Select Mowing
  * Fetch mowing info (GET: /api/v1/services?name=mowing)
  * User select type of service (estimatedSize, treeNumber, ect...)
  * User get estimatedDuration to perform service
3. If user is interested, he/she can get provider information by
  * Choose the time they want
  * User enter address to fetch provider nearby (POST: /api/v1/providers)
  * If Geolocation is enable, get address by latlng
  * Store info in local-storage for booking purpose (services, address, bookTime, estimatedDuration, wage, providerId, estimatedSize (optional), treeNumber (optional))
4. If user choose booking, move to sign-up/sign-in location.
5. After successfully login, progress to booking. Eg: Confirm booking with information stored in local-storage
6. User is able to manage previous bookings.
  * Update bookTime
  * Delete booking
7. User notification
  * Get initial notification (GET: /api/v1/read_unotification)
  * Subcribe socketIo for real-time push notification

##### Provider
1. Landing
2. Go to provider signin/signup
3. Provider is notified when user book him/her to provide task through socketIO
4. Provider is able to:
  * View job
  * Update job. Eg: startTime, endTime, completed
  * Reject job. Job is auto assigned to another provider and notify by SocketIO.
5. Provider notification
  * Get initial notification (GET: /api/v1/read_pnotification)
  * Subcribe socketIo for real-time push notification

# Location

##### Get lat, lng and postcode by address
  * POST: /api/v1/latlng
  * Required params: address

##### Get address by latlng
  * GET: /api/v1/address
  * Params: lat, lng

##### Get location info by ip
  * GET: /api/v1/location

# Get different service information

##### Get service info
  * GET: /api/v1/services
  * Situational Params: name, type, duration (in milliseconds), price
  * Example GET: /api/v1/services?name=mowing&type=small

##### Fetch provider nearby (return max 3 providers)
  * POST: /api/v1/providers
  * Params: services (array), address, bookTime, estimatedDuration (calculated from service info above)
```Json
{
  "dis": 0,
  "obj": {
    "_id": "5541c38aeca343890e031819",
    "firstName": "xxx",
    "lastName": "xxx",
    "abn": "312132",
    "address": "1 Test Avenue, South Melbourne",
    "service": [
        "mowing"
    ],
    "location": {
        "type": "Point",
        "coordinates": [
            144.954795,
            -37.832925
        ]
    },
    "postcode": "3205",
    "verified": false,
    "stripe_account": false,
    "createdAt": "2015-04-30T05:54:18.122Z",
    "updatedAt": "2015-04-30T05:54:18.122Z"
  }
}
```
# User flow

##### Register account
  * POST: /api/v1/user
  * Required params: email, password
  * Json response example
```json
{
  "user": {
    "email": "hello@gmail.com",
    "verified": false,
    "updatedAt": "2015-04-16T08:37:49.375Z",
    "id": "552f74dd3917d69f0d9800ca"
  }
}
```

##### User Login. NOTE: in development, login with out verifying account.
	* POST: /api/v1/user_login OR /api/v1/login
	* Params: email, password
  * Json response example
```json
{
  "user": {
    "verified": false,
    "createdAt": "2015-05-01T10:37:25.304Z",
    "updatedAt": "2015-05-01T10:37:34.576Z",
    "id": "55435765bb0bf70b1abd3683"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7InZlcmlmaWVkIjpmYWxzZSwiY3JlYXRlZEF0IjoiMjAxNS0wNS0wMVQxMDozNzoyNS4zMDRaIiwidXBkYXRlZEF0IjoiMjAxNS0wNS0wMVQxMDozNzoyNS4zMDRaIiwiaWQiOiI1NTQzNTc2NWJiMGJmNzBiMWFiZDM2ODMifSwiaWF0IjoxNDMwNDc2NjU0LCJleHAiOjE0MzA1NjMwNTR9.yQtvsYFIkgMyTs7ROOSF05OiTjtSxqbaoLvLQBdqHKw"
}
```
##### Facebook oauth
	* GET: /api/v1/auth/facebook
	* Automatic callback at: /api/v1/auth/facebook/callback
  * Json response example
```json
{
  "success": true,
  "user": {
  	"apiProvider": "Facebook",
    "verified": true,
    "createdAt": "2015-04-16T08:37:49.375Z",
    "updatedAt": "2015-04-16T08:37:49.375Z",
    "id": "552f74dd3917d69f0d9800ca"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImVtYWlsIjoidnVvbmduZ28ucGRAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkb2dPZElEVEtrd256N3k2UXVSdDI2dTRoamI5WGpTajhtbTRuelJwaEdVaUVSYzBmZ0FyRkciLCJ2ZXJpZmllZCI6ZmFsc2UsImNyZWF0ZWRBdCI6IjIwMTUtMDQtMTZUMDg6Mzc6NDkuMzc1WiIsInVwZGF0ZWRBdCI6IjIwMTUtMDQtMTZUMDg6Mzc6NDkuMzc1WiIsImlkIjoiNTUyZjc0ZGQzOTE3ZDY5ZjBkOTgwMGNhIn0sImlhdCI6MTQyOTE3MzU2MCwiZXhwIjoxNDI5MjU5OTYwfQ.5Z_FLhf7Uvv1TO5_YOWRbRE88hF094StMpdcU3pahoE"
}
```

##### Update account (AUTH)
	* PUT: /api/v1/user/:id
  * Params: avatar (file)

##### Destroy account (AUTH)
	* DELETE: /api/v1/user/:id

##### Create booking (AUTH)
	* POST: /api/v1/booking
	* Required params: services (array), estimatedSize, address, bookTime (in milliseconds), estimatedDuration (in milliseconds), wage, providerId (when user selects provider)
  * Additional params: postcode, lat, lng, repeat
  * Json response example
```json
{
  "booking": {
    "userId": "5541c4de11b496bb0e24b2fa",
    "services": [
      {
        "name": "mowing",
        "id": "5541c50911b496bb0e24b2fb"
      }
    ],
    "bookTime": 1429977804187,
    "estimatedDuration": 1440000,
    "providerId": "5541c49f11b496bb0e24b2f9",
    "location": {
      "type": "Point",
      "coordinates": [
        144.954795,
        -37.832925
      ]
    },
    "completed": false,
    "createdAt": "2015-04-30T06:00:41.779Z",
    "updatedAt": "2015-04-30T06:00:41.779Z",
    "id": "5541c50911b496bb0e24b2fd"
  },
  "services": [
    [
      {
        "estimatedSize": "Medium",
        "address": "1 Test Avenue, South Melbourne",
        "wage": 30,
        "providerId": "5541c49f11b496bb0e24b2f9",
        "location": {
          "type": "Point",
          "coordinates": [
            144.954795,
            -37.832925
          ]
        },
        "postcode": 3205,
        "name": "mowing",
        "repeat": null,
        "completed": false,
        "createdAt": "2015-04-30T06:00:41.688Z",
        "updatedAt": "2015-04-30T06:00:41.782Z",
        "bookingId": "5541c50911b496bb0e24b2fd",
        "id": "5541c50911b496bb0e24b2fb"
      }
    ]
  ]
}
```
##### View list of previous booking by user (AUTH)
	* GET: /api/v1/view_booking
  * Params: completed (true or false)
```json
[
{
    "userId": "553b231b84e52c8222b105db",
    "services": [
      {
        "name": "mowing",
        "id": "553b232b84e52c8222b105dc"
      }
    ],
    "completed": false,
    "createdAt": "2015-04-25T05:16:27.506Z",
    "updatedAt": "2015-04-25T05:16:27.506Z",
    "id": "553b232b84e52c8222b105de",
    "info": [
      {
        "estimatedSize": "Medium",
        "address": "1 Test Avenue, South Melbourne",
        "bookTime": 1429977804187,
        "estimatedDuration": 1440000,
        "wage": 30,
        "location": {
          "type": "Point",
          "coordinates": [
            144.954795,
            -37.832925
          ]
        },
        "postcode": 3205,
        "providerId": "553b22da84e52c8222b105da",
        "name": "mowing",
        "repeat": null,
        "completed": false,
        "createdAt": "2015-04-25T05:16:27.500Z",
        "updatedAt": "2015-04-25T05:16:27.510Z",
        "bookingId": "553b232b84e52c8222b105de",
        "id": "553b232b84e52c8222b105dc"
      }
    ]
  }
]
```

##### Update booking time (AUTH)
  * PUT: /api/v1/booking/:id
  * Params: bookTime (in milliseconds)

##### Destroy booking (AUTH)
  * DELETE: /api/v1/booking/:id

##### Get initial notifications (AUTH)
  * GET: /api/v1/read_unotification
  * Params: read (true/false)

##### Update notifications to read (AUTH)
  * GET: /api/v1/update_unotification

##### Logout (AUTH)
	* GET: /api/v1/logout
	* OR: simply clear token in session or local-service

# Provider flow

##### Register account
  * POST: /api/v1/provider
  * Required params: email, password, firstName, lastName, abn, address, service (in array),
  * Additional params: businessName, postcode, lat, lng, service
  * Json response example
```json
{
  "provider": {
    "email": "xxx@gmail.com",
    "password": "$2a$10$9ilqAUVldTFUjIEF2nJBOOOIclaEUREtLvP9FvFAO9bc8K75aZ9iu",
    "firstName": "xxx",
    "lastName": "xxx",
    "abn": "312132",
    "address": "1 Test Avenue, South Melbourne",
    "service": [
        "mowing"
    ],
    "location": {
        "type": "Point",
        "coordinates": [
            144.954795,
            -37.832925
        ]
    },
    "postcode": "3205",
    "verified": false,
    "stripe_account": false,
    "createdAt": "2015-04-25T05:15:06.945Z",
    "updatedAt": "2015-04-25T05:15:06.945Z",
    "id": "553b22da84e52c8222b105da"
  }
}
```
##### Provider Login
  * POST: /api/v1/provider_login OR /api/v1/login
  * Parameters: email, password
  * Json response example
```json
{
  "provider": {
    "firstName": "vuong",
    "lastName": "ngo",
    "abn": "312132635hg",
    "address": "1 Test Avenue, South Melbourne",
    "service": [
      "mowing"
    ],
    "location": {
      "type": "Point",
      "coordinates": [
        144.954795,
        -37.832925
      ]
    },
    "postcode": 3205,
    "verified": false,
    "createdAt": "2015-05-01T10:37:16.217Z",
    "updatedAt": "2015-05-01T10:40:33.864Z",
    "id": "5543575cbb0bf70b1abd3682"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwcm92aWRlciI6eyJmaXJzdE5hbWUiOiJ2dW9uZyIsImxhc3ROYW1lIjoibmdvIiwiYWJuIjoiMzEyMTMyNjM1aGciLCJhZGRyZXNzIjoiMTYgS2VhdHMgQXZlbnVlLCBLaW5nc2J1cnkiLCJzZXJ2aWNlIjpbIm1vd2luZyJdLCJsb2NhdGlvbiI6eyJ0eXBlIjoiUG9pbnQiLCJjb29yZGluYXRlcyI6WzE0NS4wMzY0NzgsLTM3LjcxODU2NF19LCJwb3N0Y29kZSI6MzA4MywidmVyaWZpZWQiOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDE1LTA1LTAxVDEwOjM3OjE2LjIxN1oiLCJ1cGRhdGVkQXQiOiIyMDE1LTA1LTAxVDEwOjM3OjE3LjYyNloiLCJpZCI6IjU1NDM1NzVjYmIwYmY3MGIxYWJkMzY4MiJ9LCJpYXQiOjE0MzA0NzY4MzMsImV4cCI6MTQzMDU2MzIzM30.IvRrC-YZjvfuv7XtHf58FgqHlK8QZabm5ONJ75lF2ek"
}
```

##### Update account (AUTH)
  * PUT: /api/v1/provider
  * Params: avatar (file)

##### Destroy account (AUTH)
  * DELETE: /api/v1/provider/:id

##### View job
  * GET: /api/v1/provider_job (AUTH)
  * Params: completed (true or false)
```json
[
  {
    "estimatedSize": "Medium",
    "address": "1 Test Avenue, South Melbourne",
    "bookTime": 1429977804187,
    "estimatedDuration": 1440000,
    "wage": 30,
    "location": {
      "type": "Point",
      "coordinates": [
        144.954795,
        -37.832925
      ]
    },
    "postcode": 3205,
    "providerId": "553b22da84e52c8222b105da",
    "name": "mowing",
    "repeat": null,
    "completed": false,
    "createdAt": "2015-04-25T05:16:27.500Z",
    "updatedAt": "2015-04-25T05:16:27.510Z",
    "bookingId": "553b232b84e52c8222b105de",
    "id": "553b232b84e52c8222b105dc"
  }
]
```

##### Reject job (AUTH)
  * PUT: /api/v1/reject_job/:id (with id = bookingId)

##### Update task (AUTH)
  * PUT: /api/v1/provider_mowing/:id
  * Similarly: provider_leaf_removal, provider_weed_control, provider_yard_cleaning
  * Params: realSize, startTime, endTime, completed

##### Update booking after completed all task
  * GET: /api/v1/provider_booking/:id (with id = bookingId)

##### Get initial notifications (AUTH)
  * GET: /api/v1/read_pnotification
  * Params: read (true/false)

##### Update notifications to read (AUTH)
  * GET: /api/v1/update_pnotification

##### Logout (AUTH)
  * GET: /api/v1/logout
  * OR: simply clear token in session or local-service

# Socketio

##### User Notification
  * EXAMPLE
```javascript
<!-- Subcribe private socket connection with userId -->
var socket = io.connect('/user' + userId, {
<!-- Handshake with token to authorize user -->
  'query': 'token=Bearer ' + token
});
<!-- Listen to socket -->
socket.on('notification', function(data) {
  console.log(data);
  <!-- Do something with data like $scope.notification = $scope.notification.concat(data) -->
});
```
##### Provider Notification
  * EXAMPLE
```javascript
<!-- Subcribe private socket connection with providerId -->
var socket = io.connect('/user' + providerId, {
<!-- Handshake with token to authorize provider -->
  'query': 'token=Bearer ' + token
});
socket.on('notification', function(data) {
  console.log(data);
  <!-- Do something with data like $scope.notification = $scope.notification.concat(data) -->
});
```
##### Admin notification
  * EXAMPLE
```javascript
var socket = io.connect('/administrator', {
<!-- Handshake with token to authorize admin -->
  'query': 'token=Bearer ' + token
});
socket.on('notification', function(data) {
  console.log(data);
  <!-- Do something with data like $scope.notification = $scope.notification.concat(data) -->
});
```

##### TODO: add url to socket connection if used on different server.

# Admin flow

##### Admin Login
  * POST: /api/administrator
  * Parameters: email = test@oseam.com, password = 123456789
```json
{
  "admin": {
    "createdAt": "2015-05-02T06:36:19.408Z",
    "updatedAt": "2015-05-02T06:36:22.215Z",
    "id": "5544706382b8d03b1c2930d4"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6eyJjcmVhdGVkQXQiOiIyMDE1LTA1LTAyVDA2OjM2OjE5LjQwOFoiLCJ1cGRhdGVkQXQiOiIyMDE1LTA1LTAyVDA2OjM2OjE5LjQwOFoiLCJpZCI6IjU1NDQ3MDYzODJiOGQwM2IxYzI5MzBkNCJ9LCJpYXQiOjE0MzA1NDg1ODIsImV4cCI6MTQzMDYzNDk4Mn0.9nPheTCWhZFKI_FUohOGPcqADKwZSzwd0Q_SgvczUFs"
}
```
##### CRUD service point (AUTH)
  * Endpoint: /api/v1/service
  * Params: name (eg: cleaning), type (eg: small, medium), duration (in milliseconds), price

##### Find user by id (AUTH)
  * GET: /api/v1/user/:id

##### Find all users (AUTH)
  * GET: /api/v1/user

##### Find provider by id (AUTH)
  * GET: /api/v1/provider/:id

##### Find all providers (AUTH)
  * GET: /api/v1/provider

##### Find booking by id (AUTH)
  * GET: /api/v1/booking/:id

##### Find all bookings (AUTH)
  * GET: /api/v1/booking

##### CRUD different services (mowing, leaf_removal, weed_control, yard_cleaning) (AUTH)
  * GET: /api/v1/mowing
  * PUT: /api/v1/mowing

##### Get initial notifications (AUTH)
  * GET: /api/v1/read_anotification
  * Params: read (true/false)

##### Update notifications to read (AUTH)
  * GET: /api/v1/update_anotification

##### Create user_notification
  * POST: /api/v1/user_notification
  * Params: userId, booking, mes

##### View user_notifications
  * GET: /api/v1/user_notification

##### Destroy user_notification
  * DELETE: /api/v1/user_notification/:id  

##### Create provider_notification
  * POST: /api/v1/provider_notification
  * Params: userId, booking, mes

##### View user_notifications
  * GET: /api/v1/provider_notification

##### Destroy provider_notification
  * DELETE: /api/v1/provider_notification/:id
