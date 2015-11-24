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
		}
	});
	
	return Topic;
});