define([ 'backbone', 'util' ], function(Backbone, util) {
	var RecentActivityView = Backbone.View.extend({
		
		className: 'recent-activity-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'update');
			
			//监听model变化
			this.model.bind('add', this.update);
			
			this.render();
		},
		
		render: function(){
			//container
			var $container = $('<div class="well">');
			
			//title
			var $title = $('<h4 class="heading">Recent activities</h4>');
			
			//content
			var $content = $('<div class="activities">');
			$content.append('<div class="activities-placeholder"><h4>No recent activities...</h4></div>');
			
			//add to container and view
			$container.append($title);
			$container.append($content);
			$(this.el).append($container);
			
			return this;
		},
		
		update: function(activity) {
			var $activitiesContainer = $(this.el).find('.activities');
			var $placeholder = $activitiesContainer.find('.activities-placeholder');

			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			
			$activitiesContainer.append(Activity(activity));
			
		}
	});
	
	var Activity = function(activity) {
		var operator = activity.get('operator');
		var msg = activity.get('activity_action') + ' ' + activity.get('activity_entity') + ' ' + activity.get('activity_title');
		var tpl = 
			'<div class="activity">' + 
			'	<div class="heading">' + 
			'		<img class="img-circle" title="' + operator.nickname + '" src="' + util.baseUrl + operator.logo + '"> ' + 
			'		<div class="user">' + operator.nickname + '</div> ' +
			'		<div class="project"> [ ' + activity.get('porject_title') + ' ] </div> ' +
			'		<span class="time">' + util.timeformat(new Date(activity.get('activity_time')), "smart") + '</span>' +
			'	</div>' + 
			'	<div class="content">' + msg + '</div>' + 
			'</div>';
		
		return tpl;
	};
	
	return RecentActivityView;
});