define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation',
         'view/chat/ChatListItemView',
         'view/chat/AddChatView'
       ], 
    function(Backbone, util, i18n, ChatListItemView, AddChatView) {
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
			//设置每个project model的url
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
		createChat: function(project) {
			var projectList = this.model;
			projectList.create(project, {
				 wait: true, 
				 success: function() {	 
					 //默认选中最新创建的project item
					 $($('.project-list-content > li')[0]).click();
				 }, 
				 error: function(model, response, options) {
					var alertMsg = i18n.my.projects.ProjectListView.CREATE_PROJECT_ERROR;
					util.commonErrorHandler(response.responseJSON, alertMsg);
				 }
			});
		},
		
		//删除chat
		deleteChat: function(project) {
			var projectList = this.model;
			project.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + project.id;
			projectList.get(project.cid).destroy({
				wait: true, 
				success: function() {
					//从list中删除project
					projectList.remove(project);
				},
				error: function(model, response, options) {
					var alertMsg = i18n.my.projects.ProjectListView.DELETE_PROJECT_ERROR;
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