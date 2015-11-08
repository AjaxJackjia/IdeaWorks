define([ 
         'backbone', 
         '../view/dashboard/BriefView',
         '../view/dashboard/PopularForumView',
         '../view/dashboard/RecentActivityView',
         'css!../../../res/css/my/dashboard.css'
       ], function(Backbone, BriefView, PopularForumView, RecentActivityView, css) {
	var DashboardController = function() {
		console.log("This is dashborad controller module!");
		
		//model
		var briefModel = new BriefModel();
		briefModel.set('projectNo', 10);
		briefModel.set('activityNo', 112);
		briefModel.set('relatedMemberNo', 37);
		briefModel.set('forumParticipationNo', 452);
		
		//view
		var $dashboardViewContainer = $('<div class="dashboard-container">');
		var briefView = new BriefView();
		var popularForumView = new PopularForumView();
		var recentActivityView = new RecentActivityView();
		
		//添加视图
		$dashboardViewContainer.append($(briefView.el));
		$dashboardViewContainer.append($(popularForumView.el));
		$dashboardViewContainer.append($(recentActivityView.el));
		
		$('body > .content-panel').append($dashboardViewContainer);
		$dashboardViewContainer.animate({scrollTop:0},0);
		
		
		//初始化侧边栏状态
		$($('.navigation > .list-unstyled > li')[0]).click();
		
		DashboardController.onRouteChange = function() {
			briefView.remove();
			popularForumView.remove();
			recentActivityView.remove();
			
			$dashboardViewContainer.remove();
		};
	};
	
	return DashboardController;
});