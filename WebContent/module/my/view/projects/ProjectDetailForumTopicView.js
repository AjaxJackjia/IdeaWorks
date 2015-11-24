define([ 
         'backbone', 'util',
         //model
  		 'model/project/MessageCollection',
       ], 
    function(Backbone, util, MessageCollection) {
	var ProjectDetailForumTopicView = Backbone.View.extend({
		
		className: 'project-detail-forum-topic-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addMsg');
			
			//global param
			//加载topic message
			this.messageCollection = new MessageCollection();
			this.messageCollection.url = '/IdeaWorks/api/users/' + util.currentUser() + 
										 '/projects/' + this.model.get('projectid') + 
										 '/topics/' + this.model.get('topicid') + '/messages';
			//监听model变化
			this.messageCollection.bind('add', this.addMsg);
		},
		
		render: function(){
			
			var meta = TopicMeta(this.model);
			var description = TopicDescription(this.model);
			var discussion = TopicDiscussion();
			
			$(this.el).append(meta);
			$(this.el).append(description);
			$(this.el).append(discussion);
			
			//拉取信息
			this.messageCollection.fetch();
			
		    return this;
		},
		
		/*
		 * 向message集合中添加message所触发的事件
		 * */
		addMsg: function(message) {
			var $discussionContent = $(this.el).find('.discussion-content');
			var $placeholder = $discussionContent.find('.placeholder');
			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			$discussionContent.append(MessageItem(message));
		}
	});
	
	var TopicMeta = function(topic) {
		var creator = topic.get('creator');
		var tpl = 
			'<div class="meta-container">' + 
	        '	<img class="creator img-circle" title="' + creator.nickname + '" src="' + util.baseUrl + creator.logo + '">' + 
	        '	<div class="creator-nickname">' + creator.nickname + '</div>' + 
	        '	<div class="create-title"> create this topic at </div>' + 
	        '	<div class="time">' + util.timeformat(new Date(topic.get('createtime')), "smart") + '</div> ' + 
	        '</div>';
			
		return tpl;
	};
	
	var TopicDescription = function(topic) {
		var tpl = 
			'<div class="description-container well">' + 
	        '	<h4 class="heading">Description</h4>' + 
	        '	<div class="description-content">' + topic.get('description') + '</div>' + 
	        '</div>';
		
		return tpl;
	};
	
	var TopicDiscussion = function(topic) {
		var tpl = 
			'<div class="discussion-container well">' + 
		    '	<h4 class="heading">Discussion</h4>' + 
		    '	<div class="discussion-content">' + 
		    '		<div class="placeholder">' +
		    '			<h4>No discussion...</h4>' + 
		    '		</div>' + 
		    '	</div>' + 
		    '</div>';
		
		return tpl;
	};
	
	var MessageItem = function(message) {
		var from = message.get('from');
		var to = message.get('to');
		
		var tpl = '';
		if(from.userid == util.currentUser()) {
			tpl = '<div class="message self">';
		}else{
			tpl = '<div class="message other">';
		}
		tpl += 
			'	<img class="img-circle" title="' + from.nickname + '" src="' + util.baseUrl + from.logo + '">' + 
			'	<div class="message-body"> ' +
			'		<div class="message-title"> ' + 
			'			<span class="message-from">'+ from.nickname +'</span>' + 
			'			<span class="message-time">' + util.timeformat(new Date(message.get('time')), "smart") + '</span>' + 
			'		</div> ' + 
			'		<div class="message-text">'+ message.get('msg') +'</div>' + 
			'	</div>' +
			'</div>';
		
		return tpl;
	};
	
	return ProjectDetailForumTopicView;
});