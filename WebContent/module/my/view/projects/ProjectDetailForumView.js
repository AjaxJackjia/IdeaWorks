define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var ProjectDetailForumView = Backbone.View.extend({
		
		className: 'project-detail-forum-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
		},
		
		render: function(){
			/*
			 * generate topics
			 * */
			var $topics = $('<div class="topics well">');
			
			$topics.append(topicAdd()); // topic add button
			for(var index = 0; index<20; index++) {
				var $topic = $(topic({ 
					id: index
				}));
				$topics.append($topic);
				
				//participants
				var users = [
				             	'darryl', 'dorthy', 'harry', 'jackjia', 
				             	'kendall', 'kylee', 'lila', 'stacy', 'stefan'
				            ];
				
				var max_shown_user_index = Math.floor( Math.random()*10 );
				$.each(users, function(index, user) {
					if(index < max_shown_user_index) {
						$topic.find('.participants').append(participant({
							name: user
						}));
					}else if(index == max_shown_user_index) {
						var placeholder = 
							'<div class="participant">' +
							'	<i class="fa fa-ellipsis-h"></i>' + 
							'</div>';
						$topic.find('.participants').append(placeholder);
					};
				});
			}
			
			$(this.el).append($topics);
			
			/*
			 * topic add new event
			 * */
			$topics.find('.add-topic-title').click(function() {
				alert('add new topic!');
			});
			
			/*
			 * topic expand event
			 * */
			var isExpanded = false;
			var scrollY = 0;
			$topics.find('.topic > .content > .heading').click(function() {
				//当前点击的topic
				var $currentTopic = $(this).closest('.topic');
				
				//点击的topic id
				var topicId = $currentTopic.attr('topicid');
				
				//非点击的topic元素
				var $unClickedTopics = $topics.children('[topicid!='+ topicId +']');
				
				if(!isExpanded) {
					//change icon state
					$('.expand-icon  > i').removeClass('fa-angle-down').addClass('fa-angle-up');
					
					//store scroll Y
					scrollY = $('.project-content').scrollTop();
					
					//隐藏非click的topic元素
					$unClickedTopics.fadeOut();
					
					//隐藏topic相关属性
					$currentTopic.find('.description').hide();
					
					//显示milestone细节
					$currentTopic.find('.body').append(generateTopicDetailDiv({
						id: topicId
					}));
					
					//设置 discussion 信息
					var messages = [
					                {from: 'darryl', msg: 'This is an easy question!', time: '2015-11-01 12:22:00'},
					                {from: 'jackjia', msg: 'This is an easy question!This is an easy question!This is an easy question!This is an easy question!This is an easy question!This is an easy question!This is an easy question!This is an easy question!This is an easy question!This is an easy question!This is an easy question!This is an easy question!This is an easy question!This is an easy question!', time: '2015-11-01 12:22:00'},
					                {from: 'stefan', msg: 'This is an easy question!', time: '2015-11-01 12:22:00'},
					                {from: 'dorthy', msg: 'This is an easy question!', time: '2015-11-01 12:22:00'}
					               ]
					$.each(messages, function(index, msg) {
						$currentTopic.find('.discussion-container  > .discussion-content').append(message(msg));
					});
					
					//设置scroll状态
					$('.project-content').scrollTop(0);
					
					//重置状态
					isExpanded = true;
				}else{
					//change icon state
					$('.expand-icon  > i').removeClass('fa-angle-up').addClass('fa-angle-down');
					
					//显示非click的milestone元素
					$unClickedTopics.fadeIn();
					
					//显示milestone相关属性
					$currentTopic.find('.description').show();
					
					//隐藏milestone细节
					$currentTopic.find('.body > .detail').remove();
					
					//restore scroll Y
					$('.project-content').scrollTop(scrollY);
					
					//重置状态
					isExpanded = false;
				}
			});
			
		    return this;
		}
	});
	
	var topicAdd = function() {
		var $tpl = 
			'<div class="topic"> ' +
			'  <div class="timeline-icon"> ' +
			'    <i class="fa fa-plus"></i> ' +
			'  </div> ' +
			'  <div class="content"> ' +
			'	 <div class="add-topic-title">Add New Topic</div> ' +
			'  </div> ' +
			'</div>';
			return $tpl;
	};
	
	var topic = function(data) {
		var tpl = 
			'<div class="topic" topicid="'+ data.id +'"> ' +
			'  <div class="timeline-icon"> ' +
			'    <i class="fa fa-users"></i> ' +
			'  </div> ' +
			'  <div class="content"> ' +
			'	<div class="heading"> ' +
			'		<div class="expand-icon" title="show topic detail"><i class="fa fa-angle-down"></i></div>' + 
			'		<span class="create-time">2 days ago</span> ' + 
			'		<img class="create-operator img-circle" src="http://localhost:8888/IdeaWorks/res/images/my/user/kylee.png"> ' +
			'		<div class="title">How to build UI design work ? </div> ' +
			'	</div>' +
			'	<div class="body"> ' + 
			'		<div class="participants"></div> ' +
			'	</div> ' +
			'  </div> ' +
			'</div>';
			
		return tpl;
	};
	
	var generateTopicDetailDiv = function(data) {
		var tpl = 
			'<div class="detail">' +
			'	<div class="description-container well">' + 
	        '		<h4 class="heading">Description</h4>' + 
	        '		<div class="description-content">The goal of this project is to contribute to the development of a human-computer interaction environment in which the computer detects and tracks the user\'s emotional, motivational, cognitive and task states, and initiates communications based on this knowledge, rather than simply responding to user commands.</div>' + 
	        '	</div>' + 
	        '	<div class="discussion-container well">' + 
	        '		<h4 class="heading">Discussion</h4>' + 
	        '		<div class="discussion-content"></div>' + 
	        '	</div>' + 
			'</div>';
		return tpl;
	};
	
	var participant = function(data) {
		var tpl = 
			'<div class="participant">' +
			'	<img class="img-circle" src="http://localhost:8888/IdeaWorks/res/images/my/user/'+ data.name +'.png">' + 
			'</div>';
		return tpl;
	};
	
	var message = function(data) {
		var tpl = '';
		if(data.from == 'jackjia') {
			tpl = '<div class="message self">';
		}else{
			tpl = '<div class="message other">';
		}
		tpl += 
			'	<img class="img-circle" src="http://localhost:8888/IdeaWorks/res/images/my/user/'+ data.from +'.png">' + 
			'	<div class="message-body"> ' +
			'		<div class="message-title"> ' + 
			'			<span class="message-from">'+ data.from +'</span>' + 
			'			<span class="message-time">'+ data.time +'</span>' + 
			'		</div> ' + 
			'		<div class="message-text">'+ data.msg +'</div>' + 
			'	</div>' +
			'</div>';
		
		return tpl;
	};
	
	return ProjectDetailForumView;
});