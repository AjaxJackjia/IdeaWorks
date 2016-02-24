define([ 
         'backbone', 'util', 'CheckLib', 'i18n!../../../../nls/translation',
         'model/chat/MessageModel', 
         'model/chat/MessageCollection', 
         'view/chat/ChatDetailGroupMembersView'
       ], 
    function(Backbone, util, CheckLib, i18n, MessageModel, MessageCollection, ChatDetailGroupMembersView) {
	var ChatDetailGroupView = Backbone.View.extend({
		
		className: 'chat-detail-group-view',

		events: {
			'click .expand-icon': 'toggleMembers',
			'click .chat-container .send': 'comment',
			'click .actions > .fa-sign-out': 'deleteGroup'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'unrender', 'toggleMembers', 'comment', 'deleteGroup', 'addMsgItem', 'removeMsgItem');
			
			//chat
			this.chat = this.model;
			//chat messages
			this.messages = new MessageCollection();
			this.messages.url = this.model.url + '/messages';
			//监听model变化
			this.messages.bind('add', this.addMsgItem);			
			this.messages.bind('remove', this.removeMsgItem);	
			
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
			
			//拉取消息
			var self = this;
			this.messages.fetch({
				success: function() {
					if(self.messages.length == 0) {
						$content.html('No content...');
					}
				},
				error: function(model, response, options) {
					util.commonErrorHandler(response.responseJSON, 'Get internal messages failed. Please try again later!');
				}
			});
			
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
		
		//method: 添加msg元素到content中
		addMsgItem: function(msg) {
			msg.url = this.model.url + '/' + msg.get('msgid');
			
			var msgItem = this.generateMsg(msg)
			$('.chat-container > .content', this.el).append(msgItem);
			
			//scroll to bottom
			$('.chat-container > .content').scrollTop( $('.chat-container > .content')[0].scrollHeight );
		},
		
		//method: 从content中删除msg元素
		removeMsgItem: function(msg) {
			_.each($('..chat-container > .content > .message', this.el), function(element, index, list){ 
				if($(element).attr('cid') == chat.cid) {
					$(element).remove();
				}
			});
		},
		
		//评论
		comment: function() {
			//check param
			if($('#send_content', this.el).val() == '') {
				alert('Please input your message content...');
				return;
			}
			
			var msgModel = new MessageModel();
			msgModel.set('chatid', this.chat.get('chatid'));
			msgModel.set('msg', $('#send_content', this.el).val());
			
			this.messages.create(msgModel, {
				 wait: true, 
				 error: function(model, response, options) {
					var alertMsg = i18n.my.projects.ProjectListView.CREATE_PROJECT_ERROR;
					util.commonErrorHandler(response.responseJSON, alertMsg);
				 }
			});
			
			//清空content输入框
			$('#send_content', this.el).val('');
		},
		
		//删除chat
		deleteGroup: function() {
			if(confirm('Do you want to exit this internal message group?')) {
				Backbone.trigger('ChatListView:deleteChat', this.model);
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
			
			var $actions = $('<div class="actions">');
			$actions.append('<i class="fa fa-sign-out" title="exit this group"></i>');
			
			$header.append($title);
			$header.append($angledown);
			$header.append($actions);
			
			return $header;
		},
		
		generateGroupContent: function() {
			var $content = $('<div class="content">');
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
			var msg = '';
			if(message.get('msg') == 'DEFAULT_CREATE_CHAT_MSG') {
				msg = '创建了该消息群组';
			}else if(message.get('msg') == 'DEFAULT_EXIT_CHAT_MSG') {
				msg = '退出了该消息群组';
			}else{
				msg = message.get('msg');
			}
			
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
				'		<div class="message-text">'+ msg +'</div>' + 
				'	</div>' +
				'</div>';
			
			return tpl;
		}
	});
	
	return ChatDetailGroupView;
});