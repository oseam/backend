/**
* Mowing.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
 
  attributes: {
    name: {
      type: 'string',
      defaultsTo: 'mowing'
    },
    booking: {
      model: 'Booking',
    },
    providerId: {
      type: 'string',
      required: true,
      string: true
    }, 
    estimatedSize: {
      type: 'string',
      required: true
    },
    realSize: {
      type: 'string'
    },
    postcode: {
      type: 'integer',
      required: true,
      min: 0,
      max: 10000
    },
    location: {
      type: 'json',
      index:'2dsphere',
      required: true
    },
    address: {
      type: 'string',
      required: true,
      string: true
    },
    startTime: {
      type: 'float',
      float: true
    },
    endTime: {
      type: 'float',
      float: true
    },
    realDuration: {
      type: 'float',
      float: true
    },
    wage: {
      type: 'integer',
      required: true,
      min: 10,
      max: 40
    },
    estimatedPrice: function () {
      return ((this.estimatedDuration / 360000) * wage);
    },
    price: {
      type: 'float',
      float: true
    }
  },
};

