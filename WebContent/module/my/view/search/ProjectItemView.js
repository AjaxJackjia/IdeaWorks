define([ 
         'backbone', 'util',
         //model
         'model/search/ProjectModel'
       ], 
    function(Backbone, util, ProjectModel) {
	var ProjectItemView = Backbone.View.extend({
		
		className: 'project-item-view',
		
		events: {
			'click .view-project': 'viewProjectDetail',
			'click .join-project': 'joinProject',
			'click .already-join-project': 'alreadyJoinProject'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'viewProjectDetail', 'joinProject', 'alreadyJoinProject');
		},
		
		render: function(){
			//set item cid
			$(this.el).attr('cid', this.model.cid);
			
			var projectItem = Item(this.model);
			$(this.el).append(projectItem);
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		viewProjectDetail: function() {
			var project = this.model;
			var searchProjectDetailSubView = new SearchProjectDetailSubView({
				model: project
			});
			var $subView = $('#search_project_detail_sub_view');
			if($subView.length == 0) {
				$('.content-panel').append($(searchProjectDetailSubView.render().el));
			}
			//显示view
			$('#search_project_detail_sub_view').modal('toggle');
		},
		
		joinProject: function() {
			var project = this.model;
			$.ajax({
			    url: util.baseUrl + '/api/users/' + util.currentUser() + '/projects/' + project.get('projectid') + '/applications',
			    data: {'proposer[userid]' : util.currentUser(), 'projectid' : project.get('projectid')},
			    type: 'POST',
			    success: function(result){
			    	if(result.ret == 0) {
			    		if(result.msg == 'joined') {
			    			alert('You have already joined this project...');
			    		}else if(result.msg == 'sent') {
			    			alert('You have already send request to relative staff, please wait for acception...');
			    		}else{
			    			alert("Send request complete!");
			    		}
			    	}else{
			    		alert(result.msg);
			    	}
			    },
			    error: function(response) {
					var alertMsg = 'Set privacy failed. Please try again later!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
		},
		
		alreadyJoinProject: function() {
			alert('You have already joined this project...');
		}
	});
	
	var Item = function(project) {
		//status view dom
		var status_content = '';
		switch(project.get('status')) {
			case 0: status_content = 'ongoing';break;
			case 1: status_content = 'completed';break;
			default: status_content = 'unclear'; break;
		}
		
		var action_tpl = '<div class="project-action">' + 
						 '	<a class="view-project btn btn-default">Detail</a>';
		if(!project.get('userJoinStatus')) {
			action_tpl += '	<a class="join-project btn btn-primary">Join</a>' + 
						  '</div>';
		}else{
			action_tpl += '	<a class="already-join-project btn btn-default">Joined</a>' + 
			  			  '</div>';
		}
						 
		var logo_tpl = '<img src="'+ util.baseUrl + project.get('logo') + '" title="'+ project.get('title') +'" alt="project image" class="img-rounded" />';
		
		var info_tpl = 
					'<div class="info"> ' + 
					'	<h4 class="project-title" title="' + project.get('title') + '">'+ project.get('title') +'</h4>' + 
					'	<p class="project-status">' + status_content + '</p>' + 
					'	<p class="project-createtime">create at ' + util.timeformat(new Date(project.get('createtime')), 'smart') + '</p>' + 
					'</div>';
		
		return action_tpl + logo_tpl + info_tpl;
	};
	
	/*
	 * search project detail sub view
	 * */
	var SearchProjectDetailSubView = Backbone.View.extend({
		
		id: 'search_project_detail_sub_view',
		
		className: 'search-project-detail-sub-view modal fade',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender');
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
			
			$(this.el).on('show.bs.modal', function (event) {
				//get project detail info
				self.model.fetch({
					wait: true,
					success: function() {
						generateDetailedInfo(self.model);
					},
					error: function(model, response, options) {
						var alertMsg = 'Fetch certain project failed. Please try again later!';
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
		}
	});
	
	var Header = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">Project Detail Information</h3> ' + 
			'</div>';
		return tpl;
	};
	
	var Footer = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="button" class="btn btn-primary" data-dismiss="modal">&nbsp;&nbsp;&nbsp;OK&nbsp;&nbsp;&nbsp;</a> ' + 
			'</div> ';
		return tpl;
	};
	
	var Body = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="projectAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="project_title" class="control-label">Title: </label>' + 
			'			<input type="text" class="form-control" id="project_title" name="project_title" disabled> ' + 
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="project_status" class="control-label">Status: </label>' + 
			'			<input type="text" class="form-control" id="project_status" name="project_status" disabled> ' + 
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="project_createtime" class="control-label">Create time: </label>' + 
			'			<input type="text" class="form-control" id="project_createtime" name="project_createtime" disabled> ' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	};
	
	var generateDetailedInfo = function(project) {
		var status_content = '';
		switch(project.get('status')) {
			case 0: status_content = 'ongoing';break;
			case 1: status_content = 'completed';break;
			default: status_content = 'unclear'; break;
		}
		
		//basic info
		$('#project_title').val(project.get('title'));
		$('#project_status').val(status_content);
		$('#project_createtime').val(util.timeformat(new Date(project.get('createtime')), 'smart'));
		
		//security flag
		var security_flag = (project.get('security')==0?true:false) || project.get('userJoinStatus');
		var detailed_tpl = '';
		if(security_flag) {
			var creator = project.get('creator');
			var advisor = project.get('advisor');
			detailed_tpl = 
				'<div class="form-group"> ' + 
				'	<label for="project_advisor" class="control-label">Advisor: </label>' + 
				'	<input type="text" class="form-control" id="project_advisor" name="project_advisor" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="project_creator" class="control-label">Creator: </label>' + 
				'	<input type="text" class="form-control" id="project_creator" name="project_creator" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="project_abstract" class="control-label">Abstract: </label>' + 
				'	<textarea class="form-control" id="project_abstract" name="project_abstract" disabled></textarea> ' + 
				'</div> ';
		}else{
			detailed_tpl = 
				'<div class="form-group"> ' + 
				'	<label class="control-label">Due to the project\'s security settings, you can\'t view the detail of this project before you join... </label>' + 
				'</div> ';
		}
		$('#projectAttribute').append(detailed_tpl);
		if(security_flag) {
			var creator = project.get('creator');
			var advisor = project.get('advisor');
			$('#project_advisor').val(advisor.nickname);
			$('#project_creator').val(creator.nickname);
			$('#project_abstract').val(project.get('abstractContent'));
		}
	};
	
	return ProjectItemView;
});