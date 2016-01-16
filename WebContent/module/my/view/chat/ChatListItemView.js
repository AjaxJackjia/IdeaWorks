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
		
			//展示相应type的internal message具体内容
			Backbone.trigger('ChatDetailView:showChatDetail', this.model);
		}
	});
	
	var ChatItem_template = function(chat) {
		var type = chat.get('type');
		var type_icon = (type == 'group' ? 'comments-o' : 'envelope-o');
		console.log(type);
		
		//logo view dom
		var logo_tpl =  '<div class="logo"> ' + 
						'	<i class="fa fa-' + type_icon + '"></i>' + 
						'</div>';
	
		//info view dom
		var info_tpl =  '<div class="info"> ' + 
						'	<h4 class="chat-title" title="' + chat.get('title') + '">'+ chat.get('title') +'</h4>' + 
						'	<p class="chat-modifytime">' + util.timeformat(new Date(chat.get('modifytime')), "smart") + '</p>' + 
						'</div>';
		
		return logo_tpl + info_tpl;
	};
	
	return ChatListItemView;
	
});