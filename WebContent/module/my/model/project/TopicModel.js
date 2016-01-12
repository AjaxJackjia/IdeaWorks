define([ 'backbone' ], function(Backbone) {
	var Topic = Backbone.Model.extend({
		defaults: {
			'topicid': 0,
			'projectid': 0,
			'title': '',
			'creator': '',
			'createtime': '',
			'modifytime': '',
			'description': ''
		},
		
		//fetch时设置id属性, 以便后续的update操作
		parse: function(response) {
			response.id = response.topicid ? response.topicid : "";
		    return response;
		}
	});
	
	return Topic;
});