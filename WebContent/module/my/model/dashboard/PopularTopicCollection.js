define([ 'backbone', 'util', 'model/dashboard/PopularTopicModel' ], function(Backbone, util, PopularTopicModel) {
	var PopularTopicList = Backbone.Collection.extend({
		url: '/IdeaWorks/api/users/' + util.currentUser() + '/dashboard/populartopics',
		
		model: PopularTopicModel
	});
	
	return PopularTopicList;
});