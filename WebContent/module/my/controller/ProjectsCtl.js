define([ 
		'backbone', 
		'util', 
		'view/projects/ProjectListView', 
		'view/projects/ProjectDetailView',
		'model/projects/ProjectListModel',
		'model/projects/ProjectModel',
		'css!../../../res/css/my/projects.css' 
       ], function(Backbone, util, ProjectListView, ProjectDetailView, ProjectListModel, ProjectModel, css) {
	var ProjectsController = function() {
		console.log("This is projects controller module!");
		
		//model
		var listModel = new ProjectListModel();
		for(var index = 0;index<10;index++) {
			var project = new ProjectModel();
			project.set('projectId', index);
			project.set('isEmpty', false);
			listModel.add(project);
		}
		
		//view
		var listView = new ProjectListView({
			model: listModel
		});
		
		var empty = new ProjectModel();
		var detailView = new ProjectDetailView({
			model: empty
		});
		
		//添加视图
		$('body > .content-panel').append($(listView.el));
		$('body > .content-panel').append($(detailView.el));
		$('body > .content-panel').animate({scrollTop:0},0);
		
		//初始化侧边栏状态
		$($('.navigation > .list-unstyled > li')[1]).click();
		
		ProjectsController.clear = function() {
			listView.remove();
			detailView.remove();
		};
	};
	
	return ProjectsController;
});