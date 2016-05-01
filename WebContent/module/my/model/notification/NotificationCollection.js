define([ 'backbone', 'util', 'model/notification/NotificationModel' ], function(Backbone, util, NotificationModel) {
	var NotificationList = Backbone.Collection.extend({
		model: NotificationModel,
		
		//pagination
		originUrl: '',
		currentPage: 0,
		pageSize: 10,
		isLoadAll: false,  //是否加载完所有元素
		fetchErrorMsg: '',
		
		url: function() {
			return '/IdeaWorks/api/users/' + util.currentUser() + '/notifications?currentPage=' + this.currentPage + '&pageSize=' + this.pageSize;
		},
		
		orginUrl: '/IdeaWorks/api/users/' + util.currentUser() + '/notifications',
		
		parse: function(response) {
			var notifications;
			
			this.currentPage = response.currentPage;
			this.pageSize = response.pageSize;
			notifications = response.notifications;
			
			return notifications;
		},
		
		nextPage: function(callback) {
			var self = this;
			self.fetch({
				success: function() {
					self.currentPage++;
					self.isLoadAll = (0 == self.models.length) ? true: false;
					
					if(typeof callback == 'function') {
						callback();
					}
				},
				
				error: function(model, response, options) {
					util.commonErrorHandler(response.responseJSON, self.fetchErrorMsg);
	    		}
			});
		}
	});
	
	return NotificationList;
});