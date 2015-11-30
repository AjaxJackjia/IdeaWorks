define([ 'backbone', 'util', 'model/dashboard/RecentActivityModel' ], function(Backbone, util, RecentActivityModel) {
	var RecentActivityList = Backbone.Collection.extend({
		url: '/IdeaWorks/api/users/' + util.currentUser() + '/dashboard/recentactivities',
		
		model: RecentActivityModel
	});
	
	return RecentActivityList;
});