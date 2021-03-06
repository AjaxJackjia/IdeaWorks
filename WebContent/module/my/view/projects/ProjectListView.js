define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation',
         'view/projects/ProjectListItemView'
       ], 
    function(Backbone, util, i18n, ProjectListItemView) {
	var ProjectListView = Backbone.View.extend({
		
		className: 'project-list-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addProjectItem', 'removeProjectItem', 'createProject', 'deleteProject', 'exitProject');
			
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
			Backbone.
				off('ProjectListView:exitProject').
				on('ProjectListView:exitProject', this.exitProject, this);
			
			this.render();
		},
		
		render: function(){
			//project list content
			var $content = $('<ul class="project-list-content">');
			$content.append('<div class="empty-place-holder"><h4>' + i18n.my.projects.ProjectListView.NO_PROJECTS + '</h4></div>');
			$(this.el).append($content);
			
		    return this;
		},
		
		//method: 添加project元素到list(UI)头部
		addProjectItem: function(project) {
			//设置每个project model的url
			project.url = this.model.url + '/' + project.get('projectid');
			
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
				$('.project-list-content', this.el).append('<div class="empty-place-holder"><h4>' + i18n.my.projects.ProjectListView.NO_PROJECTS + '</h4></div>');
			}
		},
		
		//创建新的project
		createProject: function(project) {
			var projectList = this.model;
			projectList.create(project, {
				 wait: true, 
				 success: function() {	 
					 //默认选中最新创建的project item
					 $($('.project-list-content > li')[0]).click();
				 }, 
				 error: function(model, response, options) {
					var alertMsg = i18n.my.projects.ProjectListView.CREATE_PROJECT_ERROR;
					util.commonErrorHandler(response.responseJSON, alertMsg);
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
				error: function(model, response, options) {
					var alertMsg = i18n.my.projects.ProjectListView.DELETE_PROJECT_ERROR;
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
		},
		
		//退出project
		exitProject: function(project) {
			var projectList = this.model;
			project.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + project.id + '/exit';
			projectList.get(project.cid).destroy({
				wait: true, 
				success: function() {
					//从list中删除project
					projectList.remove(project);
				},
				error: function(model, response, options) {
					var alertMsg = i18n.my.projects.ProjectListView.EXIT_PROJECT_ERROR;
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
		},
	});
	
	return ProjectListView;
});