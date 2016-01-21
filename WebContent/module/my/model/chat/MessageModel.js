define([ 'backbone', 'util' ], function(Backbone, util) {
	var Message = Backbone.Model.extend({
		defaults: {
			'msgid': 0,
			'chatid': 0,
			'creator': '',
			'msg': '',
			'time': ''
		},
		
		//fetch时设置id属性, 以便后续的update操作
		parse: function(response) {
			response.id = response.msgid ? response.msgid : "";
		    return response;
		}
	});
	
	return Message;
});