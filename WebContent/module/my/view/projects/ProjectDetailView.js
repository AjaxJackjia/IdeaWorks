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
				members.fetch({
					error: function(model, response, options) {
			    		var alertMsg = 'Fetch project members failed. Please try again later!';
						util.commonErrorHandler(response.responseJSON, alertMsg);
		    		}
				});
				//members view
				var membersView = new ProjectDetailMembersView({
					model: members
				});
				$(this.el).find('#members').html(membersView.render().el);
			}else if(target == 'Milestone' && $('#milestone').html() == "") {
				//milestone model
				var milestones = new MilestoneCollection();
				milestones.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + currentProject.get('projectid') + '/milestones';
				milestones.fetch({
					error: function(model, response, options) {
			    		var alertMsg = 'Fetch project milestones failed. Please try again later!';
						util.commonErrorHandler(response.responseJSON, alertMsg);
		    		}
				});
				//milestone view
				var milestoneView = new ProjectDetailMilestoneView({
					model: milestones
				});
				$(this.el).find('#milestone').html(milestoneView.render().el);
			}else if(target == 'Forum' && $('#forum').html() == "") {
				//topic model
				var topics = new TopicCollection();
				topics.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + currentProject.get('projectid') + '/topics';
				topics.fetch({
					error: function(model, response, options) {
			    		var alertMsg = 'Fetch project topics failed. Please try again later!';
						util.commonErrorHandler(response.responseJSON, alertMsg);
		    		}
				});
				//topic view
				var forumView = new ProjectDetailForumView({
					model: topics
				});
				$(this.el).find('#forum').html(forumView.render().el);
			}else if(target == 'Files' && $('#files').html() == "") {
				//file model
				var files = new FileCollection();
				files.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + currentProject.get('projectid') + '/files';
				files.fetch({
					error: function(model, response, options) {
			    		var alertMsg = 'Fetch project files failed. Please try again later!';
						util.commonErrorHandler(response.responseJSON, alertMsg);
		    		}
				});
				//file view
				var filesView = new ProjectDetailFilesView({
					model: files
				});
				$(this.el).find('#files').html(filesView.render().el);
			}else if(target == 'Activity') {//每次点击activity tab的时候都刷新
				//activity model
				var activities = new ActivityCollection();
				activities.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + currentProject.get('projectid') + '/activities';
				activities.fetch({
					error: function(model, response, options) {
			    		var alertMsg = 'Fetch project activities failed. Please try again later!';
						util.commonErrorHandler(response.responseJSON, alertMsg);
		    		}
				});
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
			var logoUploadSubView = new LogoUploadSubView({
				model: this.model
			});
			var $logoView = $('#logo_upload_sub_view');
			if($logoView.length > 0) {
				$('#logo_upload_sub_view').remove();
			}
			$('.content-panel').append($(logoUploadSubView.render().el));
			
			//显示view
			$('#logo_upload_sub_view').modal('toggle');
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
	
	/*
	 * Project logo upload sub view
	 * */
	var LogoUploadSubView = Backbone.View.extend({
		
		id: 'logo_upload_sub_view',
		
		className: 'logo-upload-sub-view modal fade',
		
		events: {
			'click .upload-logo': 'upload'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'upload');
		},
		
		render: function(){
			var $modalDialog = $('<div class="modal-dialog" role="document">');
			var $modalDialogContent = $('<div class="modal-content">');
			$modalDialog.append($modalDialogContent);
			
			var header = Header();
			$modalDialogContent.append(header);
			
			var body = Body();
			$modalDialogContent.append(body);
			
			var footer = Footer();
			$modalDialogContent.append(footer);
			
			$(this.el).append($modalDialog);
			
			//绑定modal消失时出发的事件
			var self = this;
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		//上传file
		upload: function() {
			//当前project model
			var projectModel = this.model;
			
			//validate
			if(!this.validate()) {
				return;
			}
			
			//创建file model
			var fileDom = document.getElementById("upload_logo_input");
			//因为backbone post请求默认是"application/x-www-form-urlencoded"，所以在这里需要重写上传logo的方法
			var data = new FormData();
			data.append('logo', fileDom.files[0]);
			
			$.ajax({
			    url: projectModel.url + '/logo',
			    data: data,
			    cache: false,
			    contentType: false,
			    processData: false,
			    type: 'POST',
			    success: function(data){
			    	alert("Upload complete!");
			    	
			    	//更新project
			    	projectModel.set('logo', data.logo);
			    	
	    			//隐藏窗口
					$('#logo_upload_sub_view').modal('toggle');
			    },
			    error: function(response){
					var alertMsg = 'Upload logo failed. Please try again later!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
			    	//隐藏窗口
			    	$('#logo_upload_sub_view').modal('toggle');
			    }
			});
		},
		
		//检查logo上传
		validate: function() {
			var maxsize = 1 * 1024 * 1024; //文件大小最大1M
			var emptyMsg = "Please select your upload logo image!";
			var errMsg = "The maxsize of upload file is 1M!";
			var fileTypeMsg = "The file type doesn't support!";
			var tipMsg = "Please use Chrome or Firefox browser to upload file!";
			var ua = window.navigator.userAgent;
			var browserCfg = {};
			if(ua.indexOf("Firefox")>=1){
				browserCfg.firefox = true;
			}else if(ua.indexOf("Chrome")>=1){
				browserCfg.chrome = true;
			}
			
			//检查浏览器类型
			if(!browserCfg.firefox && !browserCfg.chrome ){
		 		alert(tipMsg);
		 		return false;
		 	}
			
			//检查上传文件是否非空
			var file = document.getElementById("upload_logo_input");
		 	if(file.value == ""){
		 		alert(emptyMsg);
		 		return false;
		 	}
		 	
		 	//检查文件类型
		 	var accept_file_type = [
	   	        'image/gif',
	   	        'image/jpeg',
	   	        'image/png'
	           ];
		 	var filetype = file.files[0].type;
		 	var isValid = _.indexOf(accept_file_type, filetype);
		 	if(isValid == -1) {
		 		alert(fileTypeMsg);
		 		return false;
		 	}
	        
		 	//检查文件大小
		 	var filesize = file.files[0].size;
		 	if(filesize > maxsize){
		 		alert(errMsg);
		 		return false;
			}
		 	
		 	return true;
		}
	});
	
	var Header = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">Change Project Logo</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var Footer = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="submit" class="upload-logo btn btn-primary">Upload</a> ' + 
			'</div> ';
		return tpl;
	}
	
	var Body = function() {
		var accept_file_type = [
	        'image/gif',
	        'image/jpeg',
	        'image/png'
        ];

		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="fileAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="upload_logo_input" class="control-label">File:</label> ' + 
			'			<input id="upload_logo_input" type="file" accept="' + accept_file_type.join(', ') + '"> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label class="control-label">(Max upload logo image size is 1M. Support file type: gif, jpeg, jpg, png)</label> ' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}

	return ProjectDetailView;
});