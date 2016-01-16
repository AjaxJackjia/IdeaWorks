define([ 'backbone', 
		'util', 
		'view/settings/SettingListView', 
		'view/settings/SettingDetailView'
	   ], function(Backbone, util, SettingListView, SettingDetailView) {
	var SettingsController = function() {
		console.log("This is settings controller module!");
		
		//初始化侧边栏状态
		setTimeout(function() {
			$($('.navigation > .list-unstyled > li')[3]).click();
		}, 0);
		
		//若存在search view打开，则关闭
		Backbone.trigger('TopPanelView:hideSearch');
		
		//view
		var listView = new SettingListView();
		var detailView = new SettingDetailView();
		
		//添加视图
		$('body > .content-panel').append($(listView.el));
		$('body > .content-panel').append($(detailView.el));
		$('body > .content-panel').animate({scrollTop:0},0);
		
		//默认选中第一个设置
		$($('.setting-list-view > .setting')[0]).click();
		
		SettingsController.onRouteChange = function() {
			listView.remove();
			detailView.remove();
		};
	};
	
	return SettingsController;
});