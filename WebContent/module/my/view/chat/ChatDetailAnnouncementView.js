define([ 
         'backbone', 'util', 'CheckLib', 'i18n!../../../../nls/translation',
         'model/chat/MessageCollection'
       ], 
    function(Backbone, util, CheckLib, i18n, MessageCollection) {
	var ChatDetailAnnouncementView = Backbone.View.extend({
		
		className: 'chat-detail-announcement-view',
		
		initialize: function(){
			_.bindAll(this, 'render', 'unrender');
			
			//chat
			this.chat = this.model;
			//chat messages
			this.messages = new MessageCollection();
			this.messages.url = this.model.url + '/messages';
		},
		
		render: function(){
			var self = this;
			var creator = this.chat.get('creator');
			var user_type_title = '';
			switch(this.chat.get('tousertype')) {
				case 0: user_type_title = 'Student';break;
				case 1: user_type_title = 'Faculty';break;
				case 2: user_type_title = 'Industrical Participant';break;
				case 3: user_type_title = 'Government';break;
				case 4: user_type_title = 'Others';break;
				default: user_type_title = 'Unknown';break;
			}
			
			var $container = $('<div class="announcement-container well">');
			var header = '<div class="heading">' + 
						 '	<div class="title" title="' + this.chat.get('title') + '">[Announcement] ' + this.chat.get('title') + '</div>' +
						 '	<div class="meta">' + 
						 '		<img class="creator-logo" img-circle" title="' + creator.userid + '" src="' + creator.logo + '">' + 
						 '		<div class="time">' + util.timeformat(new Date(this.chat.get('createtime')), "smart")  + '</div>' + 
						 '		<div class="to-user-type">To all <span class="focus">' + user_type_title + '</span></div>' + 
						 '	</div>' + 
						 '</div>';
			var content = null;
			
			this.messages.fetch({
				success: function() {
					if(self.messages.length == 0) {
						content = '<div class="content">No content...</div>';
					}else{
						_.each(self.messages.models, function(msg, index) {
							content = '<div class="content">' + msg.get('msg') + '</div>';
						});
					}
					
					$container.append(header);
					$container.append(content);
				},
				error: function(model, response, options) {
					util.commonErrorHandler(response.responseJSON, 'Get user chat messages failed. Please try again later!');
				}
			});		
			
			$(this.el).html($container);
			
			return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		}
	});
	
	return ChatDetailAnnouncementView;
});