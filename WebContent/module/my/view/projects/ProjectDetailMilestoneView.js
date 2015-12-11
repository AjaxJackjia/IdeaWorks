define([ 
         'backbone', 'util', 'Validator',
         //view
         'view/projects/ProjectDetailMilestoneItemView',
         //model
         'model/project/MilestoneModel'
       ], 
    function(Backbone, util, Validator, ProjectDetailMilestoneItemView, MilestoneModel) {
	var ProjectDetailMilestoneView = Backbone.View.extend({
		
		className: 'project-detail-milestone-view',
		
		events: {
			'click .add-milestone-title': 'clickToCreate'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addMilestoneItem', 'removeMilestoneItem', 'createMilestone', 'deleteMilestone', 'clickToCreate');
			
			//注册全局事件
			Backbone.
				off('ProjectDetailMilestoneView:createMilestone').
				on('ProjectDetailMilestoneView:createMilestone', this.createMilestone, this);
			Backbone.
				off('ProjectDetailMilestoneView:deleteMilestone').
				on('ProjectDetailMilestoneView:deleteMilestone', this.deleteMilestone, this);
			
			//监听model变化
			this.model.bind('add', this.addMilestoneItem);
			this.model.bind('remove', this.removeMilestoneItem);
		},
		
		render: function(){
			var $milestones = $('<div class="milestones well">');
			$milestones.append(MileStoneAddBtn()); // milestone add button
			$(this.el).append($milestones);
			
		    return this;
		},
		
		/*
		 * 向milestone集合中添加milestone
		 * */
		addMilestoneItem: function(milestone) {
			var $milestoneAddBtn = $(this.el).find('.milestone.add-milestone');
			var projectDetailMilestoneItemView = new ProjectDetailMilestoneItemView({
				model: milestone
			});
			$(projectDetailMilestoneItemView.el).insertAfter($milestoneAddBtn);
			//保持scrollY在最上
			$('.project-content').scrollTop( 0 );
		},
		
		/*
		 * 从milestone集合中删除milestone
		 * */
		removeMilestoneItem: function(milestone) {
			_.each($('.milestone[cid]', this.el), function(element, index, list){ 
				if($(element).attr('cid') == milestone.cid) {
					$(element).fadeOut();
					$(element).remove();
				}
			});
			
			//其他milestone应当在该milestone删除时展示出来
			$('.milestone', this.el).show();
		},
		
		/*
		 * 点击新建milestone按钮事件
		 * */
		clickToCreate: function() {
			var milestones = this.model;
			var createMilestoneSubView = new CreateMilestoneSubView({
				model: milestones
			});
			var $subView = $('#create_milestone_sub_view');
			if($subView.length == 0) {
				$('.content-panel').append($(createMilestoneSubView.render().el));
			}
			//显示view
			$('#create_milestone_sub_view').modal('toggle');
		},
		
		/*
		 * 新建milestone
		 * */
		createMilestone: function(milestone) {
			var milestones = this.model;
			milestones.create(milestone, {
				 wait: true, 
				 success: function() {
					 
				 }, 
				 error: function(model, response, options) {
					 var alertMsg = 'Create milestone failed. Please try again later!';
					 util.commonErrorHandler(response.responseJSON, alertMsg);
				 }
			});
		},
		
		/*
		 * 删除milestone
		 * */
		deleteMilestone: function(milestone) {
			var milestones = this.model;
			milestones.get(milestone.cid).destroy({
				wait: true, 
				success: function() {
					//从list中删除milestone
					milestones.remove(milestone);
				},
				error: function(model, response, options) {
					var alertMsg = 'Delete milestone failed. Please try again later!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
		}
	});
	
	/*
	 * view component html template
	 * */
	var MileStoneAddBtn = function() {
		var $tpl = 
			'<div class="milestone add-milestone"> ' +
			'  <div class="timeline-icon"> ' +
			'    <i class="fa fa-plus"></i> ' +
			'  </div> ' +
			'  <div class="content"> ' +
			'	 <div class="add-milestone-title">Add New Milestone</div> ' +
			'  </div> ' +
			'</div>';
			return $tpl;
	};
	
	/*
	 * subview - create new milestone sub view
	 * */
	var CreateMilestoneSubView = Backbone.View.extend({
		
		id: 'create_milestone_sub_view',
		
		className: 'create-milestone-sub-view modal fade',
		
		events: {
			'click .create': 'create'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'create');
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
			
			//form validator
			$modalDialog.find('#milestoneAttribute').bootstrapValidator({
				live: 'enabled',
		        message: 'This value is not valid',
		        feedbackIcons: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },
		        fields: {
		        	milestone_title: {
		                validators: {
		                    notEmpty: {
		                        message: 'The milestone title is required'
		                    }
		                }
		            },
		            milestone_description: {
		                validators: {
		                    notEmpty: {
		                        message: 'The milestone description is required'
		                    }
		                }
		            }
		        }
		    });
			
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
		
		//创建新的milestone
		create: function() {
			//validate
			$('#milestoneAttribute').data('bootstrapValidator').validateField('milestone_title');
			$('#milestoneAttribute').data('bootstrapValidator').validateField('milestone_description');
			if(!$('#milestoneAttribute').data('bootstrapValidator').isValid()) return;
			
			//创建milestone model
			var milestone = new MilestoneModel();
			milestone.set('title', $('#milestone_title').val());
			milestone.set('description', $('#milestone_description').val());
			milestone.set('creator', util.currentUserProfile());
			
			//触发全局事件
			Backbone.trigger('ProjectDetailMilestoneView:createMilestone', milestone);
			
			//隐藏窗口
			$('#create_milestone_sub_view').modal('toggle');
		}
	});
	
	var Header = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">Create Milestone</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var Footer = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="button" class="cancel btn btn-default" data-dismiss="modal">Cancel</a> ' + 
			'	<a type="submit" class="create btn btn-primary">Create</a> ' + 
			'</div> ';
		return tpl;
	}
	
	var Body = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="milestoneAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="milestone_title" class="control-label">Title:</label> ' + 
			'			<input type="text" class="form-control" id="milestone_title" name="milestone_title" placeholder="milestone title..."> ' + 
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="milestone_description" class="control-label">Description:</label> ' + 
			'			<textarea class="form-control" id="milestone_description" name="milestone_description" placeholder="milestone description..."></textarea> ' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}
	
	return ProjectDetailMilestoneView;
});