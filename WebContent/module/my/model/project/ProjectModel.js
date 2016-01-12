define([ 'backbone', 'util' ], function(Backbone, util) {
	var Project = Backbone.Model.extend({
		defaults: {
			'projectid': 0,
			'title': '',
			'creator': '',
			'advisor': '',
			'abstractContent': '',
			'status': '',
			'security': '',
			'logo': '',
			'createtime': '',
			'modifytime': ''
		},
		
		//fetch时设置id属性, 以便后续的update操作
		parse: function(response) {
			response.id = response.projectid ? response.projectid : "";
		    return response;
		}
	});
	
	return Project;
});