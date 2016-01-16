define([ 
         'backbone', 'util', 'CheckLib', 'i18n!../../../../nls/translation'
       ], 
    function(Backbone, util, CheckLib, i18n) {
	var ChatDetailView = Backbone.View.extend({
		
		className: 'chat-detail-view',
		
		events: {
			
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'unrender', 'chatChange');
			
			//view 全局变量
			this.initFlag = true; //标识是否为第一次render
			
			//注册全局事件
			Backbone.
				off('ChatDetailView:showChatDetail').
				on('ChatDetailView:showChatDetail', this.chatChange, this);
			
			this.render();
		},
		
		render: function(){
			if(this.initFlag == true || this.model == null) {
				var $emtpy_placeholder = $('<div class="empty-place-holder"></div>');
				$emtpy_placeholder.append('<h4>No Internal Message Selected...</h4>');
				$(this.el).html($emtpy_placeholder);
				
				//reset init flag
				this.initFlag = false;
			}else{
				//根据模板生成dom
				var chatDetail_tpl = ChatDetail_template(this.model);
				$(this.el).html(chatDetail_tpl);
			}

			return this;
		},
		
		unrender: function() {
			var $emtpy_placeholder = $('<div class="empty-place-holder"></div>');
			$emtpy_placeholder.append('<h4>' + i18n.my.projects.ProjectDetailView.NO_PROJECT_SELECT + '</h4>');
			$(this.el).html($emtpy_placeholder);
		},
		
		chatChange: function(chat) {
			this.model = chat;
			
			//监听model变化
			this.model.bind('change', this.render);	
			this.model.bind('destroy', this.unrender);
			
			this.render();
		}
	});
	
	var ChatDetail_template = function(chat) {
		var type = chat.get('type');
		if(type == 'announcement') 
		{
			return Announcement_template(chat);
		}
		else if(type == 'group')
		{
			return Group_template(chat);
		}
		
		return '';
	};
	
	var Announcement_template = function(chat) {
		var $container = $('<div class="announcement-container well">');
		
		var header = '<div class="heading">' + 
					 '	<div class="title">Announcement Message</div>' +
					 '	<div class="meta">' + 
					 '		<div class="time">' + util.timeformat(new Date(chat.get('createtime')), "smart")  + '</div>' + 
					 '		<div class="from"></div>' + 
					 '		<div class="to"></div>' + 
					 '	</div>' + 
					 '</div>';
		var content = '<div class="content">xxxxx</div>';
		
		$container.append(header);
		$container.append(content);
				
		return $container;
	};
	
	var Group_template = function(chat) {
		var $container = $('<div class="chat-container well">');
		
		var header = '<h4 class="heading">' + 
					 '	<span>Internal Messages</span>' +
					 '</h4>';
		var content = 
				'<div class="discussion-content">' + 
			    '	<div class="placeholder">' +
			    '		<h4>' + i18n.my.projects.ProjectDetailForumTopicMessageView.NO_DISCUSSION + '</h4>' + 
			    '	</div>' + 
			    '</div>';
		var sendbox = 
				'<div class="discussion-sender">' + 
				'	<textarea class="form-control" id="send_content" placeholder="' + i18n.my.projects.ProjectDetailForumTopicMessageView.SAY_STH + '"></textarea>' +
				'	<div class="send-action"> ' + 
				'		<a class="send btn btn-primary">' + i18n.my.projects.ProjectDetailForumTopicMessageView.COMMENT + '</a> ' + 
				'	</div> ';
				'</div>';
		
		$container.append(header);
		$container.append(content);
		$container.append(sendbox);
				
		return $container;
	};
	
	return ChatDetailView;
});