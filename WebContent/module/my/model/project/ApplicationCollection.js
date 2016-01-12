define([ 'backbone', 'util', 'model/project/ApplicationModel' ], function(Backbone, util, ApplicationModel) {
	var ApplicationList = Backbone.Collection.extend({
		model: ApplicationModel
	});
	
	return ApplicationList;
});