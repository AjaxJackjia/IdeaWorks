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
			var icon_base = 'http://localhost:8888/IdeaWorks/res/images/my/user/';
			var users = [
			             	'darryl', 'dorthy', 'harry', 'jackjia', 
			             	'kendall', 'kylee', 'lila', 'stacy', 'stefan'
			            ];
			
			var $advisor = $('<div class="advisor well">');
			var $advisorTitle = $('<div class="advisor-title">Advisor</div>');
			var $advisorContent = $('<div class="advisor-content"></div>');
			$advisorContent.append(memberItem({
				icon: icon_base + 'jackjia' + '.png',
				name: 'jackjia'
			}));
			$advisor.append($advisorTitle);
			$advisor.append($advisorContent);
			
			var $members = $('<div class="members well">');
			var $membersTitle = $('<div class="members-title">Members</div>');
			var $membersContent = $('<div class="members-content"></div>');
			for(var index = 0;index<users.length;index++) {
				$membersContent.append(memberItem({
					icon: icon_base + users[index] + '.png',
					name: users[index]
				}));
			}
			$members.append($membersTitle);
			$members.append($membersContent);
			
			//advisor actions
			var $action_delegate = $('<div class="member-action">');
			$action_delegate.append('<a class="btn btn-default" href="javascript:;"><i class="fa fa-apple"></i></a>');
			$advisorContent.append($action_delegate);
			
			//member actions
			var $action_add = $('<div class="member-action">');
			$action_add.append('<a class="btn btn-default" href="javascript:;"><i class="fa fa-plus"></i></a>');
			$membersContent.append($action_add);
			
			$(this.el).append($advisor);
			$(this.el).append($members);
			
		    return this;
		}
	});
	
	var memberItem = function(member) {
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