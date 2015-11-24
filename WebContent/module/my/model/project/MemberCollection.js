define([ 'backbone', 'util', 'model/project/MemberModel' ], function(Backbone, util, MemberModel) {
	var MemberList = Backbone.Collection.extend({
		model: MemberModel
	});
	
	return MemberList;
});