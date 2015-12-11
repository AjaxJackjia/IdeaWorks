define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var ProjectDetailMilestoneItemView = Backbone.View.extend({
		
		className: 'milestone project-detail-milestone-item-view',
		
		events: {
			'click .content .heading': 'toggle',
			'click .modify-milestone': 'modifyMilestone',
			'click .delete-milestone': 'deleteMilestone'
		},
		
		initialize: function(){
			//添加view dom的其他属性
			$(this.el).attr('cid', this.model.cid);
			
			//确保在正确作用域
			_.bindAll(this, 'render', 'toggle', 'modifyMilestone', 'deleteMilestone');
			
			//监听model变化
			this.model.bind('change', this.render);
			
			//global param
			this.isExpanded = false; 	//控制milestone item伸缩的标志位
			
			//初始化scrollY
			if($.cookie('scrollY_milestone') == null) {
				$.cookie('scrollY_milestone', 0);
			}
			
			this.render();
		},
		
		render: function() {
			var milestone = this.model;
			
			if(!this.isExpanded) 
			{
				//milestone item 未展开
				var milestoneItem = MilestoneItemShrink(milestone);
				$(this.el).html(milestoneItem);
				
				//其他milestone处于show状态
				$('.add-milestone').fadeIn();
				$('.milestone[cid!='+ milestone.cid +']').fadeIn();
				
				//还原scrollY位置
				$('.project-content').scrollTop( $.cookie('scrollY_milestone') );
			}
			else
			{
				//milestone item 展开
				var milestoneItem = MilestoneItemExpand(milestone);
				$(this.el).html(milestoneItem);
				
				//其他milestone处于hide状态
				$('.add-milestone').hide();
				$('.milestone[cid!='+ milestone.cid +']').hide();
			}
			
		    return this;
		},
		
		toggle: function() {
			this.isExpanded = !this.isExpanded;
			
			//记录点击milestone时的scrollY的位置，以便还原
			if(this.isExpanded) {
				var currentScrollY = $('.project-content').scrollTop();
				$.cookie('scrollY_milestone', currentScrollY);
			}
			
			this.render();
		},
		
		modifyMilestone: function() {
			var modifyMilestoneSubView = new ModifyMilestoneSubView({
				model: this.model
			});
			
			var $modifyView = $('#modify_milestone_sub_view');
			if($modifyView.length > 0) {
				$('#modify_milestone_sub_view').remove();
			}
			$('.content-panel').append($(modifyMilestoneSubView.render().el));
			
			//显示view
			$('#modify_milestone_sub_view').modal('toggle');
		},
		
		deleteMilestone: function() {
			if(confirm('Do you want to delete this milestone?')) {
				//触发全局事件
				Backbone.trigger('ProjectDetailMilestoneView:deleteMilestone', this.model);
			}
		}
	});
	
	/*
	 * view component html template - milestone item shrink view
	 * */
	var MilestoneItemShrink = function(milestone) {
		var creator = milestone.get('creator');
		var $tpl = 
			'<div class="timeline-icon"> ' +
			'  <i class="fa fa-flag"></i> ' +
			'</div> ' +
			'<div class="content"> ' +
			'	<div class="heading"> ' +
			'		<div class="expand-icon" title="show milestone detail"><i class="fa fa-angle-down"></i></div>' + 
			'		<div class="title" cid="'+ milestone.cid +'">'+ milestone.get('title') + '</div> ' +
			'	</div>' +
			'	<div class="body"> ' + 
			'		<div class="meta">' + 
			'			<img class="creator img-circle" title="' + creator.nickname + '" src="' + util.baseUrl + creator.logo + '"/> ' + 
			'			<div class="time">' + util.timeformat(new Date(milestone.get('time')), "smart") + '</div> ' + 
			'		</div> ' +
			'		<div class="description" title="'+ milestone.get('description') + '">'+ milestone.get('description') + '</div> ' +
			'		</div> ' +
			'</div>';
		return $tpl;
	};
	
	/*
	 * view component html template - milestone item expand view
	 * */
	var MilestoneItemExpand = function(milestone) {
		var creator = milestone.get('creator');
		var $tpl = 
			'<div class="timeline-icon"> ' +
			'  <i class="fa fa-flag"></i> ' +
			'</div> ' +
			'<div class="content"> ' +
			'	<div class="heading"> ' +
			'		<div class="expand-icon" title="show milestone detail"><i class="fa fa-angle-up"></i></div>' + 
			'		<div class="title" cid="'+ milestone.cid +'">'+ milestone.get('title') + '</div> ' +
			'	</div>' +
			'	<div class="body"> ' + 
			'		<div class="detail">' +
			'			<div class="meta-info"> ' + 
			'				<img class="create-operator img-circle" title="' + creator.nickname + '" src="' + util.baseUrl + creator.logo + '"> ' +
			'				<span class="create-operator-nickname">' + creator.nickname + '</span>' +
			'				<span class="create-title"> create this milestone at </span>' + 
			'				<span class="create-time">' + util.timeformat(new Date(milestone.get('time')), "smart") + '</span> ' + 
			'				<div class="milestone-action"> ' + 
			'					<a class="modify-milestone btn btn-default"> ' + 
			'						<i class="fa fa-pencil"></i> Edit' +
			'					</a>' + 
			'					<a class="delete-milestone btn btn-default"> ' + 
			'						<i class="fa fa-trash"></i> Delete' +
			'					</a>' + 
			'				</div> ' + 
			'			</div>' + 
			'			<div class="description-container well">' + 
	        '				<h4 class="heading">Description</h4>' + 
	        '				<div class="description-content">'+ milestone.get('description') + '</div>' + 
	        '			</div>' + 
			'		</div>' + 
			'	</div> ' +
			'</div>';
		return $tpl;
	};
	
	/*
	 * subview - modify milestone sub view
	 * */
	var ModifyMilestoneSubView = Backbone.View.extend({
		
		id: 'modify_milestone_sub_view',
		
		className: 'modify-milestone-sub-view modal fade',
		
		events: {
			'click .save': 'save'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'save');
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
			
			//bind modal event through jquery
			$(this.el).on('show.bs.modal', function (event) {
				var $dom = $(this);
				
				//将milestone basic info 填充到相应区域
				$dom.find('#milestone_title').val(self.model.get('title'));
				$dom.find('#milestone_description').val(self.model.get('description'));
			});
			
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		//保存milestone修改
		save: function() {
			//validate
			$('#milestoneAttribute').data('bootstrapValidator').validateField('milestone_title');
			$('#milestoneAttribute').data('bootstrapValidator').validateField('milestone_description');
			if(!$('#milestoneAttribute').data('bootstrapValidator').isValid()) return;
			
			//修改milestone
			this.model.set('title', $('#milestone_title').val());
			this.model.save('description', $('#milestone_description').val(), {
				wait: true,
				error: function(model, response, options) {
					var alertMsg = 'Update milestone failed. Please try again later!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
			
			$('#modify_milestone_sub_view').modal('toggle');
		}
	});
	
	var Header = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">Modify Milestone</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var Footer = function() {
		var tpl = 
				'<div class="modal-footer"> ' + 
				'	<a type="button" class="cancel btn btn-default" data-dismiss="modal">Cancel</a> ' + 
				'	<a type="submit" class="save btn btn-primary">Save</a> ' + 
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
	
	return ProjectDetailMilestoneItemView;
});