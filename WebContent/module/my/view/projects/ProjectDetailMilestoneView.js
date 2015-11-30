define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var ProjectDetailMilestoneView = Backbone.View.extend({
		
		className: 'project-detail-milestone-view',
		
		events: {
			'click .add-milestone-title': 'createMilestone',
			'click .milestone > .content > .heading': 'toggleDetail'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addMilestone', 'createMilestone', 'toggleDetail');
			
			//监听model变化
			this.model.bind('add', this.addMilestone);
			
			//global param
			this.isExpanded = false;
			this.scrollY = 0;
		},
		
		render: function(){
			var $milestones = $('<div class="milestones well">');
			$milestones.append(MileStoneAddBtn()); // milestone add button
			$(this.el).append($milestones);
			
		    return this;
		},
		
		/*
		 * 向milestone集合中添加milestone所触发的事件
		 * */
		addMilestone: function(milestone) {
			var $milestoneAddBtn = $(this.el).find('.milestone.add-milestone');
			var milestoneItem = MilestoneItem(milestone);
			$(milestoneItem).insertAfter($milestoneAddBtn);
		},
		
		/*
		 * milestone add new event
		 * */
		createMilestone: function() {
			alert('add new milestone! by click event! ');
		},
		
		/*
		 * toggle milestone expand event
		 * */
		toggleDetail: function(event) {
			//milestone model cid
			var cid = $(event.target).closest('.heading').find('.title').attr('cid');
			var milestoneModel = this.model.get(cid);
			
			//当前点击的milestone
			var $currentMilestone = $(event.target).closest('.milestone');
			//非点击的milestone元素
			var $unClickedMilestones = $('.milestones').children('[milestoneid!='+ milestoneModel.get('milestoneid') +']');
			
			if(!this.isExpanded) {
				//change icon state
				$('.expand-icon  > i').removeClass('fa-angle-down').addClass('fa-angle-up');
				
				//store scroll Y
				this.scrollY = $('.project-content').scrollTop();
				
				//隐藏非click的milestone元素
				$unClickedMilestones.hide();
				
				//隐藏milestone相关属性
				$currentMilestone.find('.meta').hide();
				$currentMilestone.find('.description').hide();
				
				//显示milestone细节
				$currentMilestone.find('.body').append(MilestoneDetailItem(milestoneModel));
				
				//设置scroll状态
				$('.project-content').scrollTop(0);
				
				//重置状态
				this.isExpanded = true;
			}else{
				//change icon state
				$('.expand-icon  > i').removeClass('fa-angle-up').addClass('fa-angle-down');
				
				//显示非click的milestone元素
				$unClickedMilestones.fadeIn();
				
				//显示milestone相关属性
				$currentMilestone.find('.meta').show();
				$currentMilestone.find('.description').show();
				
				//隐藏milestone细节
				$currentMilestone.find('.body > .detail').remove();
				
				//restore scroll Y
				$('.project-content').scrollTop(this.scrollY);
				
				//重置状态
				this.isExpanded = false;
			}
		}
	});
	
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
	
	var MilestoneItem = function(milestone) {
		var creator = milestone.get('creator');
		var $tpl = 
			'<div class="milestone" milestoneid="'+ milestone.get('milestoneid') +'"> ' +
			'  <div class="timeline-icon"> ' +
			'    <i class="fa fa-flag"></i> ' +
			'  </div> ' +
			'  <div class="content"> ' +
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
			'	</div> ' +
			'  </div> ' +
			'</div>';
		return $tpl;
	};
	
	var MilestoneDetailItem= function(milestone) {
		var creator = milestone.get('creator');
		var tpl = 
			'<div class="detail">' +
			'	<div class="meta-info"> ' + 
			'		<img class="create-operator img-circle" title="' + creator.nickname + '" src="' + util.baseUrl + creator.logo + '"> ' +
			'		<span class="create-operator-nickname">' + creator.nickname + '</span>' +
			'		<span class="create-title"> create this milestone at </span>' + 
			'		<span class="create-time">' + util.timeformat(new Date(milestone.get('time')), "smart") + '</span> ' + 
			'	</div>' + 
			'	<div class="description-container well">' + 
	        '		<h4 class="heading">Description</h4>' + 
	        '		<div class="description-content">'+ milestone.get('description') + '</div>' + 
	        '	</div>' + 
			'</div>';
		return tpl;
	};
	
	/***********************************************************************************/
	/*
	 * subview - milestone sub view
	 * */
	var MilestoneSubView = Backbone.View.extend({
		
		id: 'milestone_sub_view',
		
		className: 'milestone-sub-view modal fade',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'create', 'save');
			
			//view type, 'create' view or 'modify' view, default is 'create'.
			this.type = 'create';
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
			
			//设置标题
			var milestones = this.model;
			if(this.type == 'create') {
				$('.modal-title', this.el).html('Create Milestone');
				$('.modal-footer > .confirm', this.el).html('Create');
			}else{
				$('.modal-title', this.el).html('Modify Milestone');
				$('.modal-footer > .confirm', this.el).html('Save');
				
				$('.milestone-title').val(this.model.get());
				$('.milestone-description').val();
			}
			
			//confirm self body
			var self = this;
			
			//save操作
			$('.confirm', $modalDialogContent).on('click', function() {
				if(self.type == 'create') {
					self.create();
				}else{
					self.save();
				}
			});
			
			//绑定modal消失时出发的事件
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
			
		},
		
		//修改milestone
		save: function() {
			var milestones = this.model;
			var title = $('.milestone-title').val();
			var content = $('.milestone-description').val();
			if(title == "" || content == "") {
				alert("Please wirte something about your milestone...");
				return;
			}
			
			if(project.get('abstractContent') != content) {
				project.set({'abstractContent': content});
				project.save({
					wait: true,
					error: function() {
						project.previous("abstractContent");
						alert("Update project abstract error! Please try again later...");
					}
				});
			}
			$('#milestone_sub_view').modal('toggle');
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
			'	<a type="button" class="cancel btn btn-default" data-dismiss="modal">Cancel</a> ' + 
			'	<a type="submit" class="confirm btn btn-primary"></a> ' + 
			'</div> ';
		return tpl;
	}
	
	var Body = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="milestoneAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="milestone_title" class="control-label">Title:</label> ' + 
			'			<input type="text" class="form-control" id="milestone_title" name="milestone_title" placeholder="milestone title"> ' + 
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="milestone_description" class="control-label">Advisor:</label> ' + 
			'			<textarea class="form-control" id="milestone_description" name="milestone_title"> ' + 
			'			</textarea> ' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}
	
	return ProjectDetailMilestoneView;
});