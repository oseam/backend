var TEST_SECRET = sails.config.stripe.testSecretKey;
var stripe = require('stripe')(TEST_SECRET);

module.exports = {
  charge: function (req, res) {
    var userId = req.user.id;
    var params = req.params.all();
    var source = params.source;
    var provider = params.providerId;
    var amount = params.amount;

    Provider.findOne(provider, function(err, provider) {
      if (err) {
        res.badRequest(err);
      } else {
        stripe_seller_id = provider.stripe_user_id;

        stripe.charges.create({
          amount: amount,
          currency: "usd",
          source: source, // obtained with Stripe.js
          destination: stripe_seller_id,
          application_fee: amount*0.1,
          description: "Charge for test@example.com"
          }, function(err, charge) {
            if (err) {
              res.badRequest(err);
            } else {
              Charge.create()
              res.ok(charge);
            }
          });             
      }
    });
  }

};
