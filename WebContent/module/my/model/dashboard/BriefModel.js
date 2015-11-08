define([ 'backbone' ], function(Backbone) {
	var Brief = Backbone.Model.extend({
		defaults: {
			'projectNo': 0,
			'activityNo': 0,
			'relatedMemberNo': 0,
			'forumParticipationNo': 0
		}
	});
	
	return Brief;
});