define([ 
		'backbone', 
		'util',
		//view
		'view/projects/ProjectListView', 
		'view/projects/ProjectDetailView',
		//model
		'model/project/ProjectCollection'
       ], function(Backbone, util, ProjectListView, ProjectDetailView, ProjectCollection) {
	var ProjectsController = function() {
		console.log("This is projects controller module!");
		
		//初始化侧边栏状态
		setTimeout(function() {
			$($('.navigation > .list-unstyled > li')[1]).click();
		}, 0);
		
		//若存在search view打开，则关闭
		Backbone.trigger('TopPanelView:hideSearch');
		
		//model
		var listModel = new ProjectCollection();
		listModel.fetch({
			error: function(model, response, options) {
				util.commonErrorHandler(response.responseJSON, 'Get user projects failed. Please try again later!');
			}
		});		
		
		//view
		var projectListView = new ProjectListView({
			model: listModel
		});
		var projectDetailView = new ProjectDetailView();
		
		//添加视图
		$('body > .content-panel').append($(projectListView.el));
		$('body > .content-panel').append($(projectDetailView.el));
		$('body > .content-panel').animate({scrollTop:0},0);
		
		ProjectsController.onRouteChange = function() {
			projectListView.remove();
			projectDetailView.remove();
		};
	};
	
	return ProjectsController;
});