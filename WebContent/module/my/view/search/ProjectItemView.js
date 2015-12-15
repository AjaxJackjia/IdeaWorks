define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util, ProjectCollection) {
	var ProjectItemView = Backbone.View.extend({
		
		className: 'project-item-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender');
		},
		
		render: function(){
			//set item cid
			$(this.el).attr('cid', this.model.cid);
			
			var projectItem = Item(this.model);
			$(this.el).append(projectItem);
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		}
	});
	
	var Item = function(project) {
		//status view dom
		var status_content = '';
		switch(project.get('status')) {
			case 0: status_content = 'ongoing';break;
			case 1: status_content = 'completed';break;
			default: status_content = 'unclear'; break;
		}
		
		var action_tpl = '<div class="project-action">' + 
						 '	<a class="view-project btn btn-default">Detail</a>' + 
						 '	<a class="join-project btn btn-default">Join</a>' + 
						 '</div>';
		
		var logo_tpl = '<img src="'+ util.baseUrl + project.get('logo') + '" title="'+ project.get('title') +'" alt="project image" class="img-rounded" />';
		
		var info_tpl = 
					'<div class="info"> ' + 
					'	<h4 class="project-title" title="' + project.get('title') + '">'+ project.get('title') +'</h4>' + 
					'	<p class="project-status">' + status_content + '</p>' + 
					'	<p class="project-createtime">create at ' + util.timeformat(new Date(project.get('createtime')), 'smart') + '</p>' + 
					'</div>';
		
		return action_tpl + logo_tpl + info_tpl;
	};
	
	return ProjectItemView;
});