define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation'
       ], 
    function(Backbone, util, i18n) {
	var ChatListItemView = Backbone.View.extend({
		
		tagName: 'li',
		
		className: 'chat-list-item-view',
		
		events: {
			'click': 'select'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'unrender', 'select');
			
			//监听model变化
			this.model.bind('change', this.render);	
			this.model.bind('destroy', this.unrender);
			
			this.render();
		},
		
		render: function(){
			var chat = this.model;
			
			//cid
			$(this.el).attr('cid', this.model.cid);
			
			//根据模板生成dom
			var chatItem_template = ChatItem_template(chat);
			$(this.el).html(chatItem_template);
			
		    return this;
		},
		
		unrender: function(){
			$(this.el).remove();
		},
		
		select: function() {
			$('li.chat-list-item-view').removeClass('active');
			$(this.el).addClass('active');
		
			//未读消息标记为已读
			this.model.set('unread', 0);
			
			//展示相应type的internal message具体内容
			Backbone.trigger('ChatDetailView:showChatDetail', this.model);
		}
	});
	
	var ChatItem_template = function(chat) {
		var type = chat.get('type');
		var type_icon = (type == 'group' ? 'comments-o' : 'envelope-o');
		var type_title = (type == 'group' ? i18n.my.chat.ChatListItemView.IM_TITLE : i18n.my.chat.ChatListItemView.ANNOUNCEMENT_TITLE);
		var unread = chat.get('unread');
		
		//logo view dom
		var logo_tpl =  '<div class="logo" title="' + type_title + '"> ' + 
						'	<i class="fa fa-' + type_icon + '"></i>' + 
						'</div>';
	
		//info view dom
		var info_tpl =  '<div class="info"> ' + 
						'	<h4 class="chat-title" title="' + chat.get('title') + '">'+ chat.get('title') +'</h4>' + 
						'	<p class="chat-lastmodifytime">' + util.timeformat(new Date(chat.get('lastmodifytime')), "smart") + '</p>' + 
						'</div>';
		
		var final_tpl = logo_tpl + info_tpl;
		if(unread > 0) {
			//unread view dom
			var unread_tpl = '<div class="unread"> ' + 
							 '	<span class="badge">' + unread + '</span>' + 
							 '</div>';
			final_tpl += unread_tpl;
		}
		
		return final_tpl;
	};
	
	return ChatListItemView;
	
});