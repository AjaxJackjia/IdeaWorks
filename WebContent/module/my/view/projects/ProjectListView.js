define([ 
         'backbone', 'util', 'view/projects/ProjectListItemView'
       ], 
    function(Backbone, util, ProjectListItemView) {
	var ProjectListView = Backbone.View.extend({
		
		className: 'project-list-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addProjectItem', 'removeProjectItem', 'createProject');
			
			//监听model变化
			this.model.bind('add', this.addProjectItem);			//add model at the top of the list(UI)
			this.model.bind('remove', this.removeProjectItem);		//remove model from the list(UI)
			
			//注册全局事件
			Backbone.
				off('ProjectListView:createProject').
				on('ProjectListView:createProject', this.createProject, this);
			Backbone.
				off('ProjectListView:deleteProject').
				on('ProjectListView:deleteProject', this.deleteProject, this);
			
			this.render();
		},
		
		render: function(){
			//project list content
			var $content = $('<ul class="project-list-content">');
			$content.append('<div class="empty-place-holder"><h4>No projects...</h4></div>');
			$(this.el).append($content);
			
		    return this;
		},
		
		//method: 添加project元素到list(UI)头部
		addProjectItem: function(project) {
			var $placeholder = $('.project-list-content > .empty-place-holder', this.el);
			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			
			var porjectItem = new ProjectListItemView({
				model: project
			});
			$('.project-list-content', this.el).prepend($(porjectItem.el));
		},
		
		//method: 从UI列表中删除project元素
		removeProjectItem: function(project) {
			_.each($('.project-list-content > li', this.el), function(element, index, list){ 
				if($(element).attr('cid') == project.cid) {
					$(element).remove();
				}
			});
			
			//if list is empty, then add placeholder 
			if($('.project-list-content > li', this.el).length == 0) {
				$('.project-list-content', this.el).append('<div class="empty-place-holder"><h4>No projects...</h4></div>');
			}
		},
		
		//创建新的project
		createProject: function(project) {
			var projectList = this.model;
			projectList.create(project, {
				 wait: true, 
				 success: function() {
					 //添加project到list
					 projectList.add(project);
					 
					 //默认选中最新创建的project item
					 $($('.project-list-content > li')[0]).click();
				 }, 
				 error: function() {
					 alert('Create project failed. Please try again later!');
				 }
			});
		},
		
		//删除project
		deleteProject: function(project) {
			var projectList = this.model;
			project.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + project.id;
			projectList.get(project.cid).destroy({
				wait: true, 
				success: function() {
					//从list中删除project
					projectList.remove(project);
				},
				error: function() {
					alert('Delete project failed. Please try again later!');
				}
			});
		}
	});
	
	return ProjectListView;
});