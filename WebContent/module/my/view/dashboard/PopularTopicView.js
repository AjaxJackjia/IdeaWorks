define([ 'backbone', 'util' ], function(Backbone, util) {
	var PopularTopicView = Backbone.View.extend({
		
		className: 'popular-topic-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'update');
			
			//监听model变化
			this.model.bind('add', this.update);
			
			this.render();
		},
		
		render: function() {
			//container
			var $container = $('<div class="well">');
			//title
			var $title = $('<h4 class="heading">Popular topics</h4>');
			
			//content
			var $content = $('<div class="topics">');
			$content.append('<div class="topics-placeholder"><h4>No popular topics...</h4></div>');
			
			//add to container and view
			$container.append($title);
			$container.append($content);
			$(this.el).append($container);
			
			return this;
		},
		
		update: function(topic) {
			var $topicsContainer = $(this.el).find('.topics');
			var $placeholder = $topicsContainer.find('.topics-placeholder');
			
			if($placeholder.length > 0) { //initialize
				$placeholder.remove();
				
				$topicsContainer.append(Topic(topic));
			}else{ //load more action
				$topicsContainer.append(Topic(topic));
			}
		}
	});
	
	var Topic = function(topic) {
		var tpl = 
			'<div class="topic">' + 
			'	<div class="heading">' + 
			'		<div class="topic-icon"><i class="fa fa-users"></i></div>' + 
			'		<div class="topic-title"> ' + topic.get('title') + ' </div> ' +
			'		<span class="time">2 days ago</span>' +
			'	</div>' + 
			'	<div class="content">' + 
			'		<div class="project"> [ project id: ' + topic.get('projectid') + '] </div> ' +
			'		<div class="participant">' + topic.get('participantNo') + ' participants</div> ' +
			'		<div class="message">' + topic.get('messageNo') + ' messages</div> ' +
			'	</div>' + 
			'</div>';
		
		return tpl;
	};
	
	return PopularTopicView;
});