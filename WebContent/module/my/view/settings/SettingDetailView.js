define([ 
         'backbone', 'util',
         'view/settings/SettingListView',
         'view/settings/SettingDetailProfileView',
         'view/settings/SettingDetailNotificationView',
         'view/settings/SettingDetailPrivacyView',
         'view/settings/SettingDetailAdvancedView'
       ], 
    function(Backbone, util,
    		SettingListView,
    		SettingDetailProfileView,
    		SettingDetailNotificationView,
    		SettingDetailPrivacyView,
    		SettingDetailAdvancedView) {
	var SettingDetailView = Backbone.View.extend({
		
		className: 'setting-detail-view',
		
		initialize: function(){
			_.bindAll(this, 'render', 'show');
			
			//注册全局事件
			Backbone.off('ShowSettingDetail').on('ShowSettingDetail', this.show, this);
		
			//当前选中的选项设置
			this.currentSetting = '';
			
			this.render();
		},
		
		render: function(){
			//清空
			$(this.el).html('');
			
			var currentSetting = this.currentSetting;
			
			if(this.currentSetting == 'Profile') {
				var profileView = new SettingDetailProfileView();
				$(this.el).append(profileView.render().el);
			}else if(this.currentSetting == 'Notification') {
				var notificationView = new SettingDetailNotificationView();
				$(this.el).append(notificationView.render().el);
			}else if(this.currentSetting == 'Privacy settings') {
				var privacyView = new SettingDetailPrivacyView();
				$(this.el).append(privacyView.render().el);
			}else if(this.currentSetting == 'Advanced settings') {
				var advancedView = new SettingDetailAdvancedView();
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