define([ 'backbone' ], function(Backbone) {
	var Person = Backbone.Model.extend({
		defaults: {
			//basic info
			'userid': '',
			'nickname': '',
			'signature': '',
			'logo': '',
			'usertype': '',
			//detailed info
			'realname': '',
			'phone': '',
			'email': '',
			'skype': '',
			'wechat': '',
			'major': '',
			'department': '',
			'college': '',
			'address': '',
			'introduction': '',
			'interests': ''
		},
		
		//fetch时设置id属性, 以便后续的update操作
		parse: function(response) {
			response.id = response.userid ? response.userid : "";
		    return response;
		}
	});
	
	return Person;
});