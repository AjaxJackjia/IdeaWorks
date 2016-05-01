define([ 'backbone', 'util', 'model/project/ActivityModel' ], function(Backbone, util, ActivityModel) {
	var ActivityList = Backbone.Collection.extend({
		model: ActivityModel,
		
		//pagination
		originUrl: '',
		currentPage: 0,
		pageSize: 10,
		totalCount: 0, //元素所有数量
		isLoadAll: false,  //是否加载完所有元素
		fetchErrorMsg: '',
		
		url: function() {
			if(this.originUrl == '') {
				return '';
			}
			
			return this.originUrl + '?currentPage=' + this.currentPage + '&pageSize=' + this.pageSize;
		},
		
		parse: function(response) {
			var activities;
			
			this.currentPage = response.currentPage;
			this.pageSize = response.pageSize;
			activities = response.activities;
			
			return activities;
		},
		
		nextPage: function(callback) {
			var self = this;
			self.fetch({
				success: function() {
					self.currentPage++;
					self.isLoadAll = (0 == self.models.length) ? true: false;
					self.totalCount += self.models.length;
					
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
	
	return ActivityList;
});