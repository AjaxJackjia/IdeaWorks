define([ 'backbone', 'util', 
         //view
         '../view/ProjectListView', '../view/ProjectView',
         //model
         'model/ProjectCollection'
       ], function(Backbone, util, ProjectListView, ProjectView, ProjectCollection) {
	var ProjectController = function() {
		console.log("This is project controller module!");
		
		var projectCollection = ProjectCollection; //已初始化
		
		var params = util.resolveUrlParams();
		
		if(params.hasOwnProperty('id')) {
			var project = new ProjectView({
				model: projectCollection.where({projectid: params.id})[0]
			});
			$('body > .container').html(project.render().el);
			$('html,body').animate({scrollTop:0},0);
			
			ProjectController.clear = function() {
				project.remove();
			};
		}else{
			var projectList = new ProjectListView({
				model: projectCollection
			});
			$('body > .container').html(projectList.render().el);
			$('html,body').animate({scrollTop:0},0);
			
			ProjectController.clear = function() {
				projectList.remove();
			};
		}
		
	};
	
	return ProjectController;
});