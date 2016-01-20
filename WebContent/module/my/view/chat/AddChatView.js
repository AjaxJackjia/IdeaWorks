define([ 
         'backbone', 'util', 'CheckLib', 'i18n!../../../../nls/translation',
         'model/chat/MemberCollection'
       ], 
    function(Backbone, util, CheckLib, i18n, MemberCollection) {
	
	var AddChatView = Backbone.View.extend({
		
		id: 'add_chat_view',
		
		className: 'add-chat-view modal fade',
		
		initialize: function(){
			_.bindAll(this, 'render');
		},
		
		render: function(){
			var $modalDialog = $('<div class="modal-dialog" role="document">');
			var $modalDialogContent = $('<div class="modal-content">');
			$modalDialog.append($modalDialogContent);
			
			var header = Header();
			$modalDialogContent.append(header);
			
			var body = Body();
			$modalDialogContent.append(body);
			
			var messagesView = new MessageView();
			var announcementView = new AnnouncementView();
			
			$modalDialogContent.find('#messages').append($(messagesView.render().el));
			$modalDialogContent.find('#announcement').append($(announcementView.render().el));
			
			$(this.el).append($modalDialog);
			
			$(this.el).on('show.bs.modal', function (event) {
				//拉取所有用户
				messagesView.fetchMembers();
			});
			
			$(this.el).on('hide.bs.modal', function (event) {
				
			});
			
			return this;
		}
	});
	
	var Header = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">New Internal Messages</h3> ' + 
			'</div>';
		return tpl;
	};
	
	var Body = function() {
		var menu_tpl = 
			'<ul class="im-menu nav nav-tabs" role="tablist">' + 
			'  <li role="presentation" class="active">' + 
			'		<a href="#messages" aria-controls="messages" role="tab" data-toggle="tab">Messages</a>' + 
			'  </li>' + 
			'  <li role="presentation">' + 
			'  		<a href="#announcement" aria-controls="announcement" role="tab" data-toggle="tab">Announcement</a>' + 
			'  </li>' + 
			'</ul>';
		
		var content_tpl = 
			'<div class="im-content tab-content">' + 
			'  <div role="tabpanel" class="tab-pane fade in active" id="messages"></div>' + 
			'  <div role="tabpanel" class="tab-pane fade" id="announcement"></div>' + 
			'</div>';
		
		return menu_tpl + content_tpl;
	};
	
	//messages view
	var MessageView = Backbone.View.extend({
		className: 'im-message-view',
		
		events: {
			'dblclick .left > .member': 'select',
			'click 	  .right > .member > .remove': 'remove',
			'click	  .actions > .create': 'createMessages'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'fetchMembers', 'select', 'remove', 'addItem', 'removeItem', 'generateMemberItem', 'generateSelectedMemberItem');
			
			//members
			this.members = new MemberCollection();
			this.members.url = '/IdeaWorks/api/users';
			
			//selected members
			this.selected = new MemberCollection();
			this.selected.bind('add', this.addItem);
			this.selected.bind('remove', this.removeItem);
		},
		
		render: function(){
			var $title = $('<div class="form-group">');
			$title.append('<label for="message_title" class="control-label">Title: </label>');
			$title.append('<input type="text" class="form-control" id="message_title" name="message_title" placeholder="internal message title...">');
			
			var $membersTitle = $('<label class="control-label">Members: </label>');
			var $membersContent = $('<div class="message-members">');
			$membersContent.append('<div class="left"></div>');
			$membersContent.append('<div class="middle"><i class="fa fa-arrow-right"></i></div>');
			$membersContent.append('<div class="right"></div>');
			
			var $actions = $('<div class="actions">');
			$actions.append('<a type="button" class="cancel btn btn-default" data-dismiss="modal">Cancel</a>');
			$actions.append('<a type="submit" class="create btn btn-primary">Create</a>');
			
			$(this.el).append($title);
			$(this.el).append($membersTitle);
			$(this.el).append($membersContent);
			$(this.el).append($actions);
			
			return this;
		},
		
		//拉取所有member
		fetchMembers: function() {
			var self = this;
			
			//如果为空时，则去拉取；
			if(self.members.length == 0) {
				self.members.fetch({
					success: function() {
						if(self.members.length == 0) {
							$(self.el).find('.left').html('No members...');
						}else{
							_.each(self.members.models, function(member, index) {
								$(self.el).find('.left').append(self.generateMemberItem(member));
							});
						}
					},
					error: function(model, response, options) {
						util.commonErrorHandler(response.responseJSON, 'new internal messages add members fetch failed. Please try again later!');
					}
				});
			}
		},
		
		//选择member
		select: function(event) {
			var $item = $(event.target).closest('.member');
			if($item == null) return ;
			
			//判断是否在已选择集合中
			var cid = $item.attr('cid');
			var userid = this.members.get(cid).get('userid');
			if(this.selected.where({userid: userid}).length > 0) return; //若已经选择，则直接略过
			if(userid == util.currentUser()) return; //不能选择自己
			
			//若没有被选择，则直接加入已选择集合
			this.selected.add(this.members.get(cid));
		},
		
		//移除member
		remove: function(event) {
			var $item = $(event.target).closest('.member');
			if($item == null) return ;
			
			var cid = $item.attr('cid');
			this.selected.remove(cid);
		},
		
		//向selected集合中添加元素(UI)
		addItem: function(item) {
			$(this.el).find('.right').append(this.generateSelectedMemberItem(item));
		},
		
		//从selected集合中删除元素(UI)
		removeItem: function(item) {
			_.each($('.right > .member', this.el), function(element, index, list){ 
				if($(element).attr('cid') == item.cid) {
					$(element).remove();
				}
			});
		},
		
		//创建消息群
		createMessages: function() {
			//check title
			if($('#message_title', this.el).val() == '') {
				alert('Please input internal messages title...');
				return;
			}
			
			//check member
			if(this.selected.length == 0) {
				alert('Please select member...');
				return;
			}
			
			
		},
		
		//view
		generateMemberItem: function(member) {
			var tpl = 
				'<div class="member" cid="' + member.cid + '"> ' + 
	        	'	<div class="photo"> ' +
	        	'		<img class="img-circle" src="' + member.get('logo') + '"> ' +
	        	'	</div> ' +
			    '    <div class="info" title="'+ member.get('nickname') + ' (' + member.get('userid') + ')' +'"> ' + 
			    		member.get('nickname') + ' (' + member.get('userid') + ')' + '</div> ' +
			    '    </div> ' +
			    '</div>';
			return tpl;
		},
		
		generateSelectedMemberItem: function(member) {
			var tpl = 
				'<div class="member" cid="' + member.cid + '"> ' + 
	        	'	<div class="photo"> ' +
	        	'		<img class="img-circle" src="' + member.get('logo') + '"> ' +
	        	'	</div> ' +
			    '    <div class="info" title="'+ member.get('nickname') + ' (' + member.get('userid') + ')' +'"> ' + 
			    		member.get('nickname') + ' (' + member.get('userid') + ')' +
			    '    </div> ' +
			    '    <div class="remove"><i class="fa fa-times"></i></div> ' +
			    '</div>';
			return tpl;
		}
	});

	//announcement view
	var AnnouncementView = Backbone.View.extend({
		className: 'im-announcement-view',
		
		events: {
			'click .actions > .create': 'createAnnouncement'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'createAnnouncement', 'generateAuthorizedView', 'generateUnauthorizedView');
		},
		
		render: function(){
			//TODO: 权限验证
			this.generateAuthorizedView();
			//this.generateUnauthorizedView();
			
			return this;
		},
		
		createAnnouncement: function() {
			//check param
			
			//create
		},
		
		//view
		generateAuthorizedView: function() {
			var $title = $('<div class="form-group">');
			$title.append('<label for="announcement_title" class="control-label">Title: </label>');
			$title.append('<input type="text" class="form-control" id="announcement_title" name="announcement_title" placeholder="announcement title...">');
			
			var $type = $('<div class="form-group">');
			$type.append('<label for="announcement_type" class="control-label">To:</label>');
			$type.append('<select id="announcement_type" class="form-control">');
			$type.find('#announcement_type').append('<option value="666">All Members</option>');
			$type.find('#announcement_type').append('<option value="0">Student</option>');
			$type.find('#announcement_type').append('<option value="1">Faculty</option>');
			$type.find('#announcement_type').append('<option value="2">INDUSTRICAL_PARTICIPANT</option>');
			$type.find('#announcement_type').append('<option value="3">GOVERNMENT</option>');
			$type.find('#announcement_type').append('<option value="4">OTHERS</option>');
			
			var $content = $('<div class="form-group">');
			$content.append('<label for="announcement_content" class="control-label">Content:</label>');
			$content.append('<textarea class="form-control" id="announcement_content" name="announcement_content" placeholder="Please type in your announcement content..."></textarea> ');
			
			var $actions = $('<div class="actions">');
			$actions.append('<a type="button" class="cancel btn btn-default" data-dismiss="modal">Cancel</a>');
			$actions.append('<a type="submit" class="create btn btn-primary">Create</a>');
			
			$(this.el).append($title);
			$(this.el).append($type);
			$(this.el).append($content);
			$(this.el).append($actions);
		},
		
		generateUnauthorizedView: function() {
			var $title = $('<div class="detail">');
			$title.html('You don\'t have permission to create announcement. Please apply administrator for the permission...');
			
			$(this.el).append($title);
		}
	});
	
	return AddChatView;
});