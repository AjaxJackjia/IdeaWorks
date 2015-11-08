define([ 
         'backbone', 'util',
         'view/projects/ProjectDetailAbstractView',
         'view/projects/ProjectDetailMembersView',
         'view/projects/ProjectDetailMilestoneView',
         'view/projects/ProjectDetailForumView',
         'view/projects/ProjectDetailFilesView',
         'view/projects/ProjectDetailActivityView',
       ], 
    function(Backbone, util,
    		ProjectDetailAbstractView,
    		ProjectDetailMembersView,
    		ProjectDetailMilestoneView,
    		ProjectDetailForumView,
    		ProjectDetailFilesView,
    		ProjectDetailActivityView) {
	var ProjectDetailView = Backbone.View.extend({
		
		className: 'project-detail-view',
		
		initialize: function(){
			_.bindAll(this, 'render', 'show');
			
			//注册全局事件
			Backbone.off('ShowProjectDetail').on('ShowProjectDetail', this.show, this);
			
			//model监听事件
			this.model.bind('change', this.render);
			
			this.render();
		},
		
		render: function(){
			var project = this.model;
				
			if(project.get('isEmpty') == true) {
				var $emtpy_placeholder = $('<div class="empty-place-holder"></div>');
				$emtpy_placeholder.append('<h4>No project selected...</h4>');
				$(this.el).html($emtpy_placeholder);
			}else{
				//清空
				$(this.el).html('');
				
				//project detail header
				var project_header = 
					'<div class="project-header">' + 
					'	<div class="actions">' + 
					'		<a class="btn btn-default"> ' + 
					'			<i class="fa fa-pencil"></i> Edit' +
					'		</a>' + 
					'	</div>' + 
					'	<div class="content">' + 
					'		<img src="'+ util.baseUrl +'/res/images/my/project_pic_placeholder.jpg" alt="project image" class="img-rounded" />' +
					'		<div class="info"> ' + 
					'			<h4 class="project-title">'+ project.get('title') +'</h4>' + 
					'			<p class="project-advisor">Advisor: '+ project.get('advisor') +'</p>' + 
					'		</div>' +
					'	</div>' + 
					'</div>';
				$(this.el).append(project_header);
				
				//project detail menu
				var project_menu = 
					'<!-- Nav tabs -->' + 
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
				$(this.el).append(project_menu);
				
				//project detail content
				var project_content = 
					'<!-- Tab panes -->' + 
					'<div class="project-content tab-content">' + 
					'  <div role="tabpanel" class="tab-pane active" id="abstract"></div>' + 
					'  <div role="tabpanel" class="tab-pane" id="members"></div>' + 
					'  <div role="tabpanel" class="tab-pane" id="milestone"></div>' + 
					'  <div role="tabpanel" class="tab-pane" id="forum"></div>' + 
					'  <div role="tabpanel" class="tab-pane" id="files"></div>' + 
					'  <div role="tabpanel" class="tab-pane" id="activity"></div>' + 
					'</div>'; 
				$(this.el).append(project_content);
				
				var abstractView = new ProjectDetailAbstractView();
				var membersView = new ProjectDetailMembersView();
				var milestoneView = new ProjectDetailMilestoneView();
				var forumView = new ProjectDetailForumView();
				var filesView = new ProjectDetailFilesView();
				var activityView = new ProjectDetailActivityView();
				
				$(this.el).find('#abstract').append(abstractView.render().el);
				$(this.el).find('#members').append(membersView.render().el);
				$(this.el).find('#milestone').append(milestoneView.render().el);
				$(this.el).find('#forum').append(forumView.render().el);
				$(this.el).find('#files').append(filesView.render().el);
				$(this.el).find('#activity').append(activityView.render().el);
			}
			
		    return this;
		},
		
		show: function(project) {
			this.model.set(project);
			console.log("show project detail!");
		}
	});
	
	return ProjectDetailView;
});