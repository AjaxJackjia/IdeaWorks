define([ 'backbone' ], function(Backbone) {
	var Project = Backbone.Model.extend({
		defaults: {
			'projectid': 0,
			'img': '',
			'title': '',
			'content': '',
			'directUrl': ''
		}
	});
	
	return Project;
});