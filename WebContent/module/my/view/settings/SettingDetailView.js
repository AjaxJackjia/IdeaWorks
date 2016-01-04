define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation',
         //view
         'view/settings/SettingListView',
         'view/settings/SettingDetailProfileView',
         'view/settings/SettingDetailNotificationView',
         'view/settings/SettingDetailPrivacyView',
         'view/settings/SettingDetailAdvancedView',
         //model
         'model/settings/UserModel'
       ], 
    function(Backbone, util, i18n,
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
				error: function(model, response, options) {
					var alertMsg = i18n.my.settings.SettingDetailView.FETCH_PROFILE_ERROR;
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
		},
		
		render: function(){
			//清空
			$(this.el).html('');
			
			if(this.currentSetting == i18n.my.settings.SettingListView.PROFILE) {
				var profileView = new SettingDetailProfileView({
					model: this.model
				});
				$(this.el).append(profileView.render().el);
			}else if(this.currentSetting == i18n.my.settings.SettingListView.NOTIFICATION) {
				var notificationView = new SettingDetailNotificationView({
					model: this.model
				});
				$(this.el).append(notificationView.render().el);
			}else if(this.currentSetting == i18n.my.settings.SettingListView.PRIVACY_SETTINGS) {
				var privacyView = new SettingDetailPrivacyView({
					model: this.model
				});
				$(this.el).append(privacyView.render().el);
			}else if(this.currentSetting == i18n.my.settings.SettingListView.ADVANCED_SETTINGS) {
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