define([ 'backbone', 'util', 'model/dashboard/PopularTopicModel' ], function(Backbone, util, PopularTopicModel) {
	var PopularTopicList = Backbone.Collection.extend({
		url: '/IdeaWorks/api/users/' + util.currentUser() + '/populartopics',
		
		model: PopularTopicModel
	});
	
	return PopularTopicList;
});