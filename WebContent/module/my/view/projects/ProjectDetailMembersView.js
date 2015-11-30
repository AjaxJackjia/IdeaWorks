define([ 
         'backbone', 'util',
         //model
         'model/project/MemberCollection'
       ], 
    function(Backbone, util, MemberCollection) {
	var ProjectDetailMembersView = Backbone.View.extend({
		
		className: 'project-detail-members-view',
		
		events: {
			'click .member-action > a.add-member': 'inviteMember'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addMember', 'inviteMember');
			
			//监听model变化
			this.model.bind('add', this.addMember);
		},
		
		render: function(){
			var $advisor = $('<div class="advisor well">');
			var $advisorTitle = $('<div class="advisor-title">Advisor</div>');
			var $advisorContent = $('<div class="advisor-content"></div>');
			$advisorContent.append('<div class="placeholder"><h4>No advisor...</h4></div>');
			$advisor.append($advisorTitle);
			$advisor.append($advisorContent);
			
			var $members = $('<div class="members well">');
			var $membersTitle = $('<div class="members-title">Members</div>');
			var $membersContent = $('<div class="members-content"></div>');
			$membersContent.append('<div class="placeholder"><h4>No members...</h4></div>');
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
		inviteMember: function(member) {
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
		}
	});
	
	var MemberItem = function(member) {
		var $tpl = 
			'<a class="member"> ' + 
        	'	<div class="member-photo"> ' +
        	'		<img class="img-circle" src="' + util.baseUrl + member.get('logo') + '"> ' +
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
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'invite', 'addCandidate');
			
			//加载advisor candidates
			this.candidates = new MemberCollection();
			this.candidates.url = '/IdeaWorks/api/users';
			
			//监听model变化
			this.candidates.bind('add', this.addCandidate);
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
			
			//invite操作
			$('.invite', $modalDialogContent).on('click', function() {
				self.invite();
			});
			
			//加载candidate
			this.candidates.fetch({
				success: function() {
					$('.candidate-container .candidate').on('click', function(e) {
						$(e.target).closest('.candidate').toggleClass('active');
					});
				}
			});
			
			//绑定modal消失时出发的事件
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		addCandidate: function(candidate) {
			//判断该candidate是否在project的members里
			if(this.model.where({userid: candidate.get('userid')}).length == 0) {
				$('.candidate-container', this.el).append($(CandidateItem(candidate)));
			}
		},
		
		invite: function() {
			//将选中的candidate直接加到project member中,后期再加用户验证环节;
			var projectMembers = this.model;
			var newAddedMembers = new MemberCollection();
			newAddedMembers.url = projectMembers.url;
			
			//get invited members
			var $selectedItem = $('.candidate.active', this.el);
			var candidates = this.candidates;
			_.each($selectedItem, function(item, index) {
				var cid = $(item).attr('cid');
				var candidate = candidates.get(cid);
				newAddedMembers.add(candidate);
			});
			
			//更新新增的project member
			newAddedMembers.save({
				wait: true,
				success: function() {
					//更新成功后,将新增加的member添加到project member中,使其在页面中显示
					_.each(newAddedMembers.models, function(member, index) {
						projectMembers.add(member);
					});
					//关闭页面
					$('#add_member_sub_view').modal('toggle');
				},
				error: function() {
					alert('Add project member project failed. Please try again later!');
				}
			});
		}
	});
	
	var Header = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">Invite Members</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var Footer = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="button" class="cancel btn btn-default" data-dismiss="modal">Cancel</a> ' + 
			'	<a type="submit" class="invite btn btn-primary">Invite</a> ' + 
			'</div> ';
		return tpl;
	}
	
	var Body = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<div class="candidate-container well">'
			'	</div> ' + 
			'</div> ';
		return tpl;
	}
	
	var CandidateItem = function(candidate) {
		var $tpl = 
			'<a class="candidate" cid="' + candidate.cid + '"> ' + 
        	'	<div class="candidate-photo"> ' +
        	'		<img class="img-circle" src="' + util.baseUrl + candidate.get('logo') + '"> ' +
        	'	</div> ' +
		    '    <div class="info"> ' +
		    '      <h4> ' +
		    '          <span class="center" title="'+ candidate.get('nickname') +'">' + candidate.get('nickname') + '</span> ' +
		    '      </h4> ' +
		    '    </div> ' +
		    '</a>';
		return $tpl;
	};
	
	return ProjectDetailMembersView;
});