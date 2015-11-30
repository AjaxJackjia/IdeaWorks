define([ 
         'backbone', 'util', 'Validator',
         //model
 		'model/project/ProjectModel',
 		'model/project/MemberCollection'
       ], 
    function(Backbone, util, Validator, ProjectModel, MemberCollection) {
	var ProjectDetailModifyView = Backbone.View.extend({
		
		id: 'project_detail_modify_view',
		
		className: 'project-detail-modify-view modal fade',
		
		events: {
			'click .modal-footer > .btn-primary': 'saveChanges'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'addCandidate');
			
			//加载advisor candidates
			this.advisorCandidates = new MemberCollection();
			if(this.model == null) {
				this.advisorCandidates.url = '/IdeaWorks/api/users';
			}else{
				this.advisorCandidates.url = '/IdeaWorks/api/users/' + util.currentUser() + '/projects/' + this.model.get('projectid') + '/members';
			}
			
			//监听model变化
			this.advisorCandidates.bind('add', this.addCandidate);
		},
		
		render: function(){
			var projectModel = this.model;
			
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
			
			//form validator
			$modalDialog.find('#projectAttribute').bootstrapValidator({
				live: 'enabled',
		        message: 'This value is not valid',
		        feedbackIcons: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },
		        fields: {
		        	project_title: {
		                validators: {
		                    notEmpty: {
		                        message: 'The porject title is required'
		                    }
		                }
		            },
		            project_advisor: {
		                validators: {
		                    notEmpty: {
		                        message: 'The porject advisor is required'
		                    }
		                }
		            }
		        }
		    });
			
			//加载candidate
			var advisorCandidates = this.advisorCandidates;
			
			//bind modal event through jquery
			$(this.el).on('show.bs.modal', function (event) {
				if(projectModel == null) {
					//创建project
					$(this).find('.modal-title').html("Create Project");
					$(this).find('.modal-footer > .btn-primary').html("Create");
					
					advisorCandidates.fetch();
				}else{
					//修改project
					$(this).find('.modal-title').html("Edit Project");
					$(this).find('.modal-footer > .btn-primary').html("Save");
					
					var $dom = $(this);
					advisorCandidates.fetch({
						success: function() {
							//将project basic info 填充到相应区域
							$dom.find('#project_title').val(projectModel.get('title'));
							var advisor = projectModel.get('advisor');
							$dom.find('#project_advisor').val(advisor.userid);
						}
					});
				}
			});
			
			$(this.el).on('hide.bs.modal', function (event) {
				//清空modal
				$(this).find('.modal-title').html("");
				$(this).find('.modal-footer > .btn-primary').html("");
				$(this).find('#project_title').val("");
				$(this).find('#project_advisor').html("");
				$('#projectAttribute').data('bootstrapValidator').resetForm();
			});
			
			return this;
		},
		
		addCandidate: function(candidate) {
			$('#project_advisor').append('<option value="'+ candidate.get('userid') +'">' + candidate.get('nickname') + '</option>');
		},
		
		saveChanges: function() {
			//validate
			$('#projectAttribute').data('bootstrapValidator').validateField('project_title');
			$('#projectAttribute').data('bootstrapValidator').validateField('project_advisor');
			if(!$('#projectAttribute').data('bootstrapValidator').isValid()) return;
			
			if(this.model == null) {
				//创建project
				var projectModel = new ProjectModel();
				projectModel.set('title', $('#project_title').val());
				
				var creatorRaw = this.advisorCandidates.where({userid: util.currentUser()});
				console.log(util.currentUser());
				console.log(creatorRaw[0]);
				
				projectModel.set('creator', {
					userid: creatorRaw[0].get('userid'),
					nickname: creatorRaw[0].get('nickname'),
					logo: creatorRaw[0].get('logo')
				});
				
				var advisorRaw = this.advisorCandidates.where({userid: $('#project_advisor').val()});
				projectModel.set('advisor', {
					userid: advisorRaw[0].get('userid'),
					nickname: advisorRaw[0].get('nickname'),
					logo: advisorRaw[0].get('logo')
				});
				
				//触发全局事件
				Backbone.trigger('ProjectListView:createProject', projectModel);
			}else{
				//修改project
				var advisorRaw = this.advisorCandidates.where({userid: $('#project_advisor').val()});
				this.model.set('title', $('#project_title').val());
				this.model.set('advisor', {
					userid: advisorRaw[0].get('userid'),
					nickname: advisorRaw[0].get('nickname'),
					logo: advisorRaw[0].get('logo')
				});
				
				this.model.save({
					wait: true,
					error: function() {
						alert('update project failed!');
					}
				});
			}
			
			//隐藏modal view
			$('#project_detail_modify_view .modal-header .close').click();
		}
	});
	
	var Header = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title"></h3> ' + 
			'</div>';
		return tpl;
	}
	
	var Footer = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="button" class="btn btn-default" data-dismiss="modal">Cancel</a> ' + 
			'	<a type="submit" class="btn btn-primary"></a> ' + 
			'</div> ';
		return tpl;
	}
	
	var Body = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="projectAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="project_title" class="control-label">Title:</label> ' + 
			'			<input type="text" class="form-control" id="project_title" name="project_title" placeholder="project title"> ' + 
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="project_advisor" class="control-label">Advisor:</label> ' + 
			'			<select class="form-control" id="project_advisor" name="project_advisor"> ' + 
			'			</select> ' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> ';
		return tpl;
	}
	
	return ProjectDetailModifyView;
});