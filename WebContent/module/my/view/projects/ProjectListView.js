define([ 
         'backbone', 'util', 'view/projects/ProjectListItemView'
       ], 
    function(Backbone, util, ProjectListItemView) {
	var ProjectListView = Backbone.View.extend({
		
		className: 'project-list-view',
		
		initialize: function(){
			_.bindAll(this, 'render', 'addProject', 'emtpyList');
			
			this.render();
		},
		
		render: function(){
			var me = this;
			var listModel = this.model;
			
			//project list content
			$(this.el).append('<ul class="project-list-content">');
			//根据列表内容是否为空来分别填充
			if(listModel.length > 0) {
				_.each(listModel.models, function(project){
					me.addProject(project);
				});
			}else{
				me.emtpyList();
			}
			
		    return this;
		},
		
		//method: 添加project元素到list中(UI)
		addProject: function(project) {
			var porjectItem = new ProjectListItemView({
				model: project
			});
			$(this.el).find('ul').append($(porjectItem.el));
		},
		
		//method: list 为空时的占位符
		emtpyList: function() {
			var $emtpy_placeholder = $('<div class="empty-place-holder"></div>');
			$emtpy_placeholder.append('<h4>Please create new project...</h4>');
			$(this.el).find('ul').html($emtpy_placeholder);
		}
	});
	
	return ProjectListView;
});