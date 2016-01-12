define([ 'backbone', 'util', 'i18n!../../../../nls/translation' ], function(Backbone, util, i18n) {
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
			var $title = $('<h4 class="heading">' + i18n.my.dashboard.PopularTopicView.POPULAR_TOPICS + '</h4>');
			
			//content
			var $content = $('<div class="topics">');
			$content.append('<div class="topics-placeholder"><h4>' + i18n.my.dashboard.PopularTopicView.NO_TOPICS + '</h4></div>');
			
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
		var message = '';
		if(topic.get('msg_count') > 1) 
		{
			message = topic.get('msg_count') + i18n.my.dashboard.PopularTopicView.MSGS;
		}
		else
		{
			message = topic.get('msg_count') + i18n.my.dashboard.PopularTopicView.MSG;
		}
		
		var tpl = 
			'<div class="topic">' + 
			'	<div class="heading">' + 
			'		<div class="topic-icon"><i class="fa fa-users"></i></div>' + 
			'		<div class="topic-title" title="' + topic.get('topic_title') + '"> ' + topic.get('topic_title') + ' </div> ' +
			'		<span class="time">' + util.timeformat(new Date(topic.get('createtime')), "smart") + '</span>' +
			'	</div>' + 
			'	<div class="content">' + 
			'		<div class="message">' + message + ' </div> ' +
			'		<div class="project"> [ ' + topic.get('project_title') + ' ] </div> ' +
			'	</div>' + 
			'</div>';
		
		return tpl;
	};
	
	return PopularTopicView;
});