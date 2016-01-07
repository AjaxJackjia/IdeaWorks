define([ 
         'backbone', 'util', 'CheckLib', 'i18n!../../../../nls/translation',
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
 		'model/project/ActivityCollection',
 		'model/project/ApplicationCollection'
       ], 
    function(Backbone, util, CheckLib, i18n,
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
    		ActivityCollection,
    		ApplicationCollection) {
	var ProjectDetailView = Backbone.View.extend({
		
		className: 'project-detail-view',
		
		events: {
			'click .project-menu>li': 'tabClick',
			'click .modify-project': 'modifyProject',
			'click .logo-project': 'logoProject',
			'click .status-project': 'statusProject',
			'click .security-project': 'securityProject',
			'click .application-project': 'applicationProject',
			'click .exit-project': 'exitProject',
			'click .delete-project': 'deleteProject'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'unrender', 'projectChange', 'tabClick', 
							'modifyProject', 'logoProject', 'statusProject', 'securityProject', 
							'applicationProject', 'exitProject', 'deleteProject');
			
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
				$emtpy_placeholder.append('<h4>' + i18n.my.projects.ProjectDetailView.NO_PROJECT_SELECT + '</h4>');
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
			$emtpy_placeholder.append('<h4>' + i18n.my.projects.ProjectDetailView.NO_PROJECT_SELECT + '</h4>');
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
			if(target == i18n.my.projects.ProjectDetailView.MEMBERS && $('#members').html() == "") {
				//members model
				var members = new MemberCollection();
				members.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + currentProject.get('projectid') + '/members';
				members.fetch({
					error: function(model, response, options) {
			    		var alertMsg = i18n.my.projects.ProjectDetailView.FETCH_MEMBERS_ERROR;
						util.commonErrorHandler(response.responseJSON, alertMsg);
		    		}
				});
				//members view
				var membersView = new ProjectDetailMembersView({
					model: members
				});
				$(this.el).find('#members').html(membersView.render().el);
			}else if(target == i18n.my.projects.ProjectDetailView.MILESTONE && $('#milestone').html() == "") {
				//milestone model
				var milestones = new MilestoneCollection();
				milestones.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + currentProject.get('projectid') + '/milestones';
				milestones.fetch({
					error: function(model, response, options) {
			    		var alertMsg = i18n.my.projects.ProjectDetailView.FETCH_MILESTONES_ERROR;
						util.commonErrorHandler(response.responseJSON, alertMsg);
		    		}
				});
				//milestone view
				var milestoneView = new ProjectDetailMilestoneView({
					model: milestones
				});
				$(this.el).find('#milestone').html(milestoneView.render().el);
			}else if(target == i18n.my.projects.ProjectDetailView.FORUM && $('#forum').html() == "") {
				//topic model
				var topics = new TopicCollection();
				topics.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + currentProject.get('projectid') + '/topics';
				topics.fetch({
					error: function(model, response, options) {
			    		var alertMsg = i18n.my.projects.ProjectDetailView.FETCH_TOPICS_ERROR;
						util.commonErrorHandler(response.responseJSON, alertMsg);
		    		}
				});
				//topic view
				var forumView = new ProjectDetailForumView({
					model: topics
				});
				$(this.el).find('#forum').html(forumView.render().el);
			}else if(target == i18n.my.projects.ProjectDetailView.FILES && $('#files').html() == "") {
				//file model
				var files = new FileCollection();
				files.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + currentProject.get('projectid') + '/files';
				files.fetch({
					error: function(model, response, options) {
			    		var alertMsg = i18n.my.projects.ProjectDetailView.FETCH_FILES_ERROR;
						util.commonErrorHandler(response.responseJSON, alertMsg);
		    		}
				});
				//file view
				var filesView = new ProjectDetailFilesView({
					model: files
				});
				$(this.el).find('#files').html(filesView.render().el);
			}else if(target == i18n.my.projects.ProjectDetailView.ACTIVITY) {//每次点击activity tab的时候都刷新
				//activity model
				var activities = new ActivityCollection();
				activities.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + currentProject.get('projectid') + '/activities';
				activities.fetch({
					error: function(model, response, options) {
			    		var alertMsg = i18n.my.projects.ProjectDetailView.FETCH_ACTIVITIES_ERROR;
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
		
		//modify project status
		statusProject: function() {
			var projectStatusSubView = new ProjectStatusSubView({
				model: this.model
			});
			var $statusView = $('#project_status_sub_view');
			if($statusView.length > 0) {
				$('#project_status_sub_view').remove();
			}
			$('.content-panel').append($(projectStatusSubView.render().el));
			
			//显示view
			$('#project_status_sub_view').modal('toggle');
		},
		
		securityProject: function() {
			var projectSecuritySubView = new ProjectSecuritySubView({
				model: this.model
			});
			var $securityView = $('#project_security_sub_view');
			if($securityView.length > 0) {
				$('#project_security_sub_view').remove();
			}
			$('.content-panel').append($(projectSecuritySubView.render().el));
			
			//显示view
			$('#project_security_sub_view').modal('toggle');
		},
		
		applicationProject: function() {
			var projectApplicationSubView = new ProjectApplicationSubView({
				model: this.model
			});
			var $applicationView = $('#project_application_sub_view');
			if($applicationView.length > 0) {
				$('#project_application_sub_view').remove();
			}
			$('.content-panel').append($(projectApplicationSubView.render().el));
			
			//显示view
			$('#project_application_sub_view').modal('toggle');
		},
		
		exitProject: function() {
			if(confirm(i18n.my.projects.ProjectDetailView.EXIT_PROJECT_CONFIRM)) {
				Backbone.trigger('ProjectListView:exitProject', this.model);
			}
		},
		
		//删除project
		deleteProject: function() {
			if(confirm(i18n.my.projects.ProjectDetailView.DELETE_PROJECT_CONFIRM)) {
				Backbone.trigger('ProjectListView:deleteProject', this.model);
			}
		}
	});
	
	var ProjectDetail_template = function(project) {
		//project detail header
		var advisor = project.get('advisor');
		var creator = project.get('creator');
		
		var header_tpl = 
			'<div class="project-header">' + 
			'	<div class="actions">' + ProjectDetailMenu_templete(project) +
			'	</div>' + 
			'	<div class="content">' + 
			'		<img src="' + project.get('logo') + '" alt="' + project.get('title') + '" class="img-rounded" />' +
			'		<div class="info"> ' + 
			'			<h4 class="project-title">' + project.get('title') + '</h4>' + 
			'			<p class="project-advisor">' + i18n.my.projects.ProjectDetailView.ADVISOR + ': ' + advisor.nickname + '</p>' + 
			'			<p class="project-creator">' + i18n.my.projects.ProjectDetailView.CREATOR + ': ' + creator.nickname + '</p>' + 
			'			<p class="project-createtime">' + i18n.my.projects.ProjectDetailView.CREATE_TIME + ': ' + util.timeformat(new Date(project.get('createtime'))) + '</p>' + 
			'		</div>' +
			'	</div>' + 
			'</div>';
		
		//project detail menu 
		var menu_tpl = 
			'<ul class="project-menu nav nav-tabs" role="tablist">' + 
			'  <li role="presentation" class="active">' + 
			'		<a href="#abstract" aria-controls="abstract" role="tab" data-toggle="tab">' + i18n.my.projects.ProjectDetailView.ABSTRACT + '</a>' + 
			'  </li>' + 
			'  <li role="presentation">' + 
			'  		<a href="#members" aria-controls="members" role="tab" data-toggle="tab">' + i18n.my.projects.ProjectDetailView.MEMBERS + '</a>' + 
			'  </li>' + 
			'  <li role="presentation">' + 
			'		<a href="#milestone" aria-controls="milestone" role="tab" data-toggle="tab">' + i18n.my.projects.ProjectDetailView.MILESTONE + '</a>' + 
			'  </li>' + 
			'  <li role="presentation">' + 
			'		<a href="#forum" aria-controls="forum" role="tab" data-toggle="tab">' + i18n.my.projects.ProjectDetailView.FORUM + '</a>' + 
			'  </li>' + 
			'  <li role="presentation">' + 
			'		<a href="#files" aria-controls="files" role="tab" data-toggle="tab">' + i18n.my.projects.ProjectDetailView.FILES + '</a>' + 
			'  </li>' + 
			'  <li role="presentation">' + 
			'		<a href="#activity" aria-controls="activity" role="tab" data-toggle="tab">' + i18n.my.projects.ProjectDetailView.ACTIVITY + '</a>' + 
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
	
	//根据用户信息生成menu
	var ProjectDetailMenu_templete = function(project) {
		//project detail header
		var creator = project.get('creator');
		var advisor = project.get('advisor');
		
		//判断是否为管理员:默认管理员为creator和advisor
		var isProjectManager = util.currentUser() == creator.userid || util.currentUser() == advisor.userid;
		
		//构造menu
		var build_menu_tpl = ProjectDetailMenuItem_templete("modify-project", "pencil", i18n.my.projects.ProjectDetailView.PROJECT_MENU_EDIT) + 
							 ProjectDetailMenuItem_templete("logo-project", "picture-o", i18n.my.projects.ProjectDetailView.PROJECT_MENU_LOGO) + 
							 '<li class="divider"></li>';
		if(isProjectManager) {
			build_menu_tpl += ProjectDetailMenuItem_templete("status-project", "paper-plane", i18n.my.projects.ProjectDetailView.PROJECT_MENU_STATUS) + 
							  ProjectDetailMenuItem_templete("security-project", "user-secret", i18n.my.projects.ProjectDetailView.PROJECT_MENU_SECURITY) +
							  ProjectDetailMenuItem_templete("application-project", "envelope", i18n.my.projects.ProjectDetailView.PROJECT_MENU_APPLICATION) + 
							  '<li class="divider"></li>' + 
							  ProjectDetailMenuItem_templete("delete-project", "trash", i18n.my.projects.ProjectDetailView.PROJECT_MENU_DELETE_PROJECT);
		}else{
			build_menu_tpl += ProjectDetailMenuItem_templete("exit-project", "sign-out", i18n.my.projects.ProjectDetailView.PROJECT_MENU_EXIT_PROJECT);
		}
			
		var menu_tpl = 
			'<div class="project-action-menu"> ' + 
			'	<a class="btn btn-default dropdown-toggle" type="button" id="project_menu_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' + 
		    '		<i class="fa fa-cogs"></i> ' + i18n.my.projects.ProjectDetailView.PROJECT_MENU + ' <span class="caret"></span> ' + 
			'	</a> ' + 
			'	<ul class="dropdown-menu" aria-labelledby="project_menu_dropdown"> ' + build_menu_tpl + 
			'	</ul> ' + 
			'</div>';
		
		return menu_tpl;
	};
	
	var ProjectDetailMenuItem_templete = function(classname, icon, title) {
		var tpl = 
			'<li> ' + 
			'	<a class="' + classname +'"> ' + 
			'		<i class="fa fa-' + icon + '"></i> ' + title +
			'	</a>' + 
			'</li> ';
		return tpl;
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
			    	alert(i18n.my.projects.ProjectDetailView.UPLOAD_SUCCESS);
			    	
			    	//更新project
			    	projectModel.set('logo', data.logo);
			    	
	    			//隐藏窗口
					$('#logo_upload_sub_view').modal('toggle');
			    },
			    error: function(response){
					var alertMsg = i18n.my.projects.ProjectDetailView.UPLOAD_LOGO_ERROR;
					util.commonErrorHandler(response.responseJSON, alertMsg);
			    	//隐藏窗口
			    	$('#logo_upload_sub_view').modal('toggle');
			    }
			});
		},
		
		//检查logo上传
		validate: function() {
			var maxsize = 300 * 1024; //头像文件 - 文件大小最大300k
			var emptyMsg	 = i18n.my.projects.ProjectDetailView.CHECK_ALERT_EMPTY;
			var errMsg		 = i18n.my.projects.ProjectDetailView.CHECK_ALERT_MAX_SIZE;
			var fileTypeMsg  = i18n.my.projects.ProjectDetailView.CHECK_ALERT_FILE_TYPE;
			var tipMsg 		 = i18n.my.projects.ProjectDetailView.CHECK_ALERT_BROWSER;
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
			'	<h3 class="modal-title">' + i18n.my.projects.ProjectDetailView.CHANGE_PROJECT_LOGO + '</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var Footer = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="submit" class="upload-logo btn btn-primary">' + i18n.my.projects.ProjectDetailView.UPLOAD + '</a> ' + 
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
			'			<label for="upload_logo_input" class="control-label">' + i18n.my.projects.ProjectDetailView.UPLOAD_FILE + '</label> ' + 
			'			<input id="upload_logo_input" type="file" accept="' + accept_file_type.join(', ') + '"> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label class="control-label">' + i18n.my.projects.ProjectDetailView.UPLOAD_TIPS + '</label> ' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}

	/*
	 * Project status setting sub view
	 * */
	var ProjectStatusSubView = Backbone.View.extend({
		
		id: 'project_status_sub_view',
		
		className: 'project-status-sub-view modal fade',
		
		events: {
			'click .save': 'save'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'save');
			
			//status flags
			this.ONGOING_FLAG = 0;
			this.END_FLAG = 1;
			this.currentStatus = this.ONGOING_FLAG;
		},
		
		render: function(){
			var $modalDialog = $('<div class="modal-dialog" role="document">');
			var $modalDialogContent = $('<div class="modal-content">');
			$modalDialog.append($modalDialogContent);
			
			var header = StatusModalHeader();
			$modalDialogContent.append(header);
			
			var body = StatusModalBody();
			$modalDialogContent.append(body);
			
			var footer = StatusModalFooter();
			$modalDialogContent.append(footer);
			
			$(this.el).append($modalDialog);
			
			//绑定modal事件
			var self = this;
			//初始化控件并绑定事件
			setTimeout(function() {
				//初始化
				$('.status-item').iCheck({
				    checkboxClass: 'icheckbox_square-blue',
				    radioClass: 'iradio_square-blue	',
				    increaseArea: '20%' // optional
				});
				
				var status = self.model.get('status');
				switch(status) {
				case 0: $('.project-ongoing').iCheck('check'); break;
				case 1: $('.project-complete').iCheck('check'); break;
				default: $('.project-ongoing').iCheck('check');break;
				}
				
				//绑定事件
				$('.status-item').on('ifClicked', function(event){
					var $targetDom = $(event.target).closest('.status-item');
					if($targetDom.length > 0) {
						$('.status-item').iCheck('uncheck');
						$targetDom.iCheck('check');
						
						if($targetDom.hasClass('.project-ongoing')) {
							self.currentStatus = self.ONGOING_FLAG;
						}else if($targetDom.hasClass('project-complete')) {
							self.currentStatus = self.END_FLAG;
						}
					}
				});
			}, 0);
			
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		save: function() {
			var self = this;
			this.model.save('status', this.currentStatus, {
				wait: true,
				error: function(model, response, options) {
					var alertMsg = i18n.my.projects.ProjectDetailView.UPDATE_STATUS_ERROR;
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
			//隐藏modal view
			$('#project_status_sub_view .modal-header .close').click();
		}
	});
	
	var StatusModalHeader = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">' + i18n.my.projects.ProjectDetailView.PROJECT_STATUS + '</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var StatusModalFooter = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="button" class="btn btn-default" data-dismiss="modal">' + i18n.my.projects.ProjectDetailView.PROJECT_STATUS_CANCEL + '</a> ' + 
			'	<a type="submit" class="save btn btn-primary">' + i18n.my.projects.ProjectDetailView.PROJECT_STATUS_SAVE + '</a> ' + 	
			'</div> ';
		return tpl;
	}
	
	var StatusModalBody = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="statusAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<div class="status-container well"> ' + 
			'				<div class="project-ongoing status-item"  name="iCheck">' + 
		    '					<input type="radio" />' + 
			'					<div class="option truncate">' + i18n.my.projects.ProjectDetailView.PROJECT_STATUS_ONGOING + '</div>' + 
			'				</div>' + 
			'				<div class="project-complete status-item"  name="iCheck">' + 
		    '					<input type="radio" />' + 
			'					<div class="option truncate">' + i18n.my.projects.ProjectDetailView.PROJECT_STATUS_COMPLETE + '</div>' + 
			'				</div>' + 
			'			</div>' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}
	
	/*
	 * Project security setting sub view
	 * */
	var ProjectSecuritySubView = Backbone.View.extend({
		
		id: 'project_security_sub_view',
		
		className: 'project-security-sub-view modal fade',
		
		events: {
			'click .save': 'save'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'save');
			
			//security flags
			this.PUBLIC = 0;
			this.GROUP = 1;
			this.currentSecurity = this.PUBLIC;
		},
		
		render: function(){
			var $modalDialog = $('<div class="modal-dialog" role="document">');
			var $modalDialogContent = $('<div class="modal-content">');
			$modalDialog.append($modalDialogContent);
			
			var header = SecurityModalHeader();
			$modalDialogContent.append(header);
			
			var body = SecurityModalBody();
			$modalDialogContent.append(body);
			
			var footer = SecurityModalFooter();
			$modalDialogContent.append(footer);
			
			$(this.el).append($modalDialog);
			
			//绑定modal事件
			var self = this;
			//初始化控件并绑定事件
			setTimeout(function() {
				//初始化
				$('.security-item').iCheck({
				    checkboxClass: 'icheckbox_square-blue',
				    radioClass: 'iradio_square-blue	',
				    increaseArea: '20%' // optional
				});
				
				var security = self.model.get('security');
				switch(status) {
				case 0: $('.project-public').iCheck('check'); break;
				case 1: $('.project-group').iCheck('check'); break;
				default: $('.project-public').iCheck('check');break;
				}
				
				//绑定事件
				$('.security-item').on('ifClicked', function(event){
					var $targetDom = $(event.target).closest('.security-item');
					if($targetDom.length > 0) {
						$('.security-item').iCheck('uncheck');
						$targetDom.iCheck('check');
						
						if($targetDom.hasClass('.project-public')) {
							self.currentSecurity = self.PUBLIC;
						}else if($targetDom.hasClass('project-group')) {
							self.currentSecurity = self.GROUP;
						}
					}
				});
			}, 0);
			
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		save: function() {
			var self = this;
			this.model.save('security', this.currentSecurity, {
				wait: true,
				error: function(model, response, options) {
					var alertMsg = i18n.my.projects.ProjectDetailView.UPDATE_SECURITY_ERROR;
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
			//隐藏modal view
			$('#project_security_sub_view .modal-header .close').click();
		}
	});
	
	var SecurityModalHeader = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">' + i18n.my.projects.ProjectDetailView.PROJECT_SECURITY + '</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var SecurityModalFooter = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="button" class="btn btn-default" data-dismiss="modal">' + i18n.my.projects.ProjectDetailView.PROJECT_SECURITY_CANCEL + '</a> ' + 
			'	<a type="submit" class="save btn btn-primary">' + i18n.my.projects.ProjectDetailView.PROJECT_SECURITY_SAVE + '</a> ' + 
			'</div> ';
		return tpl;
	}
	
	var SecurityModalBody = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="securityAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<div class="security-container well"> ' + 
			'				<div class="project-public security-item"  name="iCheck">' + 
		    '					<input type="radio" />' + 
			'					<div class="option truncate">' + i18n.my.projects.ProjectDetailView.PROJECT_SECURITY_PUBLIC + '</div>' + 
			'				</div>' + 
			'				<div class="project-group security-item"  name="iCheck">' + 
		    '					<input type="radio" />' + 
			'					<div class="option truncate">' + i18n.my.projects.ProjectDetailView.PROJECT_SECURITY_GROUP + '</div>' + 
			'				</div>' + 
			'			</div>' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}
	
	/*
	 * Project application sub view
	 * */
	var ProjectApplicationSubView = Backbone.View.extend({
		
		id: 'project_application_sub_view',
		
		className: 'project-application-sub-view modal fade',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'addApplicationItem');
			
			//applications
			this.applications = new ApplicationCollection();
			this.applications.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + this.model.get('projectid') + '/applications';
		},
		
		render: function(){
			var $modalDialog = $('<div class="modal-dialog" role="document">');
			var $modalDialogContent = $('<div class="modal-content">');
			$modalDialog.append($modalDialogContent);
			
			var header = ApplicationModalHeader();
			$modalDialogContent.append(header);
			
			var body = ApplicationModalBody();
			$modalDialogContent.append(body);
			
			var footer = ApplicationModalFooter();
			$modalDialogContent.append(footer);
			
			$(this.el).append($modalDialog);
			
			//绑定modal事件
			var self = this;
			
			$(this.el).on('show.bs.modal', function (event) {
				self.applications.fetch({
					wait: true,
					success: function() {
						_.each(self.applications.models, function(application, index) {
							self.addApplicationItem(application);
						});
					},
					error: function(model, response, options) {
			    		var alertMsg = i18n.my.projects.ProjectDetailView.FETCH_APPLICATIONS_ERROR;
						util.commonErrorHandler(response.responseJSON, alertMsg);
		    		}
				});
			});
			
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		addApplicationItem: function(application) {
			//设置每个application model的url
			application.url = this.applications.url + '/' + application.get('applicationid');
			
			var $placeholder = $('.applications > tbody > .place-holder', this.el);
			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			
			var applicationItemView = new ApplicationItemView({
				model: application
			});
			$('.applications > tbody', this.el).append($(applicationItemView.render().el));
		}
	});
	
	var ApplicationModalHeader = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">' + i18n.my.projects.ProjectDetailView.PROJECT_APPLICATION + '</h3> ' + 
			'</div>';
		return tpl;
	};
	
	var ApplicationModalFooter = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'</div> ';
		return tpl;
	};
	
	var ApplicationModalBody = function() {
		var tpl = 
			'<div class="modal-body"> ' +
			'	<table class="applications table table-hover table-striped"> ' + 
			'		<thead> ' + 
			'			<tr> ' + 
			'				<td class="applicationid">#</td> ' + 
			'				<td class="application_proposer">' + i18n.my.projects.ProjectDetailView.PROJECT_APPLICATION_PROPOSER + '</td> ' + 
			'				<td class="application_msg">' + i18n.my.projects.ProjectDetailView.PROJECT_APPLICATION_MESSAGE + '</td> ' + 
			'				<td class="application_createtime">' + i18n.my.projects.ProjectDetailView.PROJECT_APPLICATION_APPLY_TIME + '</td> ' + 
			'				<td class="application_status">' + i18n.my.projects.ProjectDetailView.PROJECT_APPLICATION_STATUS + '</td> ' + 
			'				<td class="application_action">' + i18n.my.projects.ProjectDetailView.PROJECT_APPLICATION_ACTION + '</td> ' + 
			'			</tr> ' + 
			'		</thead> ' + 
			'		<tbody> ' + 
			'			<tr class="place-holder"> ' + 
			'				<td colspan="6">' + i18n.my.projects.ProjectDetailView.PROJECT_NO_APPLICATIONS + '</td> ' + 
			'			</tr> ' + 
			'		</tbody> ' + 
			'	</table> ' + 
			'</div> '
		return tpl;
	};
	
	var ApplicationItemView = Backbone.View.extend({
		tagName: 'tr',
		
		className: 'application application-item-view',
		
		events: {
			'click .agree': 'agree',
			'click .reject': 'reject'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'agree', 'reject');
			
			//监听model变化
			this.model.bind('change', this.render);
			
			//0 - 已发送; 1 - 已同意; 2 - 已拒绝;
			this.APPLIED_FLAG  = 0;
			this.PASSED_FLAG   = 1;
			this.REJECTED_FLAG = 2;
		},
		
		render: function(){
			var application = this.model;
			
			//cid
			$(this.el).attr('cid', this.model.cid);
			
			//status and action
			var status = '';
			switch(application.get('status')) {
				case this.APPLIED_FLAG: status = i18n.my.projects.ProjectDetailView.PROJECT_APPLICATION_APPLIED;break;
				case this.PASSED_FLAG: status = i18n.my.projects.ProjectDetailView.PROJECT_APPLICATION_PASSED;break;
				case this.REJECTED_FLAG: status = i18n.my.projects.ProjectDetailView.PROJECT_APPLICATION_REJECTED;break;
				default: status = i18n.my.projects.ProjectDetailView.PROJECT_APPLICATION_UNKNOWN;break;
			}
			var actions = '';
			if(application.get('status') == 0) { //待审核状态
				actions = 
					'<a class="agree btn btn-success">' + i18n.my.projects.ProjectDetailView.PROJECT_APPLICATION_AGREE + '</a>' + 
					'<a class="reject btn btn-danger">' + i18n.my.projects.ProjectDetailView.PROJECT_APPLICATION_REJECT + '</a>';
			}
			
			//proposer
			var proposer = application.get('proposer');
			//根据模板生成dom
			var application_item_tpl = 
						'<td class="applicationid">' + application.get('applicationid') + '</td> ' + 
						'<td class="application_proposer">' + proposer.nickname + '</td> ' + 
						'<td class="application_msg" title="' + application.get('msg') + '">' + application.get('msg') + '</td> ' + 
						'<td class="application_createtime">' + util.timeformat(new Date(application.get('createtime'))) + '</td> ' + 
						'<td class="application_status">' + status + '</td> ' + 
						'<td class="application_action">' + actions + '</td> ';
			$(this.el).html(application_item_tpl);
			
		    return this;
		},
		
		agree: function(event) {
			if(confirm(i18n.my.projects.ProjectDetailView.PROJECT_APPLICATION_AGREE_CONFIRM)) {
				var self = this;
				this.model.save('status', this.PASSED_FLAG, {
					success: function() {
						
					},
					error: function(model, response, options) {
						var alertMsg = i18n.my.projects.ProjectDetailView.UPDATE_APPLICATIONS_ERROR;
						util.commonErrorHandler(response.responseJSON, alertMsg);
						
						//reset state
						self.model.set('status', 0);
					}
				});
			}
		},
		
		reject: function(event) {
			if(confirm(i18n.my.projects.ProjectDetailView.PROJECT_APPLICATION_REJECT_CONFIRM)) {
				var self = this;
				this.model.save('status', this.REJECTED_FLAG, {
					success: function() {
						
					},
					error: function(model, response, options) {
						var alertMsg = i18n.my.projects.ProjectDetailView.UPDATE_APPLICATIONS_ERROR;
						util.commonErrorHandler(response.responseJSON, alertMsg);
						
						//reset state
						self.model.set('status', 0);
					}
				});
			}
		}
	});
	
	return ProjectDetailView;
});