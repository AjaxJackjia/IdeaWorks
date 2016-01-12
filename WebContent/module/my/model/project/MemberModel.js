define([ 'backbone' ], function(Backbone) {
	var Member = Backbone.Model.extend({
		defaults: {
			'userid': '',
			'nickname': '',
			'signature': '',
			'realname': '',
			'logo': '',
			'jointime': '',
			'tag': ''
		}
	});
	
	return Member;
});