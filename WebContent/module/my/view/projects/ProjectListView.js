define([ 
         'backbone', 'util', 'view/projects/ProjectListItemView'
       ], 
    function(Backbone, util, ProjectListItemView) {
	var ProjectListView = Backbone.View.extend({
		
		className: 'project-list-view',
		
		initialize: function(){
			_.bindAll(this, 'render', 'addProject');
			
			this.render();
		},
		
		render: function(){
			var me = this;
			var listModel = this.model;
			
			//project list title
			var project_list_title = 
				'<div class="project-list-title">' + 
				'	<div class="project-list-title-content">Project List</div>' + 
				'	<div class="project-create-icon glyphicon glyphicon-plus"></div>'
				'</div>'; 
			$(this.el).append(project_list_title);
			
			//project list content
			$(this.el).append('<ul class="project-list-content">');
			_.each(listModel.models, function(project){
				me.addProject(project);
			});
			
		    return this;
		},
		
		//method: 添加project元素到list中(UI)
		addProject: function(project) {
			var porjectItem = new ProjectListItemView({
				model: project
			});
			$(this.el).find('ul').append($(porjectItem.el));
		}
	});
	
	return ProjectListView;
});