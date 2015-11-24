define([ 'backbone', 'util', 'model/project/MilestoneModel' ], function(Backbone, util, MilestoneModel) {
	var MilestoneList = Backbone.Collection.extend({
		model: MilestoneModel
	});
	
	return MilestoneList;
});