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
		
		//list model
		var listModel = new ProjectListModel();
		var listView = null;
		listModel.fetch({
			success: function() {
				//list view
				listView = new ProjectListView({
					model: listModel
				});
				
				//添加视图
				$('body > .content-panel').append($(listView.el));
			}
		}); 
		
		//detail model
		var empty = new ProjectModel();
		
		//detail view
		var detailView = new ProjectDetailView({
			model: empty
		});
		
		$('body > .content-panel').append($(detailView.el));
		$('body > .content-panel').animate({scrollTop:0},0);
		
		//初始化侧边栏状态
		$($('.navigation > .list-unstyled > li')[1]).click();
		
		ProjectsController.onRouteChange = function() {
			listView.remove();
			detailView.remove();
		};
	};
	
	return ProjectsController;
});