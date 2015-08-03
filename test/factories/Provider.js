module.exports = function(factory) {
	factory.define('provider')
	  .attr('email', 'user-test@mail.com')
	  .attr('password', '123456test')
	  .attr('firstName', 'Test')
	  .attr('lastName', 'User')
	  .attr('abn', 'hs83u7fhd80')
	  .attr('service', ['mowing', 'leaf_removal'])
	  .attr('location', { type: 'Point', coordinates: [-37.832925, 144.954795]})
	  .attr('address', '1 Test Avenue, South Melbourne')
	  .attr('postcode', 3205);
	factory.define("active_provider").parent("provider")
	  .attr("active", true);
};
