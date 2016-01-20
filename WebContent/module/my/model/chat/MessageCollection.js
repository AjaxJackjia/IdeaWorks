define([ 'backbone', 'util', 'model/chat/MessageModel' ], function(Backbone, util, MessageModel) {
	var MessageList = Backbone.Collection.extend({
		model: MessageModel
	});
	
	return MessageList;
});