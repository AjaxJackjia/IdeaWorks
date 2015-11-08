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
			var abstractContent = 'The goal of this project is to contribute to the development of a human-computer interaction environment in which the computer detects and tracks the user\'s emotional, motivational, cognitive and task states, and initiates communications based on this knowledge, rather than simply responding to user commands.';
			
			var $abstract = $('<div class="abstract-container well">');
			$abstract.append('<p>' + abstractContent + '</p>');
			
			var $actions = $('<div class="action">');
			$actions.append('<div class="edit-btn btn btn-default"><i class="fa fa-pencil"></i>     Edit Abstract</div>');
			
			$(this.el).append($abstract);
			$(this.el).append($actions);
			
		    return this;
		}
	});
	
	return ProjectDetailAbstractView;
});