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
			$(this.el).append('<div class="project-status">'+project.get('status')+'</div>');
			
			//project image
			var img = '<img src="'+ util.baseUrl +'/res/images/my/project_pic_placeholder.jpg" alt="project image" class="img-rounded" />';
			$(this.el).append(img);
			
			//project info
			var info = 
				'<div class="info"> ' + 
				'	<h4 class="project-title">'+ project.get('title') +'</h4>' + 
				'	<p class="project-advisor">'+ project.get('advisor') +'</p>' + 
				'</div>';
			$(this.el).append(info);
			
		    return this;
		},
		
		select: function() {
			$('li.project-list-item-view').removeClass('active');
			$(this.el).addClass('active');
		
			var project = this.model;
			Backbone.trigger('ShowProjectDetail', project);
		}
	});
	
	return ProjectListItemView;
});