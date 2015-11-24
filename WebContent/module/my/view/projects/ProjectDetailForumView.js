define([ 
         'backbone', 'util',
         'view/projects/ProjectDetailForumTopicView',
       ], 
    function(Backbone, util, DetailTopicView) {
	var ProjectDetailForumView = Backbone.View.extend({
		
		className: 'project-detail-forum-view',
		
		events: {
			'click .add-topic-title': 'createTopic',
			'click .topic > .content > .heading': 'toggleDetail'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addTopic', 'createTopic', 'toggleDetail');
			
			//监听model变化
			this.model.bind('add', this.addTopic);
			
			//global param
			this.isExpanded = false;
			this.scrollY = 0;
			this.detailTopicView = null;
		},
		
		render: function(){
			var $topics = $('<div class="topics well">');
			$topics.append(TopicAddButton()); // topic add button
			$(this.el).append($topics);
			
		    return this;
		},
		
		/*
		 * 向topics集合中添加topic所触发的事件
		 * */
		addTopic: function(topic) {
			var $topics = $(this.el).find('.topics');
			$topics.append(TopicItem(topic));
		},
		
		/*
		 * topic add new event
		 * */
		createTopic: function() {
			alert('add new topic! by click event! ');
		},
		
		/*
		 * toggle topic expand event
		 * */
		toggleDetail: function(event) {
			//topic model cid
			var cid = $(event.target).closest('.heading').find('.title').attr('cid');
			var topicModel = this.model.get(cid);
			
			//当前点击的topic
			var $currentTopic = $(event.target).closest('.topic');
			//非点击的topic元素
			var $unClickedTopics = $('.topics').children('[topicid!='+ topicModel.get('topicid') +']');
			//当前topic的detail view
			
			if(!this.isExpanded) {
				//change icon state
				$('.expand-icon  > i').removeClass('fa-angle-down').addClass('fa-angle-up');
				
				//store scroll Y
				this.scrollY = $('.project-content').scrollTop();
				
				//隐藏非click的topic元素
				$unClickedTopics.hide();
				
				//隐藏并设置topic相关属性
				$currentTopic.find('.create-time').hide();
				$currentTopic.find('.create-operator').hide();
				$currentTopic.find('.short-description').hide();
				$currentTopic.find('.title').addClass('expanded');
				
				//显示topic细节
				this.detailTopicView = new DetailTopicView({
					model: topicModel
				});
				$currentTopic.find('.body').append(this.detailTopicView.render().el);
				
				//设置scroll状态
				$('.project-content').scrollTop(0);
				
				//重置状态
				this.isExpanded = true;
			}else{
				//change icon state
				$('.expand-icon  > i').removeClass('fa-angle-up').addClass('fa-angle-down');
				
				//显示非click的topic元素
				$unClickedTopics.fadeIn();
				
				//显示并设置topic相关属性
				$currentTopic.find('.create-time').show();
				$currentTopic.find('.create-operator').show();
				$currentTopic.find('.short-description').show();
				$currentTopic.find('.title').removeClass('expanded');
				
				//隐藏topic细节
				if(this.detailTopicView != null) {
					this.detailTopicView.remove();
					this.detailTopicView = null;
				}
				
				//restore scroll Y
				$('.project-content').scrollTop(this.scrollY);
				
				//重置状态
				this.isExpanded = false;
			}
		}
	});
	
	var TopicAddButton = function() {
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
	
	var TopicItem = function(topic) {
		var creator = topic.get('creator');
		var tpl = 
			'<div class="topic" topicid="'+ topic.get('topicid') +'"> ' +
			'  <div class="timeline-icon"> ' +
			'    <i class="fa fa-users"></i> ' +
			'  </div> ' +
			'  <div class="content"> ' +
			'	<div class="heading"> ' +
			'		<div class="expand-icon" title="show topic detail"><i class="fa fa-angle-down"></i></div>' + 
			'		<span class="create-time">' + util.timeformat(new Date(topic.get('createtime')), "smart") + '</span> ' + 
			'		<img class="create-operator img-circle" title="' + creator.nickname + '" src="' + util.baseUrl + creator.logo + '"> ' +
			'		<div class="title" cid="'+ topic.cid +'" title="'+ topic.get('title') + '">'+ topic.get('title') + '</div> ' +
			'	</div>' +
			'	<div class="body"> ' + 
			'		<div class="short-description" title="'+ topic.get('description') + '">'+ topic.get('description') + '</div> ' +
			'	</div> ' +
			'  </div> ' +
			'</div>';
			
		return tpl;
	};
	
	return ProjectDetailForumView;
});