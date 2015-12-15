define([ 'backbone' ], function(Backbone) {
	var Person = Backbone.Model.extend({
		defaults: {
			'userid': '',
			'nickname': '',
			'signature': '',
			'realname': '',
			'logo': ''
		}
	});
	
	return Person;
});