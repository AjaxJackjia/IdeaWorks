define([ 'backbone', 'util' ], function(Backbone, util) {
	var RecentActivityView = Backbone.View.extend({
		
		className: 'recent-activity-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
			
			this.render();
		},
		
		render: function(){
			//container
			var $container = $('<div class="well">');
			
			//title
			var $title = $('<h4 class="heading">Recent activities</h4>');
			
			//content
			var $content = $('<div class="activities">');
			for(var index = 0;index < 10; index++) {
				$content.append(Activity({ }));
			}
			
			
			//add to container and view
			$container.append($title);
			$container.append($content);
			$(this.el).append($container);
			
			return this;
		}
	});
	
	var Activity = function(data) {
		var tpl = 
			'<div class="activity">' + 
			'	<div class="heading">' + 
			'		<img class="img-circle" src="http://localhost:8888/IdeaWorks/res/images/my/user/darryl.png"> ' + 
			'		<div class="user">Darryl</div> ' +
			'		<div class="project"> [Test Project] </div> ' +
			'		<span class="time">2 days ago</span>' +
			'	</div>' + 
			'	<div class="content">' + 
			'		This is recent activity test message! ' + 
			'	</div>' + 
			'</div>';
		
		return tpl;
	};
	
	return RecentActivityView;
});