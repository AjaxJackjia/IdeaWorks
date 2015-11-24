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
			'time': ''
		}
	});
	
	return Message;
});