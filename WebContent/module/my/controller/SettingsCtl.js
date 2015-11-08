define([ 'backbone', 
		'util', 
		'view/settings/SettingListView', 
		'view/settings/SettingDetailView',
		'css!../../../res/css/my/settings.css' 
	   ], function(Backbone, util, SettingListView, SettingDetailView, css) {
	var SettingsController = function() {
		console.log("This is settings controller module!");
		
		//view
		var listView = new SettingListView();
		
		var detailView = new SettingDetailView();
		
		//添加视图
		$('body > .content-panel').append($(listView.el));
		$('body > .content-panel').append($(detailView.el));
		$('body > .content-panel').animate({scrollTop:0},0);
		
		//初始化侧边栏状态
		$($('.navigation > .list-unstyled > li')[2]).click();
		$($('.setting-list-view > .setting')[0]).click();
		
		SettingsController.onRouteChange = function() {
			listView.remove();
			detailView.remove();
		};
	};
	
	return SettingsController;
});