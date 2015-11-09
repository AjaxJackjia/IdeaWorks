define([ 'backbone', 'model/projects/ProjectModel', ], function(Backbone, Project) {
	var ProjectList = Backbone.Collection.extend({
		url: '/IdeaWorks/api/projects',
		
		model: Project
	});
	
	return ProjectList;
});