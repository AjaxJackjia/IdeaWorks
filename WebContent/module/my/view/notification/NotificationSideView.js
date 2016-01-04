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
			_.bindAll(this, 'render', 'unrender', 'addNotificationItem', 'updateUnreadState', 'fetchLatestNotifications', 'setupFetchInterval', 'clearFetchInterval');
			
			//注册全局事件
			Backbone.
				off('NotificationSideView:updateUnreadState').
				on('NotificationSideView:updateUnreadState', this.updateUnreadState, this);
			
			//用户通知集合
			this.notifications = new NotificationCollection();
			
			//进入主界面时需要拉取一次notifications, 拉取成功之后设置定时器
			var self = this;
			self.fetchLatestNotifications(function() {
				//设置定时器
				self.setupFetchInterval();
			});
		},
		
		render: function(){
			$(this.el).html(HeaderItem());
			$(this.el).append(BodyItem());
			
			//向该view的父容器类添加遮罩层,并添加点击事件
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
			
			//取消拉取notification定时器, 并且拉取最新一次来渲染notifications view
			var self = this;
			self.clearFetchInterval();
			self.fetchLatestNotifications(function() {
				_.each(self.notifications.models, function(notification, index) {
					self.addNotificationItem(notification);
				});
				//更新数量
				self.updateUnreadState();
			});
			
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
			
			//清空notification,并同时恢复notification定时器
			var $notifications = $('.notification', this.el);
			_.each($notifications, function(item, index) {
				var cid = $(item).attr('cid');
				$('.notification[cid=' + cid + ']').remove();
			});
			this.setupFetchInterval();
		},
		
		addNotificationItem: function(notification) {
			//设置每个notification model的url
			notification.url = this.notifications.url + '/' + notification.get('notificationid');
			
			var $placeholder = $('.notifications > .placeholder');
			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			
			var notificationItemView = new NotificationItemView({
				model: notification
			});
			$('.notifications').append($(notificationItemView.render().el));
		},
		
		updateUnreadState: function() {
			var unreadCount = this.notifications.where({'isRead': 0}).length;
			var totalCount = this.notifications.length;
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
		},
		
		//拉取最新notifications, callback为拉取成功之后的回调函数
		fetchLatestNotifications: function(callback) {
			//清空collection
			this.notifications.reset();
			
			//获取最新
			var self = this;
			this.notifications.fetch({
				success: function() {
					if(typeof callback != null && typeof callback == 'function') {
						callback();
					}
					self.updateUnreadState();
				},
				error: function(model, response, options) {
					util.commonErrorHandler(response.responseJSON, i18n.my.notification.NotificationSideView.FETCH_NOTIFICATION_ERROR);
				}
			});
		},
		
		//设置定时拉取
		setupFetchInterval: function() {
			var self = this;
			var timeInterval = 60 * 1000; //拉取频率为1min 1次
			this.notificationInterval = setInterval(function() {
				self.fetchLatestNotifications();
			}, timeInterval);
		},
		
		//取消定时拉取
		clearFetchInterval: function() {
			window.clearInterval(this.notificationInterval);
		}
	});
	
	var HeaderItem = function() {
		console.log(i18n.my.notification);
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