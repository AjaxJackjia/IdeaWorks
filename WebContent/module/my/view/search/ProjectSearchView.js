define([ 
         'backbone', 'util',
         //view
         'view/search/ProjectItemView',
         //model
         'model/search/ProjectCollection'
       ], 
    function(Backbone, util, ProjectItemView, ProjectCollection) {
	var ProjectSearchView = Backbone.View.extend({
		
		className: 'project-search-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'addProjects');
			
			this.projects = new ProjectCollection();
		},
		
		render: function(){
			$(this.el).html('');
			
			if(this.projects.length == 0) {
				this.clean();
			}else{
				this.addProjects();
			}
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		search: function() {
			var searchTxt = $.trim($('.search-input > input').val());
			
			this.projects.fetch({
				data: { key: searchTxt},
				success: this.render,
				error: function(model, response, options) {
					var alertMsg = 'Search projects failed. Please try again later!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
		},
		
		clean: function() {
			$(this.el).html(Placeholder('Search Project No result...'));
		},
		
		addProjects: function() {
			var self = this;
			_.each(this.projects.models, function(project, index) {
				var projectItemView = new ProjectItemView({
					model: project
				});
				$(self.el).append($(projectItemView.render().el));
			});
		}
	});
	
	var Placeholder = function(msg) {
		return '<div class="placeholder"><h4>' + msg + '</h4></div>';
	};
	
	return ProjectSearchView;
});