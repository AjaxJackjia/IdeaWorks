define([ 
         'backbone', 'util',
         //view
         'view/settings/SettingListView',
         'view/settings/SettingDetailProfileView',
         'view/settings/SettingDetailNotificationView',
         'view/settings/SettingDetailPrivacyView',
         'view/settings/SettingDetailAdvancedView',
         //model
         'model/settings/UserModel'
       ], 
    function(Backbone, util,
    		//view
    		SettingListView,
    		SettingDetailProfileView,
    		SettingDetailNotificationView,
    		SettingDetailPrivacyView,
    		SettingDetailAdvancedView,
    		//model
    		UserModel ) {
	var SettingDetailView = Backbone.View.extend({
		
		className: 'setting-detail-view',
		
		initialize: function(){
			_.bindAll(this, 'render', 'show');
			
			//注册全局事件
			Backbone.off('ShowSettingDetail').on('ShowSettingDetail', this.show, this);
		
			//当前选中的选项设置
			this.currentSetting = '';
			
			//view 自身
			var self = this;
			//user model
			this.model = new UserModel();
			this.model.url = util.baseUrl + '/api/users/' + util.currentUser();
			this.model.fetch({
				wait: true,
				success: function() {
					self.render();
				},
				error: function() {
					alert('Get user profile failed. Please try again later!');
				}
			});
		},
		
		render: function(){
			//清空
			$(this.el).html('');
			
			if(this.currentSetting == 'Profile') {
				var profileView = new SettingDetailProfileView({
					model: this.model
				});
				$(this.el).append(profileView.render().el);
			}else if(this.currentSetting == 'Notification') {
				var notificationView = new SettingDetailNotificationView({
					model: this.model
				});
				$(this.el).append(notificationView.render().el);
			}else if(this.currentSetting == 'Privacy settings') {
				var privacyView = new SettingDetailPrivacyView({
					model: this.model
				});
				$(this.el).append(privacyView.render().el);
			}else if(this.currentSetting == 'Advanced settings') {
				var advancedView = new SettingDetailAdvancedView({
					model: this.model
				});
				$(this.el).append(advancedView.render().el);
			}
			
		    return this;
		},
		
		show: function(setting) {
			this.currentSetting = setting;
			this.render();
		}
	});
	
	return SettingDetailView;
});