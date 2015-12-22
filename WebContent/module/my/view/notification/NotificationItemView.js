define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util, ProjectCollection) {
	var NotificationItemView = Backbone.View.extend({
		
		className: 'notification notification-item-view',
		
		events: {
			'click': 'markRead'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'markRead');
			
			//global variable
			this.UNREAD_FLAG = 0;
			this.READ_FLAG = 1;
			
			//数据变化时会更新
			this.model.bind('change', this.render);
		},
		
		render: function(){
			//set item cid
			$(this.el).attr('cid', this.model.cid);
			if(this.model.get('isRead') == 1) {
				$(this.el).addClass('read');
			}
			
			var item = Item(this.model);
			$(this.el).html(item);
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		markRead: function() {
			var self = this;
			if(self.model.get('isRead') == self.UNREAD_FLAG) {
				self.model.save('isRead', self.READ_FLAG, {
					success: function() {
						Backbone.trigger('NotificationSideView:updateUnreadState', self.model);
					},
					error: function(model, response, options) {
						var alertMsg = 'Mark notification read failed. Please try again later!';
						util.commonErrorHandler(response.responseJSON, alertMsg);
						//reset state
						self.model.set('isRead', self.UNREAD_FLAG);
					}
				});
			}
		}
	});
	
	var Item = function(notification) {
		var operator = notification.get('operator');
		var msg = notification.get('action') + ' ' + notification.get('entity') + ' ' + notification.get('title');
		var $tpl = 
				'<div class="timeline-icon"> ' + 
			    '	<i class="fa fa-envelope-o"></i> ' + 
			    '</div> ' + 
			    '<div class="content"> ' + 
			    '	<div class="notification-header"> ' + 
			    '		<div class="operator"> ' +
			    '			<img class="img-circle" title="' + operator.nickname + '" src="' + util.baseUrl + operator.logo + '">' +
			    '			<div class="name truncate" title="' + operator.nickname + '">' + operator.nickname + '</div>' +
			    '		</div>' + 
			    '		<div class="time">' + util.timeformat(new Date(notification.get('time')), "smart") + '</div>' + 
			    '	</div>' + 
			    '	<div class="notification-project" title="' + notification.get('projectTitle') + '"><span class="in">in project </span>' + notification.get('projectTitle') + '</div>' + 
			    '	<div class="notification-title">' + msg + '</div>' + 
			    '</div>';
		return $tpl;
	};
	
	return NotificationItemView;
});