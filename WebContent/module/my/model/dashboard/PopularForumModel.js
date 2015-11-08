define([ 'backbone' ], function(Backbone) {
	var Project = Backbone.Model.extend({
		defaults: {
			'projectId': 0,
			'title': 'project Test Title',
			'advisor': 'martin',
			'status': 'ongoing',
			'abstract': 'This is project abstract',
			'members': [],
			'milestone': [],
			'isEmpty': true
		}
	});
	
	return Project;
});