define([ 'backbone', 'util', 'model/project/ProjectModel' ], function(Backbone, util, ProjectModel) {
	var ProjectList = Backbone.Collection.extend({
		url: '/IdeaWorks/api/users/' + util.currentUser() + '/projects',
		
		model: ProjectModel
	});
	
	return ProjectList;
});