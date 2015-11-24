define([ 'backbone' ], function(Backbone) {
	var User = Backbone.Model.extend({
		urlRoot: '/IdeaWorks/api/users/',
		
		defaults: {
			'userid': '',
			'nickname': '',
			'signature': '',
			'realname': '',
			'phone': '',
			'email': '',
			'logo': '',
			'usertype': '',
			'major': '',
			'department': '',
			'college': '',
			'address': '',
			'introduction': '',
			'interests': '',
			'isDeleted': false
		}
	});
	
	return User;
});