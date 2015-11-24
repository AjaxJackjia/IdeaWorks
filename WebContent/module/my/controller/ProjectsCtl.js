define([ 
		'backbone', 
		'util',
		'css!../../../res/css/my/projects.css',
		//view
		'view/projects/ProjectListView', 
		'view/projects/ProjectDetailView',
		//model
		'model/project/ProjectCollection'
       ], function(Backbone, util, css, ProjectListView, ProjectDetailView, ProjectCollection) {
	var ProjectsController = function() {
		console.log("This is projects controller module!");
		
		//初始化侧边栏状态
		$($('.navigation > .list-unstyled > li')[1]).click();
		
		//model
		var listModel = new ProjectCollection();
		listModel.fetch();		
		
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