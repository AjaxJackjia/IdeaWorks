define([ 'backbone' ], function(Backbone) {
	var Login = Backbone.Model.extend({
		urlRoot: '/IdeaWorks/api/auth/login',
		
		defaults: {
			userid: '',
			password: '',
			nickname: '',
			userlogo: '',
			userlang: '',
			msg: ''
		}
	});
	
	return Login;
});