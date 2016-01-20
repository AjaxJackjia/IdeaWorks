define([ 'backbone' ], function(Backbone) {
	var Member = Backbone.Model.extend({
		defaults: {
			'userid': '',
			'nickname': '',
			'logo': ''
		}
	});
	
	return Member;
});