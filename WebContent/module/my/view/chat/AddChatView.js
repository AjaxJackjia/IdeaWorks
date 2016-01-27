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
			'click	  .actions > .create': 'createMessages',
			'keyup	  #member_search': 'search'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'fetchMembers', 'select', 'remove', 'addItem', 'removeItem', 
					'createMessages', 'search', 'generateMemberItem', 'generateSelectedMemberItem');
			
			//members
			this.members = new MemberCollection();
			this.members.url = '/IdeaWorks/api/users';
			
			//selected members
			this.selected = new MemberCollection();
			this.selected.bind('add', this.addItem);
			this.selected.bind('remove', this.removeItem);
			
			//search members
			this.searchMembers = new MemberCollection();
		},
		
		render: function(){
			var $title = $('<div class="form-group">');
			$title.append('<label for="message_title" class="control-label">Title: </label>');
			$title.append('<input type="text" class="form-control" id="message_title" name="message_title" placeholder="internal message title...">');
			
			var $membersTitle = $('<label class="control-label">Members: (Double click member in the left container to add members)</label>');
			
			var $memberSearch = $('<div class="input-group search-group">');
			$memberSearch.append('<span class="input-group-addon" id="basic-addon1"><i class="fa fa-search"></i></span>');
			$memberSearch.append('<input type="text" class="form-control" id="member_search" name="member_search" placeholder="search member..." aria-describedby="basic-addon1">');
			
			var $membersContent = $('<div class="message-members">');
			$membersContent.append('<div class="left"></div>');
			$membersContent.append('<div class="middle"><i class="fa fa-arrow-right"></i></div>');
			$membersContent.append('<div class="right"></div>');
			
			var $actions = $('<div class="actions">');
			$actions.append('<div class="messages-email"><input type="checkbox" /><div class="title">send notification via email</div></div>');
			$actions.append('<a type="button" class="cancel btn btn-default" data-dismiss="modal">Cancel</a>');
			$actions.append('<a type="submit" class="create btn btn-primary">Create</a>');
			
			$(this.el).append($title);
			$(this.el).append($membersTitle);
			$(this.el).append($memberSearch);
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
								//默认添加当前用户到已选择列表中
								if(member.get('userid') == util.currentUser()) {
									self.selected.add(member);
								}
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
			var userid = $item.attr('userid');
			if(this.selected.where({userid: userid}).length > 0) return; //若已经选择，则直接略过
			if(userid == util.currentUser()) return; //不能选择自己
			
			//若没有被选择，则直接加入已选择集合
			this.selected.add(this.members.where({userid: userid})[0]);
		},
		
		//移除member
		remove: function(event) {
			var $item = $(event.target).closest('.member');
			if($item == null) return ;
			
			var userid = $item.attr('userid');
			var users = this.selected.where({userid: userid});
			var self = this;
			_.each(users, function(user, index) {
				self.selected.remove(user);
			});
		},
		
		//向selected集合中添加元素(UI)
		addItem: function(item) {
			var $placeholder = $('.right > .empty-place-holder', this.el);
			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			
			if(item.get('userid') == util.currentUser()) {
				$(this.el).find('.right').append(this.generateMemberItem(item));
			}else{
				$(this.el).find('.right').append(this.generateSelectedMemberItem(item));
			}
			
		},
		
		//从selected集合中删除元素(UI)
		removeItem: function(item) {
			_.each($('.right > .member', this.el), function(element, index, list){ 
				if($(element).attr('userid') == item.get('userid')) {
					$(element).remove();
				}
			});
			
			//if list is empty, then add placeholder 
			if($('.right > div', this.el).length == 0) {
				$('.right', this.el).append('<div class="empty-place-holder"><h4>No members...</h4></div>');
			}
		},
		
		//创建消息群
		createMessages: function() {
			//check title
			if($('#message_title', this.el).val() == '') {
				alert('Please input internal messages title...');
				return;
			}
			
			//check member (至少两人)
			if(this.selected.length < 2) {
				alert('Please select member...');
				return;
			}else if(this.selected.length > 200) {
				alert('The max size of member is 200!');
				return;
			}
			
			//构建请求参数
			var userids = this.selected.pluck("userid");
			var data = {};
			data.userid = util.currentUser();
			data.type = 'group';
			data.title = $('#message_title', this.el).val();
			data.members = userids.join();
			
			//触发全局事件
			Backbone.trigger('ChatListView:createChat', data);
			
			//关闭new chat view浮层
			$('#add_chat_view').modal('toggle');
		},
		
		//查找member
		search: function() {
			var self = this;
			//清空左侧container
			this.cleanLeftContainer();
			
			var value = $('#member_search').val();
			if(value == '') {
				_.each(self.members.models, function(member, index) {
					$(self.el).find('.left').append(self.generateMemberItem(member));
				});
			}else{
				//check param, 需要是字母或者数字
				var patten = new RegExp(/^\w+$/g);
				if(!patten.test(value)) return;
				
				this.searchMembers.url = '/IdeaWorks/api/users/' + util.currentUser() + '/search/persons?key=' + value;
				this.searchMembers.reset();
				this.searchMembers.fetch({
					success: function() {
						if(self.searchMembers.length == 0) {
							$(self.el).find('.left').html('No members...');
						}else{
							_.each(self.searchMembers.models, function(member, index) {
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
		
		cleanLeftContainer: function() {
			var $members = $('.left > .member', this.el);
			$.each($members, function(index, value) {
				value.remove();
			});
			
			$('.left', this.el).html('');
		},
		
		//view
		generateMemberItem: function(member) {
			var tpl = 
				'<div class="member" userid="' + member.get('userid') + '"> ' + 
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
				'<div class="member" userid="' + member.get('userid') + '"> ' + 
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
			if($('#announcement_title', this.el).val() == '') {
				alert('Please input announcement title...');
				return;
			}
			
			if($('#announcement_content', this.el).val() == '') {
				alert('Please input announcement content...');
				return;
			}
			
			//构建请求参数
			var data = {};
			data.userid = util.currentUser();
			data.type = 'announcement';
			data.title = $('#announcement_title', this.el).val();
			data.tousertype = $('#announcement_type', this.el).val();
			data.content = $('#announcement_content', this.el).val();
			
			//触发全局事件
			Backbone.trigger('ChatListView:createChat', data);
			
			//关闭new chat view浮层
			$('#add_chat_view').modal('toggle');
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
			$type.find('#announcement_type').append('<option value="2">Industrical Participant</option>');
			$type.find('#announcement_type').append('<option value="3">Government</option>');
			$type.find('#announcement_type').append('<option value="4">Others</option>');
			
			var $content = $('<div class="form-group">');
			$content.append('<label for="announcement_content" class="control-label">Content:</label>');
			$content.append('<textarea class="form-control" id="announcement_content" name="announcement_content" placeholder="Please type in your announcement content..."></textarea> ');
			
			var $actions = $('<div class="actions">');
			$actions.append('<div class="announcement-email"><input type="checkbox" /><div class="title">send via email at the same time</div></div>');
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