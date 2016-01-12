define([ 'backbone', 'util', 'model/project/ActivityModel' ], function(Backbone, util, ActivityModel) {
	var ActivityList = Backbone.Collection.extend({
		model: ActivityModel
	});
	
	return ActivityList;
});