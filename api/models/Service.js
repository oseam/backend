/**
* Service.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name: {
  		type: 'string',
  		required: true,
      string: true
  	},
    type: {
      type: 'string',
      required: true,
      string: true
    },
    duration: {
      type: 'float',
      required: true,
      float: true
    },
    price: {
      type: 'integer',
      required: true,
      integer: true,
      min: 10,
      max: 200
    },
    bg: {
      type: 'string'
    }
  },
  seedData:[
      {
        name: 'mowing',
        type: 'small',
        duration: 720000,
        price: 50,
        bg: 'http://mediacache.homeimprovementpages.com.au/creative/galleries/235001_240000/235112/original_images/89163.jpg'
      },
      {
        name: 'mowing',
        type: 'medium',
        duration: 1080000,
        price: 75,
        bg: 'http://hometipster.com/wp-content/uploads/2012/07/front-yard-garden-design-feature.jpg'
      },
      {
        name: 'mowing',
        type: 'large',
        duration: 1440000,
        price: 100,
        bg: 'http://www.wrightgardendesign.com/portfolioExp/family/patha.jpg'
      },
      {
        name: 'leaf_removal',
        type: 'two trees',
        duration: 360000,
        price: 30,
        bg: 'http://thegreatestgarden.com/wp-content/uploads/front-yard-landscaping-australia2.jpg'
      },
      {
        name: 'leaf_removal',
        type: 'three trees',
        duration: 540000,
        price: 45,
        bg: 'http://gaby.fachrul.com/img/gardendecoridea/front-landscape-ideas/pictures-of-front-yard-landscaping-ideas-landscaping-photos800-x-600-161-kb-jpeg-x.jpg'
      },
      {
        name: 'leaf_removal',
        type: 'four trees',
        duration: 720000,
        price: 60,
        bg: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQnG0oElJte-opvR1PgqGpdxna9uLpRqAfifHEktQUPb-tZVaG3'
      },
      {
        name: 'yard_cleaning',
        type: 'small',
        duration: 360000,
        price: 25,
        bg: 'http://mediacache.homeimprovementpages.com.au/creative/galleries/235001_240000/235112/original_images/89163.jpg'        
      },
      {
        name: 'yard_cleaning',
        type: 'medium',
        duration: 720000,
        price: 50,
        bg: 'http://hometipster.com/wp-content/uploads/2012/07/front-yard-garden-design-feature.jpg'
      },
      {
        name: 'yard_cleaning',
        type: 'large',
        duration: 1080000,
        price: 75,
        bg: 'http://www.wrightgardendesign.com/portfolioExp/family/patha.jpg'        
      },
    ]
};

