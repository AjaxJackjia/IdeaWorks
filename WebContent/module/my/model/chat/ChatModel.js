define([ 'backbone', 'util' ], function(Backbone, util) {
	var Chat = Backbone.Model.extend({
		defaults: {
			'chatid': 0,
			'title': '',
			'type': '',
			'creator': '',
			'createtime': '',
			'lastmodifytime': '',
			'tousertype': -1
		},
		
		//fetch时设置id属性, 以便后续的update操作
		parse: function(response) {
			response.id = response.chatid ? response.chatid : "";
		    return response;
		}
	});
	
	return Chat;
});