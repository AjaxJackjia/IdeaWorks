define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var NotificationSideView = Backbone.View.extend({
		
		className: 'notification-side-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render');
		},
		
		render: function(){
			$(this.el).html(HeaderItem());
			$(this.el).append(BodyItem());
			
			var self = this;
			//向该view的父容器类添加遮罩层,并添加点击事件
			setTimeout(function() {
				$(self.el).parent().append('<div class="notification-view-cover"></div>');
				$('.notification-view-cover').click(function() {
					Backbone.trigger('TopPanelView:toggleNotification');
				});
			})
			
			//close btn 点击事件
			$('.close-btn', this.el).click(function() {
				//退出该页面动画
				$(self.el).animate({
					'width': '0px'
				}, 300, null, function() {
					Backbone.trigger('TopPanelView:toggleNotification');
					$(self.el).css('width', '300px');//reset state
				}); //300毫秒
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
			});
			$(self.el).remove();
		}
	});
	
	var HeaderItem = function() {
		var tpl =
				'<div class="heading">' +
				'	<h4 class="title">Notifications</h4> ' +
				'	<div class="close-btn btn btn-default">' +
				'		<i class="fa fa-remove"></i>' +
				'	</div>' +
				'</div>';
		return tpl;
	};
	
	var BodyItem = function() {
		var tpl =
			'<div class="msg-list">' +
			'	<div class="placeholder"><h4>This part will coming soon :) </h4></div>' +
			'</div>';
		return tpl;
	};
	
	return NotificationSideView;
});