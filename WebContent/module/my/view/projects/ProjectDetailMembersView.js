define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation',
         //model
         'model/project/MemberCollection',
         'model/project/MemberPaginationCollection',
         'model/search/PersonModel'
       ], 
    function(Backbone, util, i18n, MemberCollection, MemberPaginationCollection, PersonModel) {
	var ProjectDetailMembersView = Backbone.View.extend({
		
		className: 'project-detail-members-view',
		
		events: {
			'click .member-action > a.add-member': 'inviteMember',
			'click .member': 'showMemberInfo'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addMember', 'inviteMember', 'showMemberInfo');
			
			//监听model变化
			this.model.bind('add', this.addMember);
		},
		
		render: function(){
			var $advisor = $('<div class="advisor well">');
			var $advisorTitle = $('<div class="advisor-title">' + i18n.my.projects.ProjectDetailMembersView.ADVISOR + '</div>');
			var $advisorContent = $('<div class="advisor-content"></div>');
			$advisorContent.append('<div class="placeholder"><h4>' + i18n.my.projects.ProjectDetailMembersView.ADVISOR_PLACEHOLDER + '</h4></div>');
			$advisor.append($advisorTitle);
			$advisor.append($advisorContent);
			
			var $members = $('<div class="members well">');
			var $membersTitle = $('<div class="members-title">' + i18n.my.projects.ProjectDetailMembersView.MEMBERS + '</div>');
			var $membersContent = $('<div class="members-content"></div>');
			$membersContent.append('<div class="placeholder"><h4>' + i18n.my.projects.ProjectDetailMembersView.MEMBERS_PLACEHOLDER + '</h4></div>');
			$members.append($membersTitle);
			$members.append($membersContent);
			
			//member actions
			var $action_add = $('<div class="member-action">');
			$action_add.append('<a class="add-member btn btn-default" href="javascript:;"><i class="fa fa-user-plus"></i></a>');
			$membersContent.append($action_add);
			
			$(this.el).append($advisor);
			$(this.el).append($members);
			
		    return this;
		},
		
		//member collection add member trigger event
		addMember: function(member) {
			if(member.get('advisor')) {
				var $content = $(this.el).find('.advisor-content');
				var $placeholder = $content.find('.placeholder');
				if($placeholder.length > 0) {
					$placeholder.remove();
				}
				$content.append(MemberItem(member));
			}
			
			var $content = $(this.el).find('.members-content');
			var $placeholder = $content.find('.placeholder');
			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			var memberDom = MemberItem(member);
			$(memberDom).insertBefore('.member-action');
		},
		
		//邀请成员加入该project
		inviteMember: function() {
			var members = this.model;
			var addMemberSubView = new AddMemberSubView({
				model: members
			});
			var $subView = $('#add_member_sub_view');
			if($subView.length == 0) {
				$('.content-panel').append($(addMemberSubView.render().el));
			}
			//显示view
			$('#add_member_sub_view').modal('toggle');
		},
		
		//查看成员详细信息
		showMemberInfo: function(event) {
			var cid = $(event.target).closest('.member').attr('cid');
			var member = this.model.get(cid);
			//点击member成员是从search接口查询数据
			member.url = '/IdeaWorks/api/users/' + util.currentUser() + '/search/persons/' + member.get('userid');
			var memberDetailSubView = new MemberDetailSubView({
				model: member
			});
			var $subView = $('#member_detail_sub_view');
			if($subView.length == 0) {
				$('.content-panel').append($(memberDetailSubView.render().el));
			}
			//显示view
			$('#member_detail_sub_view').modal('toggle');
		}
	});
	
	var MemberItem = function(member) {
		var $tpl = 
			'<a class="member" cid="'+ member.cid +'"> ' + 
        	'	<div class="member-photo"> ' +
        	'		<img class="img-circle" src="' + member.get('logo') + '"> ' +
        	'	</div> ' +
		    '    <div class="info"> ' +
		    '      <h4> ' +
		    '          <span class="center">' + member.get('nickname') + '</span> ' +
		    '      </h4> ' +
		    '      <div class="signature" title="' + member.get('signature') + '"> ' + member.get('signature') + ' </div> ' +
		    '    </div> ' +
		    '</a>';
		return $tpl;
	};
	
	/***********************************************************************************/
	/*
	 * subview - add member view
	 * */
	var AddMemberSubView = Backbone.View.extend({
		
		id: 'add_member_sub_view',
		
		className: 'add-member-sub-view modal fade',
		
		events: {
			'dblclick .left > .candidate': 'select',
			'click 	  .right > .candidate > .remove': 'remove',
			'click	  .invite': 'invite',
			'keyup	  #candidate_search': 'search'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'fetchCandidates', 'select', 'remove', 'addItem', 'removeItem', 
					'invite', 'search', 'generateCandidateItem', 'generateSelectedCandidateItem', 'generateLoadMoreItem');
			
			//members
			this.candidates = new MemberPaginationCollection();
			this.candidates.fetchErrorMsg = 'project add members fetch failed. Please try again later!';
			
			//selected members
			this.selected = new MemberCollection();
			this.selected.bind('add', this.addItem);
			this.selected.bind('remove', this.removeItem);
			
			//search members
			this.searchCandidates = new MemberCollection();
		},
		
		render: function(){
			var $modalDialog = $('<div class="modal-dialog" role="document">');
			var $modalDialogContent = $('<div class="modal-content">');
			$modalDialog.append($modalDialogContent);
			
			var header = Header();
			$modalDialogContent.append(header);
			
			var body = Body();
			$modalDialogContent.append(body);
			
			var footer = Footer();
			$modalDialogContent.append(footer);
			
			$(this.el).append($modalDialog);
			
			//confirm self body
			var self = this;
			//绑定modal显示时触发的事件
			$(this.el).on('show.bs.modal', function (event) {
				//清空左侧分页candidate列表 
				self.candidates.cleanAllUsers();
				
				//拉取candidate列表
				self.fetchCandidates();
			});
			//绑定modal消失时触发的事件
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		//拉取所有member
		fetchCandidates: function() {
			var self = this;
			self.candidates.nextPage(function() {
				$(self.el).find('.left .load-more').remove();
				
				_.each(self.candidates.models, function(candidate, index) {
					$(self.el).find('.left').append(self.generateCandidateItem(candidate));
				});
				
				//若没有完全加载则显示“加载更多按钮”
				if(!self.candidates.isLoadAll) {
					$(self.el).find('.left').append(self.generateLoadMoreItem());
					$(self.el).find('.left .load-more').click(function() {
						self.fetchCandidates();
					});
				}
			});
		},
		
		//选择candidate
		select: function(event) {
			var $item = $(event.target).closest('.candidate');
			if($item == null) return ;
			
			//判断该candidate是否在project的members里
			var userid = $item.attr('userid');
			if(this.model.where({userid: userid}).length != 0) {
				alert("Member: " + $item.find('.info').attr('title') + " has already in this project...");
				return;
			}
			
			//若之前没有被选择，则直接加入已选择集合
			if(this.searchCandidates.models.length > 0) { //若当前正在搜索
				this.selected.add(this.searchCandidates.where({userid: userid})[0]);
			}else{ //若当前没有搜索
				this.selected.add($.grep(this.candidates.userList, function(el,i) {
					return el.get('userid') == userid;
				}));
			}
		},
		
		//移除member
		remove: function(event) {
			var $item = $(event.target).closest('.candidate');
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
				$(this.el).find('.right').append(this.generateCandidateItem(item));
			}else{
				$(this.el).find('.right').append(this.generateSelectedCandidateItem(item));
			}
			
		},
		
		//从selected集合中删除元素(UI)
		removeItem: function(item) {
			_.each($('.right > .candidate', this.el), function(element, index, list){ 
				if($(element).attr('userid') == item.get('userid')) {
					$(element).remove();
				}
			});
		},
		
		invite: function() {
			//将选中的candidate直接加到project member中,后期再加用户验证环节;
			var self = this;
			var projectMembers = this.model;
			this.selected.url = projectMembers.url;
			
			//更新新增的project member
			this.selected.save({
				wait: true,
				success: function() {
					//更新成功后,将新增加的member添加到project member中,使其在页面中显示
					_.each(self.selected.models, function(member, index) {
						projectMembers.add(member);
					});
					//关闭页面
					$('#add_member_sub_view').modal('toggle');
				},
				error: function(response) {
					var alertMsg = i18n.my.projects.ProjectDetailMembersView.ADD_PROJECT_MEMBERS_ERROR;
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
		},
		
		//查找candidate
		search: function() {
			var self = this;
			//清空左侧container
			this.cleanLeftContainer();
			
			var value = $('#candidate_search').val();
			if(value == '') {
				//还原左侧列表
				console.log(self.candidates.userList);
				_.each(self.candidates.userList, function(member, index) {
					$(self.el).find('.left').append(self.generateCandidateItem(member));
				});
				
				if(!self.candidates.isLoadAll) {
					$(self.el).find('.left').append(self.generateLoadMoreItem());
					$(self.el).find('.left .load-more').click(function() {
						self.fetchCandidates();
					});
				}
				//清空search result
				self.searchCandidates.reset();
			}else{
				//check param, 需要是字母或者数字
				var patten = new RegExp(/^\w+$/g);
				if(!patten.test(value)) return;
				
				this.searchCandidates.url = '/IdeaWorks/api/users/' + util.currentUser() + '/search/persons?key=' + value;
				this.searchCandidates.reset();
				this.searchCandidates.fetch({
					success: function() {
						if(self.searchCandidates.length == 0) {
							$(self.el).find('.left').html('<div class="no-member">' + i18n.my.chat.AddChatView.IM_MSG_CREATE_NO_MEMBER + '</div>');
						}else{
							_.each(self.searchCandidates.models, function(member, index) {
								$(self.el).find('.left').append(self.generateCandidateItem(member));
							});
						}
					},
					error: function(model, response, options) {
						util.commonErrorHandler(response.responseJSON, 'project add members - search members failed. Please try again later!');
					}
				});
			}
		},
		
		cleanLeftContainer: function() {
			var $members = $('.left > .candidate', this.el);
			$.each($members, function(index, value) {
				value.remove();
			});
			
			$('.left', this.el).html('');
		},
		
		//view
		generateCandidateItem: function(candidate) {
			var tpl = 
				'<div class="candidate" userid="' + candidate.get('userid') + '"> ' + 
	        	'	<div class="photo"> ' +
	        	'		<img class="img-circle" src="' + candidate.get('logo') + '"> ' +
	        	'	</div> ' +
			    '    <div class="info" title="'+ candidate.get('nickname') + ' (' + candidate.get('userid') + ')' +'"> ' + 
			    		candidate.get('nickname') + ' (' + candidate.get('userid') + ')' + '</div> ' +
			    '    </div> ' +
			    '</div>';
			return tpl;
		},
		
		generateSelectedCandidateItem: function(candidate) {
			var tpl = 
				'<div class="candidate" userid="' + candidate.get('userid') + '"> ' + 
	        	'	<div class="photo"> ' +
	        	'		<img class="img-circle" src="' + candidate.get('logo') + '"> ' +
	        	'	</div> ' +
			    '    <div class="info" title="'+ candidate.get('nickname') + ' (' + candidate.get('userid') + ')' +'"> ' + 
			    		candidate.get('nickname') + ' (' + candidate.get('userid') + ')' +
			    '    </div> ' +
			    '    <div class="remove"><i class="fa fa-times"></i></div> ' +
			    '</div>';
			return tpl;
		},
		
		generateLoadMoreItem: function() {
			var tpl = '<div class="load-more">' + i18n.my.chat.AddChatView.IM_MSG_MEMBERS_LOAD_MORE + '</div>';
			return tpl;
		}
	});
	
	var Header = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">' + i18n.my.projects.ProjectDetailMembersView.INVITE_MEMBERS + '</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var Footer = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="button" class="cancel btn btn-default" data-dismiss="modal">' + i18n.my.projects.ProjectDetailMembersView.CANCEL + '</a> ' + 
			'	<a type="submit" class="invite btn btn-primary">' + i18n.my.projects.ProjectDetailMembersView.INVITE + '</a> ' + 
			'</div> ';
		return tpl;
	}
	
	var Body = function() {
		var $modalBody = $('<div class="modal-body candidate-container">');
		
		var $membersTitle = $('<label class="control-label">' + i18n.my.chat.AddChatView.IM_MSG_MEMBERS + '</label>');
		
		var $memberSearch = $('<div class="input-group search-group">');
		$memberSearch.append('<span class="input-group-addon" id="basic-addon1"><i class="fa fa-search"></i></span>');
		$memberSearch.append('<input type="text" class="form-control" id="candidate_search" name="candidate_search" placeholder="' + i18n.my.chat.AddChatView.IM_MSG_MEMBERS_SEARCH + '" aria-describedby="basic-addon1">');
		
		var $membersContent = $('<div class="candidate-members">');
		$membersContent.append('<div class="left"></div>');
		$membersContent.append('<div class="middle"><i class="fa fa-arrow-right" title="' + i18n.my.chat.AddChatView.IM_MSG_ADD_MEMBERS_TIPS + '"></i></div>');
		$membersContent.append('<div class="right"></div>');
		
		$modalBody.append($membersTitle);
		$modalBody.append($memberSearch);
		$modalBody.append($membersContent);
		
		return $modalBody;
	}

	
	/*
	 * member detail sub view
	 * */
	var MemberDetailSubView = Backbone.View.extend({
		
		id: 'member_detail_sub_view',
		
		className: 'member-detail-sub-view modal fade',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender');
		},
		
		render: function(){
			var $modalDialog = $('<div class="modal-dialog" role="document">');
			var $modalDialogContent = $('<div class="modal-content">');
			$modalDialog.append($modalDialogContent);
			
			var header = DetailHeader();
			$modalDialogContent.append(header);
			
			var body = DetailBody();
			$modalDialogContent.append(body);
			
			var footer = DetailFooter();
			$modalDialogContent.append(footer);
			
			$(this.el).append($modalDialog);
			
			//绑定modal消失时出发的事件
			var self = this;
			
			$(this.el).on('show.bs.modal', function (event) {
				//get person detail info
				self.model.fetch({
					wait: true,
					success: function() {
						generateDetailedInfo(self.model);
					},
					error: function(model, response, options) {
						var alertMsg = i18n.my.projects.ProjectDetailMembersView.FETCH_MEMBER_ERROR;
						util.commonErrorHandler(response.responseJSON, alertMsg);
					}
				});
			});
			
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		}
	});
	
	var DetailHeader = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">' + i18n.my.projects.ProjectDetailMembersView.MEMBER_DETAIL_INFORMATION + '</h3> ' + 
			'</div>';
		return tpl;
	};
	
	var DetailFooter = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="button" class="btn btn-primary" data-dismiss="modal">' + i18n.my.projects.ProjectDetailMembersView.OK + '</a> ' + 
			'</div> ';
		return tpl;
	};
	
	var DetailBody = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="personAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<img id="person_logo" class="img-circle">' + 
			'			<div class="person-info">' + 
			'				<h4>' + 
			'					<span id="person_nickname" class="center"></span>' + 
			'					(<span id="person_userid" class="center"></span>)' + 
			'				</h4>' +
			'				<div id="person_signature" class="signature" title=""></div>' +
			'			</div>' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	};
	
	var generateDetailedInfo = function(person) {
		//basic info
		$('#person_logo').attr('src', person.get('logo'));
		$('#person_nickname').html(person.get('nickname'));
		$('#person_userid').html(person.get('userid'));
		$('#person_signature').html(person.get('signature')!=''?person.get('signature'):i18n.my.projects.ProjectDetailMembersView.DETAIL_SIGNATURE_EMPTY);
		
		//根据email的属性来判断用户信息是否对外公开,具体判断逻辑在java代码中
		var privacy_flag = (person.has('email') && person.get('email') != '') ? true : false;
		var detailed_tpl = '';
		if(privacy_flag) {
			detailed_tpl = 
				'<div class="form-group"> ' + 
				'	<label for="person_realname" class="control-label">' + i18n.my.projects.ProjectDetailMembersView.DETAIL_REALNAME + '</label>' + 
				'	<input type="text" class="form-control" id="person_realname" name="person_realname" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_phone" class="control-label">' + i18n.my.projects.ProjectDetailMembersView.DETAIL_PHONE + '</label>' + 
				'	<input type="text" class="form-control" id="person_phone" name="person_phone" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_email" class="control-label">' + i18n.my.projects.ProjectDetailMembersView.DETAIL_EMAIL + '</label>' + 
				'	<input type="text" class="form-control" id="person_email" name="person_email" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_skype" class="control-label">' + i18n.my.projects.ProjectDetailMembersView.DETAIL_SKYPE + '</label>' + 
				'	<input type="text" class="form-control" id="person_skype" name="person_skype" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_wechat" class="control-label">' + i18n.my.projects.ProjectDetailMembersView.DETAIL_WECHAT + '</label>' + 
				'	<input type="text" class="form-control" id="person_wechat" name="person_wechat" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_major" class="control-label">' + i18n.my.projects.ProjectDetailMembersView.DETAIL_MAJOR + '</label>' + 
				'	<input type="text" class="form-control" id="person_major" name="person_major" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_department" class="control-label">' + i18n.my.projects.ProjectDetailMembersView.DETAIL_DEPARTMENT + '</label>' + 
				'	<input type="text" class="form-control" id="person_department" name="person_department" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_college" class="control-label">' + i18n.my.projects.ProjectDetailMembersView.DETAIL_COLLEGE + '</label>' + 
				'	<input type="text" class="form-control" id="person_college" name="person_college" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_address" class="control-label">' + i18n.my.projects.ProjectDetailMembersView.DETAIL_ADDRESS + '</label>' + 
				'	<input type="text" class="form-control" id="person_address" name="person_address" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_interests" class="control-label">' + i18n.my.projects.ProjectDetailMembersView.DETAIL_INTERESTS + '</label>' + 
				'	<input type="text" class="form-control" id="person_address" name="person_address" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_introduction" class="control-label">' + i18n.my.projects.ProjectDetailMembersView.DETAIL_INTRODUCTION + '</label>' + 
				'	<textarea class="form-control" id="person_introduction" name="person_introduction" disabled></textarea> ' + 
				'</div> ';
		}else{
			detailed_tpl = 
				'<div class="form-group"> ' + 
				'	<label class="control-label">' + i18n.my.projects.ProjectDetailMembersView.DETAIL_PRIVACY_TIPS + '</label>' + 
				'</div> ';
		}
		$('#personAttribute').append(detailed_tpl);
		if(privacy_flag) {
			$('#person_realname').val(person.get('realname'));
			$('#person_phone').val(person.get('phone'));
			$('#person_email').val(person.get('email'));
			$('#person_skype').val(person.get('skype'));
			$('#person_wechat').val(person.get('wechat'));
			$('#person_major').val(person.get('major'));
			$('#person_department').val(person.get('department'));
			$('#person_college').val(person.get('college'));
			$('#person_address').val(person.get('address'));
			$('#person_interests').val(person.get('interests'));
			$('#person_introduction').val(person.get('introduction'));
		}
	};
	
	return ProjectDetailMembersView;
});