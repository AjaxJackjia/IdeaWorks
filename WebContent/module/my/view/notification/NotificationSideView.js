define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation',
         //view
         'view/notification/NotificationItemView',
         //model
         'model/notification/NotificationCollection'
       ], 
    function(Backbone, util, i18n, NotificationItemView, NotificationCollection) {
	var NotificationSideView = Backbone.View.extend({
		
		className: 'notification-side-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'addNotificationItem', 'addLoadMoreItem', 'addPlaceHolderItem', 'loadMoreNotifications', 'updateUnreadState');
			
			//注册全局事件
			Backbone.
				off('NotificationSideView:updateUnreadState').
				on('NotificationSideView:updateUnreadState', this.updateUnreadState, this);
			
			//用户通知集合
			this.notifications = null;
			
			//进入主界面时需要拉取一次notifications未读数量
			this.updateUnreadState();
		},
		
		render: function(){
			//新建用户通知集合
			this.notifications = new NotificationCollection();
			
			$(this.el).html(HeaderItem());
			$(this.el).append(BodyItem());
			
			//向该view的父容器类添加遮罩层,并添加点击事件
			var self = this;
			setTimeout(function() {
				$(self.el).parent().append('<div class="notification-view-cover"></div>');
				$('.notification-view-cover').click(function() {
					Backbone.trigger('TopPanelView:toggleNotification');
				});
			}, 0)
			
			//close btn 点击事件
			$('.close-btn', this.el).click(function() {
				//退出该页面动画
				$(self.el).animate({
					'width': '0px'
				}, 300, null, function() {
					Backbone.trigger('TopPanelView:toggleNotification');
					$(self.el).css('width', '420px');//reset state
				}); //300毫秒
			});
			
			//拉取notification，并更新notification数量
			this.loadMoreNotifications();
			this.updateUnreadState();
			
		    return this;
		},
		
		unrender: function() {
			var self = this;
			setTimeout(function() {
				$('.notification-view-cover').animate({
					'opacity': '0'
				}, 300, null, function() {
					$('.notification-view-cover').remove();
				}); //300毫秒
			}, 0);
			$(self.el).remove();
			
			//清空notification
			var $notifications = $('.notification', this.el);
			_.each($notifications, function(item, index) {
				var cid = $(item).attr('cid');
				$('.notification[cid=' + cid + ']').remove();
			});
			this.notifications = null;
			
			//更新notification数量
			this.updateUnreadState();
		},
		
		addNotificationItem: function(notification) {
			//设置每个notification model的url
			notification.url = this.notifications.orginUrl + '/' + notification.get('notificationid');
			
			var $placeholder = $('.notifications > .placeholder');
			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			
			var notificationItemView = new NotificationItemView({
				model: notification
			});
			$('.notifications').append($(notificationItemView.render().el));
		},
		
		addLoadMoreItem: function() {
			var self = this;
			$('.notifications').append('<div class="load-more">' + i18n.my.notification.NotificationSideView.LOAD_MORE + '</div>');
			$('.notifications').find('.load-more').click(function() {
				self.loadMoreNotifications();
			});
		},
		
		addPlaceHolderItem: function() {
			$('.notifications').append('<div class="placeholder"><h4>No Notification...</h4></div>');
		},
		
		loadMoreNotifications: function() {
			//获取最新
			var self = this;
			this.notifications.fetchErrorMsg = i18n.my.notification.NotificationSideView.FETCH_NOTIFICATION_ERROR;
			this.notifications.nextPage(function() {
				var $content = $(self.el).find('.notifications');
				var $placeholder = $content.find('.placeholder');
				if($placeholder.length > 0) {
					$placeholder.remove();
				}
				var $more = $content.find('.load-more');
				if($more.length > 0) {
					$more.remove();
				}
				
				if(self.notifications.totalCount != 0 || self.notifications.models != 0) { //当有model时，加载notification
					_.each(self.notifications.models, function(notification, index) {
						self.addNotificationItem(notification);
					});
					
					//若没有完全加载则显示“加载更多按钮”
					if(!self.notifications.isLoadAll) {
						self.addLoadMoreItem();
					}
				}else{ //当没有model时，添加placeholder
					self.addPlaceHolderItem();
				}
			});
		},
		
		updateUnreadState: function() {
			$.get('/IdeaWorks/api/users/' + util.currentUser() + '/notifications/number', function(data) {
				var unreadCount = data.unRead;
				var totalCount = data.total;
				//1. 更新 top panel 未读消息数量
				$('.msg-btn').find('.unread').remove();
				if(unreadCount != 0) {
					var number = (unreadCount > 99 ? '...' : unreadCount);
					var $unread = $('<div class="unread">' + number + '</div>');
					$('.msg-btn').append($unread);
				}
				
				//2. 更新 Notification view 标题旁的未读消息数量
				if(totalCount == 0) {
					$('.heading > .title > .count', this.el).html("");
				}else{
					$('.heading > .title > .count', this.el).html("(" + unreadCount + "/" + totalCount + ")");
				}
			});
		}
	});
	
	var HeaderItem = function() {
		var tpl =
				'<div class="heading">' +
				'	<h4 class="title">' + i18n.my.notification.NotificationSideView.NOTIFICATIONS + '<span class="count"></span></h4> ' +
				'	<div class="close-btn btn btn-default" title="' + i18n.my.notification.NotificationSideView.CLOSE_NOTIFICATION + '">' +
				'		<i class="fa fa-remove"></i>' +
				'	</div>' +
				'</div>';
		return tpl;
	};
	
	var BodyItem = function() {
		var tpl = '<div class="notifications">' + NotificationItem() + '</div>';
		return tpl;
	};
	
	var NotificationItem = function() {
		return '<div class="placeholder"><h4>' + i18n.my.notification.NotificationSideView.NO_NOTIFICATIONS + '</h4></div>';
	};
	
	return NotificationSideView;
});