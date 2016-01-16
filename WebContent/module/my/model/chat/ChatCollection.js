define([ 'backbone', 'util', 'model/chat/ChatModel' ], function(Backbone, util, ChatModel) {
	var ChatList = Backbone.Collection.extend({
		url: '/IdeaWorks/api/users/' + util.currentUser() + '/chat/chatlist',
		
		model: ChatModel
	});
	
	return ChatList;
});