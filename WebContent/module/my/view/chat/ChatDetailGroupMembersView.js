define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation',
         'model/chat/MemberCollection'
       ], 
    function(Backbone, util, i18n, MemberCollection) {
	var ChatDetailGroupMembersView = Backbone.View.extend({
		
		className: 'chat-detail-group-members-view',
		
		initialize: function() {
			_.bindAll(this, 'render', 'unrender', 'show', 'hide');
			
			//chat
			this.chat = this.model;
			//chat messages
			this.members = new MemberCollection();
			this.members.url = this.model.url + '/members';
		},
		
		render: function(){
			var self = this;
			var $container = $('<div class="members">');
			
			this.members.fetch({
				success: function() {
					if(self.members.length == 0) {
						$container.html('No members...');
					}else{
						_.each(self.members.models, function(member, index) {
							$container.append(self.generateMemberItem(member));
						});
					}
				},
				error: function(model, response, options) {
					util.commonErrorHandler(response.responseJSON, 'Get internal messages members failed. Please try again later!');
				}
			});
			
			$(this.el).html($container);
			
			return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		show: function() {
			$('.chat-container').append($(this.render().el));
		},
		
		hide: function() {
			this.unrender();
		},
		
		generateMemberItem: function(member) {
			var tpl = 
				'<a class="member" cid="' + member.cid + '"> ' + 
	        	'	<div class="member-photo"> ' +
	        	'		<img class="img-circle" src="' + member.get('logo') + '"> ' +
	        	'	</div> ' +
			    '    <div class="info"> ' +
			    '      <h4> ' +
			    '          <div class="center" title="'+ member.get('nickname') +'">' + member.get('nickname') + '</div> ' +
			    '      </h4> ' +
			    '      <h4> ' +
			    '          <div class="center" title="'+ member.get('userid') +'">(' + member.get('userid') + ')</div> ' +
			    '      </h4> ' +
			    '    </div> ' +
			    '</a>';
			return tpl;
		}
	});
	
	return ChatDetailGroupMembersView;
});