define([ 
         'backbone', 'util', 'i18n!../../../nls/translation',
         //view
         'view/search/SearchMainView',
         'view/notification/NotificationSideView',
         //css
         'css!../../../res/css/my/search.css',
         'css!../../../res/css/my/notification.css'
       ], 
    function(Backbone, util, i18n,
    		//view
    		SearchMainView, NotificationSideView,
    		//css
    		search_css, notification_css ) {
	var TopPanelView = Backbone.View.extend({
		
		className: 'top-panel',
		
		events: {
			'click .search-input > input': 'showSearchView',
			'click .search-btn': 'toggleSearch',
			'click .msg-btn': 'toggleNotification',
			'click .signout-btn': 'logout'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 
					'toggleSearch', 'showSearchView', 'hideSearchView', 
					'toggleNotification', 'logout');
			
			//global params
			this.searchView = new SearchMainView();
			this.notificationView = new NotificationSideView();
			
			//注册全局事件
			Backbone.
				off('TopPanelView:hideSearch').
				on('TopPanelView:hideSearch', this.hideSearchView, this);
			Backbone.
				off('TopPanelView:toggleNotification').
				on('TopPanelView:toggleNotification', this.toggleNotification, this);
		},
		
		render: function(){
			$(this.el).append(SearchItem());
			$(this.el).append(ToolBoxItem());
			
			return this;
		},
		
		/*
		 * search view related event
		 * */
		toggleSearch: function() {
			var status = $('.search-btn > .fa-search').length != 0 ? 'show': 'hide';
			if(status == 'show') {
				this.showSearchView();
			}else{
				this.hideSearchView();
			}
		},
		
		showSearchView: function() {
			//change search button state
			$('.search-btn > .fa').removeClass('fa-search').addClass('fa-remove');
			$('.search-btn').addClass('active');
			$('.search-input > input').focus();
			
			if($('.search-main-view').length == 0) {
				$(this.searchView.render().el).addClass('show');
				$('.content-panel').append($(this.searchView.el));
			}
		},
		
		hideSearchView: function() {
			//change search button state
			$('.search-btn > .fa').removeClass('fa-remove').addClass('fa-search');
			$('.search-btn').removeClass('active');
			$('.search-input > input').val('');
			
			if($('.search-main-view').length != 0) {
				this.searchView.unrender();
			}
		},
		
		/*
		 * notification view related event
		 * */
		toggleNotification: function() {
			if($('.notification-side-view').length == 0) {
				$(this.notificationView.render().el).addClass('side-show');
				$('.content-panel').append($(this.notificationView.el));
			}else{
				this.notificationView.unrender();
			}
		},
		
		logout: function() {
			if(confirm(i18n.my.TopPanelView.LOGOUT_CONFIRM)) {
				util.logout();
			}
		}
	});
	
	/*
	 * search
	 * */
	var SearchItem = function() {
		var tpl = 
				'<div class="search-box"> ' + 
				'	<div class="search-btn btn btn-default" title="' + i18n.my.TopPanelView.SEARCH_TITLE + '">' +
				'		<i class="fa fa-search"></i>' +
				'	</div>' + 
				'	<div class="search-input input-group">' +
				'		<input class="form-control" type="text" placeholder="' + i18n.my.TopPanelView.SEARCH_INPUT_TITLE + '">' +
				'	</div>' + 
				'</div>';
		return tpl;
	};
	
	/*
	 * tool
	 * */
	var ToolBoxItem = function() {
		var tpl = 
				'<div class="tool-box">' +
				'	<div class="signout-btn btn btn-default" title="' + i18n.my.TopPanelView.LOGOUT_TITLE + '">' +
				'		<i class="fa fa-sign-out"></i>' +
				'	</div>' + 
				'	<div class="msg-btn btn btn-default" title="' + i18n.my.TopPanelView.NOTIFICATION_TITLE + '">' +
				'		<i class="fa fa-bell-o"></i>' +
				'	</div>' +
				'</div>';
		return tpl;
	};
	
	return TopPanelView;
});