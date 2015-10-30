define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var ProjectDetailForumView = Backbone.View.extend({
		
		className: 'project-detail-forum-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
		},
		
		render: function(){
			
		    return this;
		}
	});
	
	return ProjectDetailForumView;
});