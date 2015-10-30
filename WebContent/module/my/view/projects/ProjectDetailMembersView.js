define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var ProjectDetailMembersView = Backbone.View.extend({
		
		className: 'project-detail-members-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
		},
		
		render: function(){
			var $advisor = $('<div class="advisor well">');
			var $advisorTitle = $('<div class="advisor-title">Advisor</div>');
			var $advisorContent = $('<div class="advisor-content"></div>');
			$advisorContent.append(memberItem({ }));
			$advisor.append($advisorTitle);
			$advisor.append($advisorContent);
			
			var $members = $('<div class="members well">');
			var $membersTitle = $('<div class="members-title">Members</div>');
			var $membersContent = $('<div class="members-content"></div>');
			for(var index = 0;index< 20;index++) {
				$membersContent.append(memberItem({ }));
			}
			$members.append($membersTitle);
			$members.append($membersContent);
			
			var $actions = $('<div class="action">');
			$actions.append('<a class="add btn btn-sm btn-success" href="javascript:;">add member</a>');
			
			$(this.el).append($advisor);
			$(this.el).append($members);
			$(this.el).append($actions);
			
		    return this;
		}
	});
	
	var memberItem = function(member) {
		member.icon = 'https://recruitee.com/uploads/candidates/98152/thumb_photo_1445852652.png';
		member.name = 'Jerry Thompson';
		
		var $tpl = 
			'<a class="member"> ' + 
        	'	<div class="member-photo"> ' +
        	'		<img class="img-circle" src="' + member.icon + '"> ' +
        	'	</div> ' +
		    '    <div class="info"> ' +
		    '      <h4> ' +
		    '          <span class="center">' + member.name + '</span> ' +
		    '      </h4> ' +
		    '    </div> ' +
		    '</a>';
		return $tpl;
	};
	
	return ProjectDetailMembersView;
});