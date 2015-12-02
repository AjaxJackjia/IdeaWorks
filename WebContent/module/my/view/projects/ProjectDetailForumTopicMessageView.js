define([ 
         'backbone', 'util',
         //model
  		 'model/project/MessageCollection',
  		 'model/project/MessageModel',
       ], 
    function(Backbone, util, MessageCollection, MessageModel) {
	var ProjectDetailForumTopicMessageView = Backbone.View.extend({
		
		className: 'discussion-container well project-detail-forum-topic-message-view',
		
		events: {
			'click .send': 'comment',
			'click .refresh-topic': 'refresh'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addMessageItem', 'removeMessageItem', 'createMessage', 'deleteMessage', 'comment', 'refresh');
			
			//topic message collection
			this.messages = new MessageCollection();
			this.messages.url = this.model.url + '/messages';
			//监听model变化
			this.messages.bind('add', this.addMessageItem);
			this.messages.bind('remove', this.removeMessageItem);
			
			//初始化scrollY (discussion view的scrollY)
			if($.cookie('scrollY_discussion') == null) {
				$.cookie('scrollY_discussion', 0);
			}
			
			this.render();
		},
		
		render: function(){
			var header = '<h4 class="heading">' + 
						 '	<span>Discussion</span>' +
						 '	<div class="message-action">' + 
						 '		<a class="refresh-topic btn btn-default" title="refresh latest messages"> ' + 
						 '			<i class="fa fa-refresh"></i>' +
						 '		</a>' + 
						 '	</div>' +
						 '</h4>';
			var content = 
						'<div class="discussion-content">' + 
					    '	<div class="placeholder">' +
					    '		<h4>No discussion...</h4>' + 
					    '	</div>' + 
					    '</div>';
			var sendbox = 
						'<div class="discussion-sender">' + 
						'	<textarea class="form-control" id="send_content" placeholder="Say something..."></textarea>' +
						'	<div class="send-action"> ' + 
						'		<a class="send btn btn-primary">Comment</a> ' + 
						'	</div> ';
						'</div>';
			$(this.el).html(header);
			$(this.el).append(content);
			$(this.el).append(sendbox);
			
			//fetch messages
			this.messages.fetch();
			
		    return this;
		},
		
		/*
		 * 向topic message集合中添加message
		 * */
		addMessageItem: function(message) {
			var $discussionContent = $(this.el).find('.discussion-content');
			var $placeholder = $discussionContent.find('.placeholder');
			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			$discussionContent.append(MessageItem(message));
			
			//保持scrollY在最下
			var scrollHeight = $('.discussion-content')[0].scrollHeight;
			$('.discussion-content').scrollTop( scrollHeight );
		},
		
		/*
		 * 从topic message集合中删除message
		 * */
		removeMessageItem: function(topic) {
			_.each($('.message[cid]', this.el), function(element, index, list){ 
				if($(element).attr('cid') == milestone.cid) {
					$(element).fadeOut();
					$(element).remove();
				}
			});
		},
		
		/*
		 * 新建message
		 * */
		createMessage: function(message) {
			var messages = this.messages;
			messages.create(message, {
				 wait: true, 
				 success: function() {
					 //添加message到message list
					 messages.add(message);
					 
					 //清空message box
					 $('#send_content').val("");
				 }, 
				 error: function() {
					 alert('Create comment failed. Please try again later!');
				 }
			});
		},
		
		/*
		 * 删除message
		 * */
		deleteMessage: function(message) {
			var messages = this.messages;
			messages.get(message.cid).destroy({
				wait: true, 
				success: function() {
					//从list中删除message
					messages.remove(message);
				},
				error: function() {
					alert('Delete comment failed. Please try again later!');
				}
			});
		},
		
		/*
		 * 评论
		 * */
		comment: function() {
			var msg = $('#send_content').val();
			if(msg == "") {
				alert('Message can not be emtpy!');
				return;
			}
			
			//创建message model
			var message = new MessageModel();
			message.set('from', util.currentUserProfile());
			message.set('to', "");
			message.set('msg', msg);
			
			this.createMessage(message);
		},
		
		/*
		 * 刷新最新信息
		 * */
		refresh: function() {
			var messages = this.messages;
			//清空信息
			$('.discussion-content', this.el).html('');
			messages.reset();
			//重新拉取信息
			messages.fetch();
		}
	});
	
	/*
	 * view component html template - message view
	 * */
	var MessageItem = function(message) {
		var from = message.get('from');
		var to = message.get('to');
		
		var tpl = '';
		if(from.userid == util.currentUser()) {
			tpl = '<div class="message self" cid="'+ message.cid +'">';
		}else{
			tpl = '<div class="message other" cid="'+ message.cid +'">';
		}
		tpl += 
			'	<img class="img-circle" title="' + from.nickname + '" src="' + util.baseUrl + from.logo + '">' + 
			'	<div class="message-body"> ' +
			'		<div class="message-title"> ' + 
			'			<span class="message-from">'+ from.nickname +'</span>' + 
			'			<span class="message-time">' + util.timeformat(new Date(message.get('time')), "smart") + '</span>' + 
			'		</div> ' + 
			'		<div class="message-text">'+ message.get('msg') +'</div>' + 
			'	</div>' +
			'</div>';
		
		return tpl;
	};
	
	return ProjectDetailForumTopicMessageView;
});