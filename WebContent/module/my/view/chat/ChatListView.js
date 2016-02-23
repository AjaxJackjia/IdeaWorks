define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation',
         //model
         'model/chat/ChatModel',
         //view
         'view/chat/ChatListItemView',
         'view/chat/AddChatView'
       ], 
    function(Backbone, util, i18n, ChatModel, ChatListItemView, AddChatView) {
	var ChatListView = Backbone.View.extend({
		
		className: 'chat-list-view',
		
		events: {
			'click .new-chat': 'newChat'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addChatItem', 'removeChatItem', 'createChat', 'deleteChat', 'newChat');
			
			//监听model变化
			this.model.bind('add', this.addChatItem);			//add model at the top of the list(UI)
			this.model.bind('remove', this.removeChatItem);		//remove model from the list(UI)
			
			//注册全局事件
			Backbone.
				off('ChatListView:createChat').
				on('ChatListView:createChat', this.createChat, this);
			Backbone.
				off('ChatListView:deleteChat').
				on('ChatListView:deleteChat', this.deleteChat, this);
			
			this.render();
		},
		
		render: function(){
			var $newChatContent = $('<div class="chat-list-new-chat">');
			$newChatContent.append('<a type="button" class="new-chat btn btn-default"><span><i class="fa fa-plus"></i></span></a>');
			$(this.el).append($newChatContent);
			
			//chat list content
			var $listContent = $('<ul class="chat-list-content">');
			$listContent.append('<div class="empty-place-holder"><h4>No internal messages</h4></div>');
			$(this.el).append($listContent);
			
		    return this;
		},
		
		//method: 添加chat元素到list(UI)头部
		addChatItem: function(chat) {
			//设置每个model的url
			chat.url = this.model.url + '/' + chat.get('chatid');
			
			var $placeholder = $('.chat-list-content > .empty-place-holder', this.el);
			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			
			var chatItem = new ChatListItemView({
				model: chat
			});
			$('.chat-list-content', this.el).prepend($(chatItem.el));
		},
		
		//method: 从UI列表中删除chat元素
		removeChatItem: function(chat) {
			_.each($('.chat-list-content > li', this.el), function(element, index, list){ 
				if($(element).attr('cid') == chat.cid) {
					$(element).remove();
				}
			});
			
			//if list is empty, then add placeholder 
			if($('.chat-list-content > li', this.el).length == 0) {
				$('.chat-list-content', this.el).append('<div class="empty-place-holder"><h4>No internal messages</h4></div>');
			}
		},
		
		//创建新的chat
		createChat: function(chatData) {
			var projectList = this.model;
			
			//send request
			$.ajax({
			    url: 'api/users/' + util.currentUser() + '/chats',
			    data: chatData,
			    type: 'POST',
			    success: function(result){
			    	//创建新chat
			    	var chat = new ChatModel();
			    	chat.id = result.chatid;
			    	chat.set('chatid', result.chatid);
			    	chat.set('type', result.type);
			    	chat.set('title', result.title);
			    	chat.set('creator', result.creator);
			    	chat.set('createtime', result.createtime);
			    	chat.set('lastmodifytime', result.lastmodifytime);
			    	chat.set('tousertype', result.tousertype);
			    	
			    	projectList.add(chat);
			    	
			    	//默认选中第一个元素
			    	setTimeout(function() {
			    		$($('.chat-list-content > li', this.el)[0]).click();
			    	}, 100);
			    },
			    error: function(response) {
					var alertMsg = 'error!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
		},
		
		//删除chat
		deleteChat: function(chat) {
			var projectList = this.model;
			projectList.get(chat.cid).destroy({
				wait: true, 
				success: function() {
					//从list中删除chat
					projectList.remove(chat);
				},
				error: function(model, response, options) {
					var alertMsg = 'error!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
		},
		
		//点击new chat按钮事件
		newChat: function() {
			var addChatView = new AddChatView();
			
			var $subView = $('#add_chat_view');
			if($subView.length > 0) {
				$subView.remove();
			}
			$('.content-panel').append($(addChatView.render().el));
			//显示view
			$('#add_chat_view').modal('toggle');
		}
	});
	
	return ChatListView;
});