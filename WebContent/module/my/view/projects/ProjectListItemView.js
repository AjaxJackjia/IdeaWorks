define([ 
         'backbone', 'util', 'view/projects/ProjectDetailView'
       ], 
    function(Backbone, util, ProjectDetailView) {
	var ProjectListItemView = Backbone.View.extend({
		
		tagName: 'li',
		
		className: 'project-list-item-view',
		
		events: {
			'click': 'select'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'select');
			
			this.render();
		},
		
		render: function(){
			var project = this.model;
			
			//project status
			var project_status = genProjectStatus(project.get('status'));
			$(this.el).append(project_status);
			
			//project image
			var project_img = genProjectLogo(project.get('title'), project.get('logo'));
			$(this.el).append(project_img);
			
			//project info
			var project_info = genProjectInfo(project.get('title'), project.get('advisor'));
			$(this.el).append(project_info);
			
		    return this;
		},
		
		select: function() {
			$('li.project-list-item-view').removeClass('active');
			$(this.el).addClass('active');
		
			var project = this.model;
			Backbone.trigger('ShowProjectDetail', project);
		}
	});
	
	var genProjectStatus = function(status) {
		var content = '';
		switch(status) {
			case 0: content = 'ongoing';break;
			case 1: content = 'completed';break;
			default: content = 'unclear';
		}
		
		return '<div class="project-status">'+ content +'</div>';
	};
	
	var genProjectLogo = function(title, logo) {
		return '<img src="'+ util.baseUrl + logo + '" title="'+ title +'" alt="project image" class="img-rounded" />';
	};
	
	var genProjectInfo = function(title, advisor) {
		return '<div class="info"> ' + 
				'	<h4 class="project-title" title="' + title + '">'+ title +'</h4>' + 
				'	<p class="project-advisor">' + advisor + '</p>' + 
				'</div>';
	};
	
	return ProjectListItemView;
});