define([ 'backbone' ], function(Backbone) {
	var RecentActivityModel = Backbone.Model.extend({
		defaults: {
			'activityid': 0,
			'projectid': 0,
			'title': '',
			'operator': '',
			'time': ''
		}
	});
	
	return RecentActivityModel;
});