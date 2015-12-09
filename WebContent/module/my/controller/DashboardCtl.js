define([ 
         'backbone',
         'css!../../../res/css/my/dashboard.css',
         //view
         'view/dashboard/BriefView',
         'view/dashboard/PopularTopicView',
         'view/dashboard/RecentActivityView',
         //model
         'model/dashboard/BriefModel',
         'model/dashboard/PopularTopicCollection',
         'model/dashboard/RecentActivityCollection'
       ], function(Backbone, css,
    		   BriefView, PopularTopicView, RecentActivityView, 
    		   BriefModel, PopularTopicCollection, RecentActivityCollection) {
	var DashboardController = function() {
		console.log("This is dashborad controller module!");
		
		//初始化侧边栏状态
		setTimeout(function() {
			$($('.navigation > .list-unstyled > li')[0]).click();
		}, 0);
		
		//若存在search view打开，则关闭
		Backbone.trigger('TopPanelView:hideSearch');
		
		//view container
		var $dashboardViewContainer = $('<div class="dashboard-container">');
		
		//model
		var briefModel = new BriefModel();
		briefModel.fetch();
		var topics = new PopularTopicCollection();
		topics.fetch();
		var activities = new RecentActivityCollection();
		activities.fetch();
		
		//view
		var briefView = new BriefView({
			model: briefModel
		});
		var popularTopicView = new PopularTopicView({
			model: topics
		});
		var recentActivityView = new RecentActivityView({
			model: activities
		});
		
		//添加视图
		$dashboardViewContainer.append($(briefView.el));
		$dashboardViewContainer.append($(popularTopicView.el));
		$dashboardViewContainer.append($(recentActivityView.el));
		
		$('body > .content-panel').append($dashboardViewContainer);
		$dashboardViewContainer.animate({scrollTop:0},0);
		
		DashboardController.onRouteChange = function() {
			briefView.remove();
			popularTopicView.remove();
			recentActivityView.remove();
			
			$dashboardViewContainer.remove();
		};
	};
	
	return DashboardController;
});