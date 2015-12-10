define([ 'backbone' ], function(Backbone) {
	var Login = Backbone.Model.extend({
		urlRoot: '/IdeaWorks/api/auth/signup',
		
		defaults: {
			'username': '',
			'password': '',
			'usertype': '',
			'email': '',
			'msg': ''
		}
	});
	
	return Login;
});