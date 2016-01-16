define([ 
		'backbone', 
		'util',
		//view
		'view/chat/ChatListView', 
		'view/chat/ChatDetailView',
		//model
		'model/chat/ChatCollection'
       ], function(Backbone, util, ChatListView, ChatDetailView, ChatCollection) {
	var ChatController = function() {
		console.log("This is chat controller module!");
		
		//初始化侧边栏状态
		setTimeout(function() {
			$($('.navigation > .list-unstyled > li')[2]).click();
		}, 0);
		
		//若存在search view打开，则关闭
		Backbone.trigger('TopPanelView:hideSearch');
		
		//model
		var listModel = new ChatCollection();
		listModel.fetch({
			error: function(model, response, options) {
				util.commonErrorHandler(response.responseJSON, 'Get user chatlist failed. Please try again later!');
			}
		});		
		
		//view
		var chatListView = new ChatListView({
			model: listModel
		});
		var chatDetailView = new ChatDetailView();
		
		//添加视图
		$('body > .content-panel').append($(chatListView.el));
		$('body > .content-panel').append($(chatDetailView.el));
		$('body > .content-panel').animate({scrollTop:0},0);
		
		ChatController.onRouteChange = function() {
			chatListView.remove();
			chatDetailView.remove();
		};
	};
	
	return ChatController;
});