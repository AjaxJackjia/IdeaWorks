define([ 'backbone', 'util', 'model/chat/MemberModel' ], function(Backbone, util, MemberModel) {
	var MemberList = Backbone.Collection.extend({
		model: MemberModel,
	});
	
	return MemberList;
});