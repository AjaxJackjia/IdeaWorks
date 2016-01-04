define([ 'backbone', 'util', 'i18n!../../../../nls/translation' ], function(Backbone, util, i18n) {
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
			var $title = $('<h4 class="heading">' + i18n.my.dashboard.RecentActivityView.RECENT_ACTIVITIES + '</h4>');
			
			//content
			var $content = $('<div class="activities">');
			$content.append('<div class="activities-placeholder"><h4>' + i18n.my.dashboard.RecentActivityView.NO_ACTIVITIES + '</h4></div>');
			
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
		var tpl = 
			'<div class="activity">' + 
			'	<div class="heading">' + 
			'		<img class="img-circle" title="' + operator.nickname + '" src="' + operator.logo + '"> ' + 
			'		<div class="user">' + operator.nickname + '</div> ' +
			'		<div class="project"> [ ' + activity.get('porject_title') + ' ] </div> ' +
			'		<span class="time">' + util.timeformat(new Date(activity.get('time')), "smart") + '</span>' +
			'	</div>' + 
			'	<div class="content">' + activity.get('title') + '</div>' + 
			'</div>';
		
		return tpl;
	};
	
	return RecentActivityView;
});