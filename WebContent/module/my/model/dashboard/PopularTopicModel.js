define([ 'backbone' ], function(Backbone) {
	var PopularTopic = Backbone.Model.extend({
		defaults: {
			'topicid': 0,
			'projectid': 0,
			'title': '',
			'creator': '',
			'createtime': '',
			'modifytime': '',
			'description': '',
			'participantNo': 0,
			'messageNo': 0,
			'isEmpty': true
		}
	});
	
	return PopularTopic;
});