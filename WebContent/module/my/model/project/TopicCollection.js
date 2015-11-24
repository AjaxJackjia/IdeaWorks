define([ 'backbone', 'util', 'model/project/TopicModel' ], function(Backbone, util, TopicModel) {
	var TopicList = Backbone.Collection.extend({
		model: TopicModel
	});
	
	return TopicList;
});