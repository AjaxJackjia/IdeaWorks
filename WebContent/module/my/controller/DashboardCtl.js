define([ 'backbone', '../view/dashboard/IndexView' ], function(Backbone, IndexView) {
	var DashboardController = function() {
		console.log("This is dashborad controller module!");
		
		var indexView = new IndexView();
		$('body > .content-panel').append(indexView.render().el);
		$('body > .content-panel').animate({scrollTop:0},0);
		
		//初始化侧边栏状态
		$($('.navigation > .list-unstyled > li')[0]).click();
		
		DashboardController.clear = function() {
			indexView.remove();
		};
	};
	
	return DashboardController;
});