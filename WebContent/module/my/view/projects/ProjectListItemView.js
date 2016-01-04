define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation',
         'view/projects/ProjectDetailView'
       ], 
    function(Backbone, util, i18n, ProjectDetailView) {
	var ProjectListItemView = Backbone.View.extend({
		
		tagName: 'li',
		
		className: 'project-list-item-view',
		
		events: {
			'click': 'select'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'unrender', 'select');
			
			//监听model变化
			this.model.bind('change', this.render);	
			this.model.bind('destroy', this.unrender);
			
			this.render();
		},
		
		render: function(){
			var project = this.model;
			
			//cid
			$(this.el).attr('cid', this.model.cid);
			
			//根据模板生成dom
			var projectItem_tpl = ProjectItem_template(project);
			$(this.el).html(projectItem_tpl);
			
		    return this;
		},
		
		unrender: function(){
			$(this.el).remove();
		},
		
		select: function() {
			$('li.project-list-item-view').removeClass('active');
			$(this.el).addClass('active');
		
			Backbone.trigger('ProjectDetailView:showProjectDetail', this.model);
		}
	});
	
	var ProjectItem_template = function(project) {
		//status view dom
		var status_tpl = '',
			status_class = '',
			status_content = '';
		switch(project.get('status')) {
			case 0: 
				status_class = 'ongoing';
				status_content = i18n.my.projects.ProjectListItemView.ONGOING;
				break;
			case 1: 
				status_class = 'completed';
				status_content = i18n.my.projects.ProjectListItemView.COMPLETE;
				break;
			default: 
				status_class = 'unclear';
				status_content = i18n.my.projects.ProjectListItemView.UNKNOWN;
				break;
		}
		status_tpl = '<div class="project-status ' + status_class + '">'+ status_content +'</div>';
		
		//logo view dom
		var logo_tpl = '<img src="'+ util.baseUrl + project.get('logo') + '" title="'+ project.get('title') +'" alt="project image" class="img-rounded" />';
	
		//info view dom
		var advisor = project.get('advisor');
		var info_tpl =  '<div class="info"> ' + 
						'	<h4 class="project-title" title="' + project.get('title') + '">'+ project.get('title') +'</h4>' + 
						'	<p class="project-advisor">' + advisor.nickname + '</p>' + 
						'</div>';
		
		return status_tpl + logo_tpl + info_tpl;
	};
	
	return ProjectListItemView;
});