define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var ProjectDetailMilestoneView = Backbone.View.extend({
		
		className: 'project-detail-milestone-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
		},
		
		render: function(){
			/*
			 * generate milestones
			 * */
			var $milestones = $('<div class="milestones well">');
			
			$milestones.append(mileStoneAdd()); // milestone add button
			for(var index = 0; index<20; index++) {
				$milestones.append(milestone({ 
					id: index
				}));
			}
			
			$(this.el).append($milestones);
			
			/*
			 * milestone add new event
			 * */
			$milestones.find('.add-milestone-title').click(function() {
				alert('add new milestone!');
			});
			
			/*
			 * milestone expand event
			 * */
			var isExpanded = false;
			var scrollY = 0;
			$milestones.find('.milestone > .content > .heading').click(function() {
				//当前点击的milestone
				var $currentMilestone = $(this).closest('.milestone');
				
				//点击的milestone id
				var milestoneId = $currentMilestone.attr('milestoneid');
				
				//非点击的milestone元素
				var $unClickedMilestones = $milestones.children('[milestoneid!='+ milestoneId +']');
				
				if(!isExpanded) {
					//change icon state
					$('.expand-icon  > i').removeClass('fa-angle-down').addClass('fa-angle-up');
					
					//store scroll Y
					scrollY = $('.project-content').scrollTop();
					
					//隐藏非click的milestone元素
					$unClickedMilestones.fadeOut();
					
					//隐藏milestone相关属性
					$currentMilestone.find('.description').hide();
					
					//显示milestone细节
					$currentMilestone.find('.body').append(generateMilestoneDetailDiv({
						id: milestoneId
					}));
					//设置scroll状态
					$('.project-content').scrollTop(0);
					
					//重置状态
					isExpanded = true;
				}else{
					//change icon state
					$('.expand-icon  > i').removeClass('fa-angle-up').addClass('fa-angle-down');
					
					//显示非click的milestone元素
					$unClickedMilestones.fadeIn();
					
					//显示milestone相关属性
					$currentMilestone.find('.description').show();
					
					//隐藏milestone细节
					$currentMilestone.find('.body > .detail').remove();
					
					//restore scroll Y
					$('.project-content').scrollTop(scrollY);
					
					//重置状态
					isExpanded = false;
				}
			});
			
		    return this;
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
	
	var milestone = function(data) {
		var $tpl = 
			'<div class="milestone" milestoneid="'+ data.id +'"> ' +
			'  <div class="timeline-icon"> ' +
			'    <i class="fa fa-flag"></i> ' +
			'  </div> ' +
			'  <div class="content"> ' +
			'	<div class="heading"> ' +
			'		<div class="expand-icon" title="show milestone detail"><i class="fa fa-angle-down"></i></div>' + 
			'		<div class="title">User state exploring (2015-11-01)</div> ' +
			'	</div>' +
			'	<div class="body"> ' + 
			'		<div class="description">Brief description!</div> ' +
			'	</div> ' +
			'  </div> ' +
			'</div>';
		return $tpl;
	};
	
	var generateMilestoneDetailDiv = function(data) {
		var tpl = 
			'<div class="detail">' +
			'	<div class="meta-info"> ' + 
			'		<span class="create-title">create: </span>' + 
			'		<img class="create-operator img-circle" src="http://localhost:8888/IdeaWorks/res/images/my/user/kylee.png"> ' +
			'		<span class="create-time">2 days ago</span> ' + 
			'		<span class="modify-title">modify: </span>' + 
			'		<img class="modify-operator img-circle" src="http://localhost:8888/IdeaWorks/res/images/my/user/kylee.png"> ' +
			'		<span class="modify-time">2 days ago</span> ' + 
			'	</div>' + 
			'	<div class="description-container well">' + 
	        '		<h4 class="heading">Description</h4>' + 
	        '		<div class="description-content">The goal of this project is to contribute to the development of a human-computer interaction environment in which the computer detects and tracks the user\'s emotional, motivational, cognitive and task states, and initiates communications based on this knowledge, rather than simply responding to user commands.</div>' + 
	        '	</div>' + 
			'</div>';
		return tpl;
	};
	
	return ProjectDetailMilestoneView;
});