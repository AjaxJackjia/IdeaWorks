define([ 'backbone', 'util', 'model/chat/MemberModel' ], function(Backbone, util, MemberModel) {
	//分页专用collection
	var MemberList = Backbone.Collection.extend({
		model: MemberModel,
		
		//pagination
		originUrl: '/IdeaWorks/api/users',
		userList: [],
		currentPage: 0,
		pageSize: 10,
		isLoadAll: false,  //是否加载完所有元素
		fetchErrorMsg: '',
		
		url: function() {
			return this.originUrl + '?currentPage=' + this.currentPage + '&pageSize=' + this.pageSize;
		},
		
		parse: function(response) {
			var users;
			
			this.currentPage = response.currentPage;
			this.pageSize = response.pageSize;
			users = response.users;
			
			return users;
		},
		
		nextPage: function(callback) {
			var self = this;
			self.fetch({
				success: function() {
					self.currentPage++;
					self.isLoadAll = (0 == self.models.length) ? true: false;
					
					//将每次拉取的结果存储起来
					_.each(self.models, function(u, index) {
						self.userList.push(u);
					});
					
					if(typeof callback == 'function') {
						callback();
					}
				},
				
				error: function(model, response, options) {
					util.commonErrorHandler(response.responseJSON, self.fetchErrorMsg);
	    		}
			});
		},
		
		//清除所有缓存结果
		cleanAllUsers: function() {
			this.userList = [];
		}
	});
	
	return MemberList;
});