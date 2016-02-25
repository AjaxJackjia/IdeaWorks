define([ 
         'backbone', 'util', 'CheckLib', 'i18n!../../../../nls/translation',
         'model/chat/MessageCollection'
       ], 
    function(Backbone, util, CheckLib, i18n, MessageCollection) {
	var ChatDetailAnnouncementView = Backbone.View.extend({
		
		className: 'chat-detail-announcement-view',
		
		events: {
			'click .actions > .fa-trash': 'deleteAnnouncement'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'unrender', 'deleteAnnouncement');
			
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
				case 666: user_type_title 	= i18n.my.chat.ChatDetailAnnouncementView.IM_ANNOUNCEMENT_TO_ALL_MEMBERS;break;
				case 0: user_type_title 	= i18n.my.chat.ChatDetailAnnouncementView.IM_ANNOUNCEMENT_TO_ALL_STUDENT;break;
				case 1: user_type_title 	= i18n.my.chat.ChatDetailAnnouncementView.IM_ANNOUNCEMENT_TO_ALL_FACULTY;break;
				case 2: user_type_title 	= i18n.my.chat.ChatDetailAnnouncementView.IM_ANNOUNCEMENT_TO_ALL_INDUSTRICAL;break;
				case 3: user_type_title 	= i18n.my.chat.ChatDetailAnnouncementView.IM_ANNOUNCEMENT_TO_ALL_GOVERNMENT;break;
				case 4: user_type_title 	= i18n.my.chat.ChatDetailAnnouncementView.IM_ANNOUNCEMENT_TO_ALL_OTHERS;break;
				default: user_type_title 	= i18n.my.chat.ChatDetailAnnouncementView.IM_ANNOUNCEMENT_TO_UNKNOWN;break;
			}
			
			var $container = $('<div class="announcement-container well">');
			var header = '<div class="heading">' + 
						 '	<div class="title" title="' + this.chat.get('title') + '">[' + i18n.my.chat.ChatDetailAnnouncementView.ANNOUNCEMENT_TAG + '] ' + this.chat.get('title') + '</div>' +
						 '	<div class="meta">' + 
						 '		<img class="creator-logo" img-circle" title="' + creator.userid + '" src="' + creator.logo + '">' + 
						 '		<div class="time">' + util.timeformat(new Date(this.chat.get('createtime')), "smart")  + '</div>' + 
						 '		<div class="actions"><i class="fa fa-trash" title="' + i18n.my.chat.ChatDetailAnnouncementView.ANNOUNCEMENT_DELETE_TITLE + '"></i></div>' + 
						 '		<div class="to-user-type">' + i18n.my.chat.ChatDetailAnnouncementView.ANNOUNCEMENT_TO + ' <span class="focus">' + user_type_title + '</span></div>' + 
						 '	</div>' + 
						 '</div>';
			var content = null;
			
			this.messages.fetch({
				success: function() {
					if(self.messages.length == 0) {
						content = '<div class="content">' + i18n.my.chat.ChatDetailAnnouncementView.ANNOUNCEMENT_NO_CONTENT + '</div>';
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
		},
		
		deleteAnnouncement: function() {
			if(confirm(i18n.my.chat.ChatDetailAnnouncementView.ANNOUNCEMENT_CONFIRM_DELETE_TITLE)) {
				Backbone.trigger('ChatListView:deleteChat', this.model);
			}
		}
	});
	
	return ChatDetailAnnouncementView;
});