define([ 'backbone', 'headroom', 'util' ], function(Backbone, Headroom, util) {
	var ProjectView = Backbone.View.extend({
		
		className: 'project-container',
		
		initialize: function(){
			this.project = this.model;
		},
		
		render: function(){
			if(this.project == null) {
				var tpl404 = 
					'<div class="not-found">' +
					'	<h4 class="title">Project Not Found!</h4>' +
					'</div>';
				$(this.el).append(tpl404);
			}else{
				var $title = $('<h1>' + this.project.get('title') + '</h1>');
				var $time = $('<h3>' + this.project.get('time') + '</h3>');
				var $description = $('<p>' + this.project.get('content') + '</p>');
				var $more = $('<a href="' + this.project.get('directUrl') + '" target="_blank">Detail Information</a>');
				var imagesContent = 
					'<div class="row"><img class="img-thumbnail" src="'+ util.baseUrl +'/res/images/portal/projects/' + this.project.get('img') + '"></div>';
				var $images = $(imagesContent);
				
				$(this.el).append($title);
				$(this.el).append($time);
				$(this.el).append($description);
				$(this.el).append($more);
				$(this.el).append($images);
			}
			
			return this;
		}
	});
	
	return ProjectView;
});