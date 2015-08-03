/**
* Booking.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	userId: {
      model: 'User'
  	},
    providerId: {
      model: 'Provider',
      required: true
    }, 
    bookTime: {
      type: 'float',
      required: true,
      float: true
    },
    estimatedDuration: {
      type: 'float',
      required: true,
      float: true
    },
    location: {
      type: 'json',
      index:'2dsphere',
      required: true
    },
    mowing: {
      model: 'Mowing'
    },
    leafRemoval: {
      model: 'LeafRemoval'
    },
    weedControl: {
      model: 'WeedControl'
    },
    yardCleaning: {
      model: 'YardCleaning'
    },
    services: {
      type: 'array',
      required: true
    },
    price: {
      type: 'interger',
      integer: true,
      min: 10,
      max: 200
    },
    completed: {
      type: 'boolean',
      defaultsTo: false
    }
  },

//model validation messages definitions
  validationMessages: { //hand for i18n & l10n
      providerId: {
        required: 'Provider is required',
      },
      bookTime: {
        required: 'Booking time is required',
        float: 'Incorrect format'
      },
      estimatedDuration: {
        required: 'Estimated duration is required',
        float: 'Incorrect format'
      },
      services: {
        required: 'Family name is required',
      }
  },

  afterDestroy: function(deletedRecords, next) {
    async.each(deletedRecords, function(booking, callback) {
        async.parallel([
            function(callback){
              if (booking.mowing) {
                Mowing.destroy({booking: booking.id}, function(err) {
                  if (err) { callback(err);
                  } else { callback(null); };
                });
              } else { callback(false); };
            },
            function(callback){
              if (booking.leafRemoval) {
                LeafRemoval.destroy({booking: booking.id}, function(err) {
                  if (err) { callback(err);
                  } else { callback(null); };                
                });
              } else { callback(false); };
            },
            function(callback){
              if (booking.weedControl) {
                WeedControl.destroy({booking: booking.id}, function(err) {
                  if (err) { callback(err);
                  } else { callback(null); };                
                });
              } else { callback(false); };
            },
            function(callback){
              if (booking.yardCleaning) {
                YardCleaning.destroy({booking: booking.id}, function(err) {
                  if (err) { callback(err);
                  } else { callback(null); };                
                });
              } else { callback(false); };
            },
        ],
        function(err, results){
          if (err) { callback(err);
          } else {
            callback();
          }
        });
      }, function(err) {
        if (err) {
          next(err);
        } else {
          next();
        } 
      });
  }
};

