define([ 'backbone' ], function(Backbone) {
	var Milestone = Backbone.Model.extend({
		defaults: {
			'milestoneid': '',
			'projectid': '',
			'title': '',
			'creator': '',
			'time': '',
			'description': ''
		},
		
		//fetch时设置id属性, 以便后续的update操作
		parse: function(response) {
			response.id = response.milestoneid ? response.milestoneid : "";
		    return response;
		}
	});
	
	return Milestone;
});