define([ 'backbone', 'util' ], function(Backbone, util) {
	var PopularForumView = Backbone.View.extend({
		
		className: 'popular-forum-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
			
			this.render();
		},
		
		render: function(){
			//container
			var $container = $('<div class="well">');
			
			//title
			var $title = $('<h4 class="heading">Popular forums</h4>');
			
			//content
			var $content = $('<div class="forums">');
			for(var index = 0;index < 10; index++) {
				$content.append(Forum({ }));
			}
			
			//add to container and view
			$container.append($title);
			$container.append($content);
			$(this.el).append($container);
			
			return this;
		}
	});
	
	var Forum = function(data) {
		var tpl = 
			'<div class="forum">' + 
			'	<div class="heading">' + 
			'		<div class="forum-icon"><i class="fa fa-users"></i></div>' + 
			'		<div class="topic"> Test topic! </div> ' +
			'		<span class="time">2 days ago</span>' +
			'	</div>' + 
			'	<div class="content">' + 
			'		<div class="project"> [Test Project] </div> ' +
			'		<div class="participant">121 participants</div> ' +
			'		<div class="message">1010 messages</div> ' +
			'	</div>' + 
			'</div>';
		
		return tpl;
	};
	
	return PopularForumView;
});