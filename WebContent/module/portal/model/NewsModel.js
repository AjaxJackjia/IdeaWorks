define([ 'backbone' ], function(Backbone) {
	var News = Backbone.Model.extend({
		defaults: {
			'newsid': 0,
			'img': '',
			'title': '',
			'content': '',
			'directUrl': ''
		}
	});
	
	return News;
});