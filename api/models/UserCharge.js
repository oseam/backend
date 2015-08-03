/**
* Booking.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	userId: {
      model: 'User',
      required: true
  	},
    providerId: {
      model: 'Provider',
      required: true
    },
    amount: {
      type: 'float', 
      float: true
    },
    currency: {
      defaultsTo: 'aud'
    },
    paid: {
      defaultsTo: false
    },
    chargeId: {
      type: 'string',
      required: true
    }
  },

};

