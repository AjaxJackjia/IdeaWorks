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
		var tpl = 
			'<div class="activity">' + 
			'	<div class="heading">' + 
			'		<img class="img-circle" src="http://localhost:8888/IdeaWorks/res/images/my/user/darryl.png"> ' + 
			'		<div class="user">' + activity.get('operator') + '</div> ' +
			'		<div class="project"> [ project id: ' + activity.get('projectId') + '] </div> ' +
			'		<span class="time">2 days ago</span>' +
			'	</div>' + 
			'	<div class="content">' + activity.get('title') + '</div>' + 
			'</div>';
		
		return tpl;
	};
	
	return RecentActivityView;
});