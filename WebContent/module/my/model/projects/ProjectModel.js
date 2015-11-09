define([ 'backbone' ], function(Backbone) {
	var Project = Backbone.Model.extend({
		defaults: {
			'id': 0,
			'title': '',
			'creator': '',
			'advisor': '',
			'abstractContent': '',
			'status': '',
			'security': '',
			'logo': '',
			'createtime': '',
			'modifytime': '',
			'isDeleted': '',
			'isEmpty': true
		}
	});
	
	return Project;
});