define([ 'backbone', 'util' ], function(Backbone, util) {
	var Brief = Backbone.Model.extend({
		urlRoot: '/IdeaWorks/api/users/' + util.currentUser() + '/dashboardbrief',
		
		defaults: {
			'projectNo': 0,
			'activityNo': 0,
			'relatedMemberNo': 0,
			'forumParticipationNo': 0
		}
	});
	
	return Brief;
});