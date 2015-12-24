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
			'click .refresh-topic': 'refresh',
			'click .remove-message': 'clickToDelete',
			'click .reply-message': 'clickToReply',
			'mouseenter .message-text': 'showRelativeBtn',
			'mouseleave .message-text': 'hideRelativeBtn'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addMessageItem', 'removeMessageItem', 
					'createMessage', 'deleteMessage', 'comment', 'refresh', 
					'showRelativeBtn', 'hideRelativeBtn', 'clickToDelete', 'clickToReply');
			
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
			//设定message model的url
			message.url = this.messages.url + '/' + message.get('messageid');
			
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
		removeMessageItem: function(message) {
			_.each($('.message[cid]', this.el), function(element, index, list){ 
				if($(element).attr('cid') == message.cid) {
					$(element).fadeOut();
					$(element).remove();
				}
			});
			
			//if list is empty, then add placeholder 
			if($('.message', this.el).length == 0) {
				$('.discussion-content', this.el).append('<div class="placeholder"><h4>No discussion...</h4></div>');
			}
		},
		
		/*
		 * 新建message
		 * */
		createMessage: function(message) {
			var messages = this.messages;
			messages.create(message, {
				 wait: true, 
				 success: function() {
					 //清空message box
					 $('#send_content').val("");
				 }, 
				 error: function(model, response, options) {
					 var alertMsg = 'Create comment failed. Please try again later!';
					 util.commonErrorHandler(response.responseJSON, alertMsg);
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
				error: function(model, response, options) {
					var alertMsg = 'Delete comment failed. Please try again later!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
		},
		
		/*
		 * 评论
		 * */
		comment: function() {
			var msg = $('#send_content').val();
			msg += '\n'; //强制换行，兼容删除按钮的位置
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
			messages.fetch({
				error: function(model, response, options) {
					util.commonErrorHandler(response.responseJSON, 'Fetch messages failed. Please try again later!');
				}
			});
		},
		
		/*
		 * hover显示相关按钮
		 * */
		showRelativeBtn: function(event) {
			//获取发送者信息
			var message_cid = $(event.target).closest('.message').attr('cid');
			var message = this.messages.get(message_cid);
			var message_from = message.get('from');
			
			//获取目标dom
			var $target = $(event.target).closest('.message').find('.message-text');
			var $action = $('<div class="message-action">');
			
			/*	显示删除消息按钮	*/
			//只有当信息作者时才进行删除操作
			if(message_from.userid == util.currentUser() && $target.find('.remove-message').length == 0) {
				$action.append('<div class="remove-message"><i class="fa fa-remove"></i></div>');
			}
			/*	显示回复消息按钮	*/
			$action.append('<div class="reply-message"><i class="fa fa-reply"></i></div>');
			
			/*	显示回复消息数量	*/
			if(message.get('replyCount') != 0) {
				$action.append('<div class="reply-message-count">' + message.get('replyCount') + '</div>');
			}
			
			$target.append($action);
		},
		
		/*
		 * hover隐藏相关按钮
		 * */
		hideRelativeBtn: function(event) {
			$(event.target).closest('.message').find('.message-text .message-action').remove();
		},
		
		/*
		 * delete message btn删除信息
		 * */
		clickToDelete: function(event) {
			if(confirm('Do you want to delete this discussion?')) {
				var message_cid = $(event.target).closest('.message').attr('cid');
				var message = this.messages.get(message_cid);
				this.deleteMessage(message);
			}
		},
		
		/*
		 * reply message btn回复信息
		 * */
		clickToReply: function(event) {
			//获取当前信息
			var message_cid = $(event.target).closest('.message').attr('cid');
			var message = this.messages.get(message_cid);
			
			var replyMessageSubView = new ReplyMessageSubView({
				model: message
			});
			
			var $replyView = $('#reply_message_sub_view');
			if($replyView.length > 0) {
				$('#reply_message_sub_view').remove();
			}
			$('.content-panel').append($(replyMessageSubView.render().el));
			
			//显示view
			$('#reply_message_sub_view').modal('toggle');
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
	
	/*
	 * subview - reply message sub view
	 * */
	var ReplyMessageSubView = Backbone.View.extend({
		
		id: 'reply_message_sub_view',
		
		className: 'reply-message-sub-view modal fade',
		
		events: {
			'click .reply': 'reply',
			'click .remove-message-action': 'clickToDelete',
			'click .reply-message-action': 'clickToReply'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'reply', 'addReplyItem', 'removeReplyItem', 'clickToDelete', 'clickToReply');
			
			//监听reply list变化
			this.replyList = new MessageCollection();
			this.replyList.url = this.model.url + '/replylist';//获取当前message url
			this.replyList.bind('add', this.addReplyItem);
			this.replyList.bind('remove', this.removeReplyItem);
			
			//当前正在回复的对象信息
			this.currentReplyUser = this.model.get('from');
		},
		
		render: function(){
			var message = this.model;
			
			var $modalDialog = $('<div class="modal-dialog" role="document">');
			var $modalDialogContent = $('<div class="modal-content">');
			$modalDialog.append($modalDialogContent);
			
			var header = Header();
			$modalDialogContent.append(header);
			
			var body = Body();
			$modalDialogContent.append(body);
			$('.original-message', $modalDialogContent).html(OriginalMessage(message));
			
			var footer = Footer(message);
			$modalDialogContent.append(footer);
			
			$(this.el).html($modalDialog);
			
			//绑定modal消失时出发的事件
			var self = this;
			
			//bind modal event through jquery
			$(this.el).on('show.bs.modal', function (event) {
				
			});
			
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
			//fetch reply list
			this.replyList.fetch({
				wait: true, 
				success: function() {
					//为消息父消息dom添加操作按钮
					var $actionWithReply = $('<div class="message-action"><div class="reply-message-action"><i class="fa fa-reply"></i></div></div>');
					var $originMessageTarget = $($('.message-origin', this.el)[0]).find('.message-text');
					$originMessageTarget.append($actionWithReply);
					
					//设置回复消息的数量
					if(self.replyList.length != 0) {
						$('.reply-count', self.el).html(" (total " + self.replyList.length + ") ");
					}
				},
				error: function(model, response, options) {
					var alertMsg = 'Get message reply list failed. Please try again later!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		//reply回复
		reply: function() {
			var msg = $('#reply_msg').val();
			msg += '\n'; //强制换行，兼容删除按钮的位置
			if(msg == "") {
				alert('Reply can not be emtpy!');
				return;
			}
			
			//创建新reply
			var reply = new MessageModel();
			reply.url = this.model.url.substring(0, this.model.url.lastIndexOf('\/'));//设置reply model url以适应新建消息接口
			reply.set('pmessageid', this.model.get('messageid'));
			reply.set('from', util.currentUserProfile());
			reply.set('to', this.currentReplyUser);
			reply.set('msg', msg);
			
			this.createReply(reply);
		},
		
		addReplyItem: function(reply) {
			reply.url = this.model.url.substring(0, this.model.url.lastIndexOf('\/')) + '/' + reply.get('messageid');//设置reply model url以适应删除消息接口
			
			var $placeholder = $('.reply-messages > .placeholder', this.el);
			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			
			var $replyDom = $(ReplyMessage(reply));
			$('.reply-messages', this.el).append($replyDom);
			//为reply message添加事件按钮
			this.showRelativeBtn(reply, $replyDom);
		},

		removeReplyItem: function(reply) {
			_.each($('.reply-message', this.el), function(element, index, list){ 
				if($(element).attr('cid') == reply.cid) {
					$(element).remove();
				}
			});
			
			//if list is empty, then add placeholder 
			if($('.reply-message', this.el).length == 0) {
				$('.reply-messages', this.el).append('<div class="placeholder"><h4>No reply...</h4></div>');
			}
		},
		
		/*
		 * 新建reply
		 * */
		createReply: function(reply) {
			var self = this;
			var replyList = this.replyList;
			replyList.create(reply, {
				 wait: true, 
				 success: function() {
					 //清空message box
					 $('#reply_msg').val("");
					 
					 //更新回复数量
					 self.model.set('replyCount', self.model.get('replyCount') + 1);
				 },
				 error: function(model, response, options) {
					 var alertMsg = 'Create reply failed. Please try again later!';
					 util.commonErrorHandler(response.responseJSON, alertMsg);
				 }
			});
		},
		
		/*
		 * 删除reply
		 * */
		deleteReply: function(reply) {
			var replyList = this.replyList;
			replyList.get(reply.cid).destroy({
				wait: true, 
				success: function() {
					//从list中删除reply
					replyList.remove(reply);
				},
				error: function(model, response, options) {
					var alertMsg = 'Delete comment failed. Please try again later!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
		},
		
		/*
		 * hover显示reply相关按钮
		 * */
		showRelativeBtn: function(reply, $replyDom) {
			var $actionWithDeleteAndReply = $('<div class="message-action"><div class="remove-message-action"><i class="fa fa-remove"></i></div><div class="reply-message-action"><i class="fa fa-reply"></i></div></div>');
			var $actionWithReply = $('<div class="message-action"><div class="reply-message-action"><i class="fa fa-reply"></i></div></div>');
			//获取发送者信息
			var reply_from = reply.get('from');
			//获取目标dom
			var $target = $replyDom.find('.message-text');
			
			//只有当信息作者时才进行删除操作
			if(reply_from.userid == util.currentUser()) {
				$target.append($actionWithDeleteAndReply);
			}else{
				$target.append($actionWithReply);
			}
		},
		
		/*
		 * delete reply btn删除信息
		 * */
		clickToDelete: function(event) {
			if(confirm('Do you want to delete this reply?')) {
				var reply_cid = $(event.target).closest('.reply-message').attr('cid');
				var reply = this.replyList.get(reply_cid);
					this.deleteReply(reply);
			}
		},
		
		/*
		 * reply message btn回复信息
		 * */
		clickToReply: function(event) {
			//获取当前信息
			var reply_cid = $(event.target).closest('.reply-message').attr('cid');
			var reply = this.replyList.get(reply_cid);
			if(typeof reply === "undefined") {
				reply = this.model;
			}
			
			this.currentReplyUser = reply.get('from');
			$('.reply', this.el).html('Reply to : ' + this.currentReplyUser.nickname);
		}
	});
	
	var Header = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">Reply Discussion Message</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var Footer = function(message) {
		var from = message.get('from');
		var to = message.get('to');
		
		var tpl = 
				'<div class="modal-footer"> ' + 
				'	<a type="button" class="cancel btn btn-default" data-dismiss="modal">Cancel</a> ' + 
				'	<a type="submit" class="reply btn btn-primary" to="'+ from.userid + '">Reply to : ' + from.nickname +'</a> ' + 
				'</div> ';
		return tpl;
	}
	
	var Body = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<div class="form-group"> ' + 
			'		<label class="control-label">Message:</label>' + 
			' 		<div class="original-message"></div>' + 
			'	</div> ' + 
			'	<div class="form-group"> ' + 
			'		<label for="reply_title" class="control-label">Replies: <span class="reply-count"></span></label> ' + 
			'		<div class="reply-messages"><div class="placeholder"><h4>No reply...</h4></div></div>' + 
			'	</div> ' + 
			'	<div class="reply-msg-container form-group"> ' + 
			'		<textarea class="form-control" id="reply_msg" name="reply_msg" placeholder="reply something..."></textarea> ' + 
			'	</div> ' + 
			'</div> ';
		
		return tpl;
	}
	
	var OriginalMessage = function(message) {
		var from = message.get('from');
		var to = message.get('to');
		
		var tpl = 
				'<div class="message-origin" cid="'+ message.cid +'">'+
				'	<img class="img-circle" title="' + from.nickname + '" src="' + util.baseUrl + from.logo + '">' + 
				'	<div class="message-body"> ' +
				'		<div class="message-title"> ' + 
				'			<span class="message-from">'+ from.nickname +'</span>' + 
				'			<span class="message-time">' + util.timeformat(new Date(message.get('time')), "smart") + '</span>' + 
				'		</div> ' + 
				'		<div class="message-text">'+ message.get('msg') + '</div>' + 
				'		</div>' + 
				'	</div>' +
				'</div>';
		return tpl;
	}
	
	var ReplyMessage = function(message) {
		var from = message.get('from');
		var to = message.get('to');
		
		var tpl = 
				'<div class="reply-message" cid="'+ message.cid +'">'+
				'	<img class="img-circle" title="' + from.nickname + '" src="' + util.baseUrl + from.logo + '">' + 
				'	<div class="message-body"> ' +
				'		<div class="message-title"> ' + 
				'			<span class="message-from">'+ from.nickname +' <b>reply to:</b> ' + to.nickname + '</span>' + 
				'			<span class="message-time">' + util.timeformat(new Date(message.get('time')), "smart") + '</span>' + 
				'		</div> ' + 
				'		<div class="message-text">'+ message.get('msg') + '</div>' + 
				'	</div>' +
				'</div>';
		return tpl;
	}
	
	return ProjectDetailForumTopicMessageView;
});