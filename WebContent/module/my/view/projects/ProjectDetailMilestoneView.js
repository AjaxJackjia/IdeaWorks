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
			$milestones.append(mileStoneAdd()); // milestone add button
			$(this.el).append($milestones);
			
		    return this;
		},
		
		/*
		 * 向milestone集合中添加milestone所触发的事件
		 * */
		addMilestone: function(milestone) {
			var $milestones = $(this.el).find('.milestones');
			$milestones.append(MilestoneItem(milestone));
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
	
	var mileStoneAdd = function() {
		var $tpl = 
			'<div class="milestone"> ' +
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
	
	return ProjectDetailMilestoneView;
});