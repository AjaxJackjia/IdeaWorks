define([ 
         'backbone', 'util', 'Switch', 'i18n!../../../../nls/translation',
         'css!../../../../lib/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css'
       ], 
    function(Backbone, util, Switch, i18n, boostrap_switch_css) {
	var SettingDetailNotificationView = Backbone.View.extend({
		
		className: 'setting-detail-notification-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
		},
		
		render: function(){
			var $notifications = $('<div class="notification-container well">');
			$notifications.append(Notice('project-notify', i18n.my.settings.SettingDetailNotificationView.NOTIFICATION_PROJECTS));
			$notifications.append(Notice('member-notify', i18n.my.settings.SettingDetailNotificationView.NOTIFICATION_MEMBERS));
			$notifications.append(Notice('milestone-notify', i18n.my.settings.SettingDetailNotificationView.NOTIFICATION_MILESTONES));
			$notifications.append(Notice('forum-notify', i18n.my.settings.SettingDetailNotificationView.NOTIFICATION_FORUMS));
			$notifications.append(Notice('discussion-notify', i18n.my.settings.SettingDetailNotificationView.NOTIFICATION_DISCUSSIONS));
			$notifications.append(Notice('file-notify', i18n.my.settings.SettingDetailNotificationView.NOTIFICATION_FILES));
			
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
				    url: 'api/users/' + util.currentUser() + '/notification',
				    data: self.model.get('notifications'),
				    type: 'POST',
				    success: function(result){
				    	if(result.ret == 0) {
				    		//alert(i18n.my.settings.SettingDetailNotificationView.SET_COMPLETE);
				    	}else{
				    		alert(result.msg);
				    	}
				    },
				    error: function(response) {
						var alertMsg = i18n.my.settings.SettingDetailNotificationView.SET_NOTIFICATION_ERROR;
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