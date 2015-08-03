/**
* AdminNotification.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    booking: {
      type: 'json',
    },
    mes: {
      type: 'string',
      string: true
    },
    read: {
      type: 'boolean',
      defaultsTo: false
    }
  },
};

