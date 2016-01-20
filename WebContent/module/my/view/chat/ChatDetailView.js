define([ 
         'backbone', 'util', 'CheckLib', 'i18n!../../../../nls/translation',
         //view
         'view/chat/ChatDetailAnnouncementView',
         'view/chat/ChatDetailGroupView'
       ], 
    function(Backbone, util, CheckLib, i18n, ChatDetailAnnouncementView, ChatDetailGroupView) {
	var ChatDetailView = Backbone.View.extend({
		
		className: 'chat-detail-view',
		
		initialize: function(){
			_.bindAll(this, 'render', 'unrender', 'chatChange');
			
			//view 全局变量
			this.initFlag = true; //标识是否为第一次render
			this.detailSubView = null; //缓存announcement或者group view
			
			//注册全局事件
			Backbone.
				off('ChatDetailView:showChatDetail').
				on('ChatDetailView:showChatDetail', this.chatChange, this);
			
			this.render();
		},
		
		render: function(){
			if(this.initFlag == true || this.model == null) {
				var $emtpy_placeholder = $('<div class="empty-place-holder"></div>');
				$emtpy_placeholder.append('<h4>No Internal Message Selected...</h4>');
				$(this.el).html($emtpy_placeholder);
				
				//reset init flag
				this.initFlag = false;
			}else{
				//remove previews view
				if(this.detailSubView != null) {
					this.detailSubView.unrender();
				}

				//render new view
				if(this.model.get('type') == 'announcement') {
					this.detailSubView = new ChatDetailAnnouncementView({
						model: this.model
					});
				}else{
					this.detailSubView = new ChatDetailGroupView({
						model: this.model
					});
				}
				$(this.el).html(this.detailSubView.render().el);
			}

			return this;
		},
		
		unrender: function() {
			var $emtpy_placeholder = $('<div class="empty-place-holder"></div>');
			$emtpy_placeholder.append('<h4>' + i18n.my.projects.ProjectDetailView.NO_PROJECT_SELECT + '</h4>');
			$(this.el).html($emtpy_placeholder);
		},
		
		chatChange: function(chat) {
			this.model = chat;
			
			//监听model变化
			this.model.bind('change', this.render);	
			this.model.bind('destroy', this.unrender);
			
			this.render();
		}
	});
	
	return ChatDetailView;
});