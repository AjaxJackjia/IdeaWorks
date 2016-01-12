define([ 'backbone', 'util', 'model/search/ProjectModel' ], function(Backbone, util, ProjectModel) {
	var ProjectList = Backbone.Collection.extend({
		url: '/IdeaWorks/api/users/' + util.currentUser() + '/search/projects',
		
		model: ProjectModel
	});
	
	return ProjectList;
});