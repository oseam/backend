module.exports = {
	
	check:  function  (obj) {
      // Return a new promises
      return new Promise(function(resolve, reject) {

        async.parallel([
          function(callback) {
            if (obj.mowing) {
              if (obj.mowing.price) {
                callback(null, obj.mowing.price);
              } else {
                callback(err);
              }
            } else { callback(null, 0) };
          },
          function(callback) {
            if (obj.leafRemoval) {
              if (obj.leafRemoval.price) {
                callback(null, obj.leafRemoval.price);
              } else {
                callback(err);
              }
            } else { callback(null, 0) };
          },
          function(callback) {
            if (obj.weedControl) {
              if (obj.weedControl.price) {
                callback(null, obj.weedControl.price);
              } else {
                callback(err);
              }
            } else { callback(null, 0) };
          },
          function(callback) {
            if (obj.yardCleaning) {
              if (obj.yardCleaning.price) {
                callback(null, obj.yardCleaning.price);
              } else {
                callback(err);
              }
            } else { callback(null, 0) };
          }
          ],
          function(err, results) {
            if (err) {reject(err); 
            } else {
              resolve(results);
            }
          })
      });
    },


}