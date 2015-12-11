define([ 
         'backbone', 'util', 'Switch', 
         'css!../../../../lib/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css'
       ], 
    function(Backbone, util, Switch, boostrap_switch_css) {
	var SettingDetailNotificationView = Backbone.View.extend({
		
		className: 'setting-detail-notification-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
		},
		
		render: function(){
			var $notifications = $('<div class="notification-container well">');
			$notifications.append(Notice('project-notify', 'Notifications about projects'));
			$notifications.append(Notice('member-notify', 'Notifications about members'));
			$notifications.append(Notice('milestone-notify', 'Notifications about milestones'));
			$notifications.append(Notice('forum-notify', 'Notifications about forums'));
			$notifications.append(Notice('discussion-notify', 'Notifications about forum discussions'));
			$notifications.append(Notice('file-notify', 'Notifications about files'));
			
			$(this.el).append($notifications);
			
			//初始化bootstrap switch
			$notifications.find('.notification input').bootstrapSwitch();
			$notifications.find('.notification .bootstrap-switch').addClass('switch bootstrap-switch-mini');
			
			$('.project-notify .bootstrap-switch input', this.el).bootstrapSwitch('state', this.model.get('notifications').project);
			$('.member-notify .bootstrap-switch input', this.el).bootstrapSwitch('state', this.model.get('notifications').member);
			$('.milestone-notify .bootstrap-switch input', this.el).bootstrapSwitch('state', this.model.get('notifications').milestone);
			$('.forum-notify .bootstrap-switch input', this.el).bootstrapSwitch('state', this.model.get('notifications').forum);
			$('.discussion-notify .bootstrap-switch input', this.el).bootstrapSwitch('state', this.model.get('notifications').discussion);
			$('.file-notify .bootstrap-switch input', this.el).bootstrapSwitch('state', this.model.get('notifications').file);
			
			//switch change event
			var self = this;
			$('.bootstrap-switch input', this.el).on('switchChange.bootstrapSwitch', function() {
				//设置状态
				self.model.get('notifications').project = $('.project-notify .bootstrap-switch input', this.el).bootstrapSwitch('state');
				self.model.get('notifications').member = $('.member-notify .bootstrap-switch input', this.el).bootstrapSwitch('state');
				self.model.get('notifications').milestone = $('.milestone-notify .bootstrap-switch input', this.el).bootstrapSwitch('state');
				self.model.get('notifications').forum = $('.forum-notify .bootstrap-switch input', this.el).bootstrapSwitch('state');
				self.model.get('notifications').discussion = $('.discussion-notify .bootstrap-switch input', this.el).bootstrapSwitch('state');
				self.model.get('notifications').file = $('.file-notify .bootstrap-switch input', this.el).bootstrapSwitch('state');
				
				$.ajax({
				    url: util.baseUrl + '/api/users/' + util.currentUser() + '/notifications',
				    data: self.model.get('notifications'),
				    type: 'POST',
				    success: function(result){
				    	if(result.ret == 0) {
				    		alert("Set complete!");
				    	}else{
				    		alert(result.msg);
				    	}
				    },
				    error: function(response) {
						var alertMsg = 'Set notification failed. Please try again later!';
						util.commonErrorHandler(response.responseJSON, alertMsg);
					}
				});
			});
			
		    return this;
		}
	});
	
	var Notice = function(className, title) {
		var tpl = 
			'<div class="'+ className +' notification">' + 
		    '	<input type="checkbox" />' + 
			'	<div class="option truncate">' + title + '</div>' + 
			'</div>';

		return tpl;
	};
	
	return SettingDetailNotificationView;
});