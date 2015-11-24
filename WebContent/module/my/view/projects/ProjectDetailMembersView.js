define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var ProjectDetailMembersView = Backbone.View.extend({
		
		className: 'project-detail-members-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addMember');
			
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
		
		addMember: function(member) {
			if(member.get('advisor')) {
				var $content = $(this.el).find('.advisor-content');
				var $placeholder = $content.find('.placeholder');
				if($placeholder.length > 0) {
					$placeholder.remove();
				}
				$content.append(memberItem(member));
			}
			
			var $content = $(this.el).find('.members-content');
			var $placeholder = $content.find('.placeholder');
			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			var memberDom = memberItem(member);
			$(memberDom).insertBefore('.member-action');
		}
	});
	
	var memberItem = function(member) {
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
	
	return ProjectDetailMembersView;
});