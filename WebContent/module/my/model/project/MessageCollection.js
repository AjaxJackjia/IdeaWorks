define([ 'backbone', 'util', 'model/project/MessageModel' ], function(Backbone, util, MessageModel) {
	var MessageList = Backbone.Collection.extend({
		model: MessageModel
	});
	
	return MessageList;
});