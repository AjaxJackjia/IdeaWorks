define([ 'backbone' ], function(Backbone) {
	var Forget = Backbone.Model.extend({
		urlRoot: '/IdeaWorks/api/auth/forget',
		
		defaults: {
			userid: '',
			email: '',
			msg: ''
		}
	});
	
	return Forget;
});