define([ 
         'backbone', 'util',
         //view
         'view/projects/ProjectDetailAbstractView',
         'view/projects/ProjectDetailMembersView',
         'view/projects/ProjectDetailMilestoneView',
         'view/projects/ProjectDetailForumView',
         'view/projects/ProjectDetailFilesView',
         'view/projects/ProjectDetailActivityView',
         'view/projects/ProjectDetailModifyView',
         //model
 		'model/project/MemberCollection',
 		'model/project/MilestoneCollection',
 		'model/project/TopicCollection',
 		'model/project/FileCollection',
 		'model/project/ActivityCollection'
       ], 
    function(Backbone, util,
    		//view
    		ProjectDetailAbstractView,
    		ProjectDetailMembersView,
    		ProjectDetailMilestoneView,
    		ProjectDetailForumView,
    		ProjectDetailFilesView,
    		ProjectDetailActivityView,
    		ProjectDetailModifyView,
    		//model
    		MemberCollection,
    		MilestoneCollection,
    		TopicCollection,
    		FileCollection,
    		ActivityCollection) {
	var ProjectDetailView = Backbone.View.extend({
		
		className: 'project-detail-view',
		
		events: {
			'click .project-menu>li': 'tabClick',
			'click .modify-project': 'modifyProject',
			'click .logo-project': 'logoProject',
			'click .delete-project': 'deleteProject'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'unrender', 'projectChange', 
							'tabClick', 'modifyProject',
							'logoProject', 'deleteProject');
			
			//view 全局变量
			this.initFlag = true; //标识是否为第一次render
			
			//注册全局事件
			Backbone.
				off('ProjectDetailView:showProjectDetail').
				on('ProjectDetailView:showProjectDetail', this.projectChange, this);
			
			this.render();
		},
		
		render: function(){
			if(this.initFlag == true || this.model == null) {
				var $emtpy_placeholder = $('<div class="empty-place-holder"></div>');
				$emtpy_placeholder.append('<h4>No project selected...</h4>');
				$(this.el).html($emtpy_placeholder);
				
				//reset init flag
				this.initFlag = false;
			}else{
				//根据模板生成dom
				var projectDetail_tpl = ProjectDetail_template(this.model);
				$(this.el).html(projectDetail_tpl);
				
				//detail menu concrete views
				var abstractView = new ProjectDetailAbstractView({
					model: this.model
				});
				$(this.el).find('#abstract').html(abstractView.render().el);
			}

			return this;
		},
		
		unrender: function() {
			var $emtpy_placeholder = $('<div class="empty-place-holder"></div>');
			$emtpy_placeholder.append('<h4>No project selected...</h4>');
			$(this.el).html($emtpy_placeholder);
		},
		
		projectChange: function(project) {
			this.model = project;
			
			//监听model变化
			this.model.bind('change', this.render);	
			this.model.bind('destroy', this.unrender);
			
			this.render();
		},
		
		tabClick: function(event) {
			var currentProject = this.model;
			var target = $(event.target).html();
			
			//第一次点击tab时创建页面并加载(abstract tab页除外)
			if(target == 'Members' && $('#members').html() == "") {
				//members model
				var members = new MemberCollection();
				members.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + currentProject.get('projectid') + '/members';
				members.fetch();
				//members view
				var membersView = new ProjectDetailMembersView({
					model: members
				});
				$(this.el).find('#members').html(membersView.render().el);
			}else if(target == 'Milestone' && $('#milestone').html() == "") {
				//milestone model
				var milestones = new MilestoneCollection();
				milestones.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + currentProject.get('projectid') + '/milestones';
				milestones.fetch();
				//milestone view
				var milestoneView = new ProjectDetailMilestoneView({
					model: milestones
				});
				$(this.el).find('#milestone').html(milestoneView.render().el);
			}else if(target == 'Forum' && $('#forum').html() == "") {
				//topic model
				var topics = new TopicCollection();
				topics.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + currentProject.get('projectid') + '/topics';
				topics.fetch();
				//topic view
				var forumView = new ProjectDetailForumView({
					model: topics
				});
				$(this.el).find('#forum').html(forumView.render().el);
			}else if(target == 'Files' && $('#files').html() == "") {
				//file model
				var files = new FileCollection();
				files.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + currentProject.get('projectid') + '/files';
				files.fetch();
				//file view
				var filesView = new ProjectDetailFilesView({
					model: files
				});
				$(this.el).find('#files').html(filesView.render().el);
			}else if(target == 'Activity' && $('#activity').html() == "") {
				//activity model
				var activities = new ActivityCollection();
				activities.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + currentProject.get('projectid') + '/activities';
				activities.fetch();
				//activity view
				var activityView = new ProjectDetailActivityView({
					model: activities
				});
				$(this.el).find('#activity').html(activityView.render().el);			
			}
		},
		
		//修改project基本信息
		modifyProject: function() {
			//将旧的modal view移除,新的modal view添加到内容区域
			var projectDetailModify = new ProjectDetailModifyView({
				model: this.model
			});
			
			var $modifyView = $('#project_detail_modify_view');
			if($modifyView.length > 0) {
				$('#project_detail_modify_view').remove();
			}
			$('.content-panel').append($(projectDetailModify.render().el));
			
			//显示view
			$('#project_detail_modify_view').modal('toggle');
		},
		
		//修改project logo
		logoProject: function() {
			alert('logo!');
		},
		
		//删除project
		deleteProject: function() {
			if(confirm('Do you want to delete this project?')) {
				Backbone.trigger('ProjectListView:deleteProject', this.model);
			}
		}
	});
	
	var ProjectDetail_template = function(project) {
		//project detail header
		var advisor = project.get('advisor');
		var header_tpl = 
			'<div class="project-header">' + 
			'	<div class="actions">' + 
			'		<a class="modify-project btn btn-default"> ' + 
			'			<i class="fa fa-pencil"></i> Edit' +
			'		</a>' + 
			'		<a class="logo-project btn btn-default"> ' + 
			'			<i class="fa fa-flag"></i> Logo' +
			'		</a>' + 
			'		<a class="delete-project btn btn-default"> ' + 
			'			<i class="fa fa-trash"></i> Delete' +
			'		</a>' + 
			'	</div>' + 
			'	<div class="content">' + 
			'		<img src="' + util.baseUrl + project.get('logo') + '" alt="' + project.get('title') + '" class="img-rounded" />' +
			'		<div class="info"> ' + 
			'			<h4 class="project-title">' + project.get('title') + '</h4>' + 
			'			<p class="project-advisor">Advisor: ' + advisor.nickname + '</p>' + 
			'			<p class="project-createtime">Create time: ' + util.timeformat(new Date(project.get('createtime')), 'smart') + '</p>' + 
			'		</div>' +
			'	</div>' + 
			'</div>';
		
		//project detail menu 
		var menu_tpl = 
			'<ul class="project-menu nav nav-tabs" role="tablist">' + 
			'  <li role="presentation" class="active">' + 
			'		<a href="#abstract" aria-controls="abstract" role="tab" data-toggle="tab">Abstract</a>' + 
			'  </li>' + 
			'  <li role="presentation">' + 
			'  		<a href="#members" aria-controls="members" role="tab" data-toggle="tab">Members</a>' + 
			'  </li>' + 
			'  <li role="presentation">' + 
			'		<a href="#milestone" aria-controls="milestone" role="tab" data-toggle="tab">Milestone</a>' + 
			'  </li>' + 
			'  <li role="presentation">' + 
			'		<a href="#forum" aria-controls="forum" role="tab" data-toggle="tab">Forum</a>' + 
			'  </li>' + 
			'  <li role="presentation">' + 
			'		<a href="#files" aria-controls="files" role="tab" data-toggle="tab">Files</a>' + 
			'  </li>' + 
			'  <li role="presentation">' + 
			'		<a href="#activity" aria-controls="activity" role="tab" data-toggle="tab">Activity</a>' + 
			'  </li>' + 
			'</ul>';
		
		//project detail content
		var content_tpl = 
			'<div class="project-content tab-content">' + 
			'  <div role="tabpanel" class="tab-pane fade in active" id="abstract"></div>' + 
			'  <div role="tabpanel" class="tab-pane fade" id="members"></div>' + 
			'  <div role="tabpanel" class="tab-pane fade" id="milestone"></div>' + 
			'  <div role="tabpanel" class="tab-pane fade" id="forum"></div>' + 
			'  <div role="tabpanel" class="tab-pane fade" id="files"></div>' + 
			'  <div role="tabpanel" class="tab-pane fade" id="activity"></div>' + 
			'</div>';
		
		return header_tpl + menu_tpl + content_tpl;
	};

	return ProjectDetailView;
});