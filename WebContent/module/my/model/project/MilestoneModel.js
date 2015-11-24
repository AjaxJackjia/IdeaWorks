define([ 'backbone' ], function(Backbone) {
	var Milestone = Backbone.Model.extend({
		defaults: {
			'milestoneid': '',
			'projectid': '',
			'title': '',
			'creator': '',
			'time': '',
			'description': ''
		}
	});
	
	return Milestone;
});