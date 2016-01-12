define([ 'backbone' ], function(Backbone) {
	var Message = Backbone.Model.extend({
		defaults: {
			'messageid': 0,
			'pmessageid': 0,
			'topicid': 0,
			'projectid': 0,
			'msg': '',
			'from': '',
			'to': '',
			'time': '',
			'replyCount': 0
		},
		
		//fetch时设置id属性, 以便后续的update操作
		parse: function(response) {
			response.id = response.messageid ? response.messageid : "";
		    return response;
		}
	});
	
	return Message;
});