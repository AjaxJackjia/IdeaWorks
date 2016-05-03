define([ 'backbone', 'util', 'model/chat/MemberModel' ], function(Backbone, util, MemberModel) {
	var MemberList = Backbone.Collection.extend({
		model: MemberModel,
		
		url: '/IdeaWorks/api/users'
	});
	
	return MemberList;
});