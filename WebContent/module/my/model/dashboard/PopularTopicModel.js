define([ 'backbone' ], function(Backbone) {
	var PopularTopic = Backbone.Model.extend({
		defaults: {
			'topicid': 0,
			'topic_title': '',
			'createtime': 0,
			'project_title': '',
			'msg_count': 0
		}
	});
	
	return PopularTopic;
});