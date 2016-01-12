define([ 'backbone', 'util', 'model/notification/NotificationModel' ], function(Backbone, util, NotificationModel) {
	var NotificationList = Backbone.Collection.extend({
		url: '/IdeaWorks/api/users/' + util.currentUser() + '/notifications',
		
		model: NotificationModel
	});
	
	return NotificationList;
});