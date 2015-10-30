define([ 'backbone', 'model/projects/ProjectModel', ], function(Backbone, Project) {
	var ProjectList = Backbone.Collection.extend({
		model: Project
	});
	
	return ProjectList;
});