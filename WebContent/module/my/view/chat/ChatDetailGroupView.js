define([ 
         'backbone', 'util', 'CheckLib', 'i18n!../../../../nls/translation',
         'model/chat/MessageCollection', 
         'view/chat/ChatDetailGroupMembersView'
       ], 
    function(Backbone, util, CheckLib, i18n, MessageCollection, ChatDetailGroupMembersView) {
	var ChatDetailGroupView = Backbone.View.extend({
		
		className: 'chat-detail-group-view',

		events: {
			'click .expand-icon': 'toggleMembers'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'unrender', 'toggleMembers');
			
			//chat
			this.chat = this.model;
			//chat messages
			this.messages = new MessageCollection();
			this.messages.url = this.model.url + '/messages';
			//chat members
			this.membersview = new ChatDetailGroupMembersView({
				model: this.chat
			});
		},
		
		render: function(){
			var $container = $('<div class="chat-container well">');
			$container.append(this.generateGroupHeader());
			$container.append(this.generateGroupContent());
			$container.append(this.generateSendbox());
			
			$(this.el).html($container);
			
			return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		toggleMembers: function() {
			var $angle = $('.expand-icon > i', this.el);
			if($angle.hasClass('fa-angle-down')) 
			{
				$angle.removeClass('fa-angle-down');
				$angle.addClass('fa-angle-up');
				
				this.membersview.show();
			}else if($angle.hasClass('fa-angle-up')) 
			{
				$angle.removeClass('fa-angle-up');
				$angle.addClass('fa-angle-down');
				
				this.membersview.hide();
			}
		},
		
		//render sub view
		generateGroupHeader: function() {
			var $header = $('<div class="heading">');
			
			var $title = $('<div class="title">');
			$title.attr('title', this.chat.get('title'));
			$title.html(this.chat.get('title'));
			
			var $angledown = $('<div class="expand-icon" title="show internal messages members">');
			$angledown.append('<i class="fa fa-angle-down"></i>');
			
			$header.append($title);
			$header.append($angledown);
			
			return $header;
		},
		
		generateGroupContent: function() {
			var self = this;
			var $content = $('<div class="content">');
			
			this.messages.fetch({
				success: function() {
					if(self.messages.length == 0) {
						$content.html('No content...');
					}else{
						_.each(self.messages.models, function(msg, index) {
							$content.append(self.generateMsg(msg));
						});
					}
				},
				error: function(model, response, options) {
					util.commonErrorHandler(response.responseJSON, 'Get internal messages failed. Please try again later!');
				}
			});
			
			return $content;
		},
		
		generateSendbox: function() {
			var $sender = 	'<div class="sender">' + 
							'	<textarea class="form-control" id="send_content" placeholder="Say something..."></textarea>' +
							'	<div class="send-action"> ' + 
							'		<a class="send btn btn-primary">Comment</a> ' + 
							'	</div> ' + 
							'</div>';
			
			return $sender;
		},
		
		generateMsg: function(message) {
			var creator = message.get('creator');
			
			var tpl = '';
			if(creator.userid == util.currentUser()) {
				tpl = '<div class="message self" cid="'+ message.cid +'">';
			}else{
				tpl = '<div class="message other" cid="'+ message.cid +'">';
			}
			tpl += 
				'	<img class="img-circle" title="' + creator.nickname + '" src="' + creator.logo + '">' + 
				'	<div class="message-body"> ' +
				'		<div class="message-title"> ' + 
				'			<span class="message-from">'+ creator.nickname +'</span>' + 
				'			<span class="message-time">' + util.timeformat(new Date(message.get('time')), "smart") + '</span>' + 
				'		</div> ' + 
				'		<div class="message-text">'+ message.get('msg') +'</div>' + 
				'	</div>' +
				'</div>';
			
			return tpl;
		}
	});
	
	return ChatDetailGroupView;
});