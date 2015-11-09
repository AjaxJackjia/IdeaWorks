define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var ProjectDetailAbstractView = Backbone.View.extend({
		
		className: 'project-detail-abstract-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
		},
		
		render: function(){
			var project = this.model;
			
			var $abstract = $('<div class="abstract-container well">');
			$abstract.append('<p>' + project.get('abstractContent') + '</p>');
			
			var $actions = $('<div class="action">');
			$actions.append('<div class="edit-btn btn btn-default"><i class="fa fa-pencil"></i>     Edit Abstract</div>');
			
			$(this.el).append($abstract);
			$(this.el).append($actions);
			
		    return this;
		}
	});
	
	return ProjectDetailAbstractView;
});