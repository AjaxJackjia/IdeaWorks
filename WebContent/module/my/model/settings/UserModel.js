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
			'skype': '',
			'wechat': '',
			'logo': '',
			'usertype': '',
			'major': '',
			'department': '',
			'college': '',
			'address': '',
			'introduction': '',
			'interests': '',
			'notifications': '',
			'privacy': '',
			'sync': '',
			'language': ''
		},
		
		//fetch时设置id属性, 以便后续的update操作
		parse: function(response) {
			response.id = response.userid ? response.userid : "";
		    return response;
		}
	});
	
	return User;
});