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
			$notifications.append(Notice({
				title: 'Notifications about new projects'
			}));
			$notifications.append(Notice({
				title: 'Notifications about new activities'
			}));
			$notifications.append(Notice({
				title: 'Notifications about new forums'
			}));
			$notifications.append(Notice({
				title: 'Notifications about new members'
			}));
			
			$(this.el).append($notifications);
			//初始化bootstrap switch
			$notifications.find('.notification >.switch').bootstrapSwitch('toggleState');
			
			$notifications.find('.notification >.switch').off('switch-change').on('switch-change', function (e, data) {
			    var $el = $(data.el), value = data.value;
			    console.log(e, $el, value);
			});
			
		    return this;
		}
	});
	
	var Notice = function(data) {
		var tpl = 
			'<div class="notification">' + 
			'	<div class="switch switch-small">' + 
		    '		<input type="checkbox" />' + 
		    '	</div>' + 
			'	<div class="option truncate">' + data.title + '</div>' + 
			'</div>';

		return tpl;
	};
	
	return SettingDetailNotificationView;
});