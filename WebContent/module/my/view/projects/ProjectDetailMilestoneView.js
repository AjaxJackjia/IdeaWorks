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
			
			for(var index = 0; index<20; index++) {
				$milestones.append(milestone({ 
					id: index
				}));
			}
			
			$(this.el).append($milestones);
			
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
					//store scroll Y
					scrollY = $('.project-content').scrollTop();
					
					//隐藏非click的milestone元素
					$unClickedMilestones.fadeOut();
					
					//隐藏milestone相关属性
					$currentMilestone.find('.duration').hide();
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
					//显示非click的milestone元素
					$unClickedMilestones.fadeIn();
					
					//显示milestone相关属性
					$currentMilestone.find('.duration').show();
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
	
	var milestone = function(data) {
		var $tpl = 
		'<div class="milestone" milestoneid="'+ data.id +'"> ' +
		'  <div class="timeline-icon"> ' +
		'    <i class="fa fa-arrow-right"></i> ' +
		'  </div> ' +
		'  <div class="content"> ' +
		'	<div class="heading"> ' +
		'		<span class="modify-time">2 days ago</span> ' + 
		'		<img class="operator img-circle" src="http://localhost:8888/IdeaWorks/res/images/my/user/kylee.png"> ' +
		'		<div class="title">User state exploring</div> ' +
		'	</div>' +
		'	<div class="body"> ' + 
		'		<div class="duration">From 2013-08-01 to 2013-10-31</div> ' +
		'		<div class="description">Brief description!</div> ' +
		'	</div> ' +
		'  </div> ' +
		'</div>';
		return $tpl;
	};
	
	var generateMilestoneDetailDiv = function(data) {
		var tpl = 
			'<div class="detail">' +
			'	<h3 class="detail">Events:</h3>' +
			'	<ul class="list-group">' +
			'	  <li class="list-group-item"><i class="fa fa-plus"></i></li>' +
			'	  <li class="list-group-item">Cras justo odio</li>' +
			'	  <li class="list-group-item">Dapibus ac facilisis in</li>' +
			'	  <li class="list-group-item">Morbi leo risus</li>' +
			'	  <li class="list-group-item">Porta ac consectetur ac</li>' +
			'	  <li class="list-group-item">Vestibulum at eros</li>' +
			'	</ul>' +
			'<div class="container-fluid">' +  //bootstrap-collapsible
		    ' <div class="accordion" id="accordion2">' +
		    '        <div class="accordion-group">' +
		    '          <div class="accordion-heading">' +
		    '            <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseOne">' +
		    '              Click me to exapand. Click me again to collapse. Part I.' +
		    '            </a>' +
		    '          </div>' +
		    '          <div id="collapseOne" class="accordion-body collapse" style="height: 0px; ">' +
		    '            <div class="accordion-inner">' +
		    '              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' +
		    '            </div>' +
		    '          </div>' +
		    '        </div>' +
		    '        <div class="accordion-group">' +
		    '          <div class="accordion-heading">' +
		    '            <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseTwo">' +
		    '             Click me to exapand. Click me again to collapse. Part II.' +
		    '            </a>' +
		    '          </div>' +
		    '          <div id="collapseTwo" class="accordion-body collapse">' +
		    '            <div class="accordion-inner">' +
		    '              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' +
		    '            </div>' +
		    '          </div>' +
		    '        </div>' +
		    '        <div class="accordion-group">' +
		    '          <div class="accordion-heading">' +
		    '            <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseThree">' +
		    '              Click me to exapand. Click me again to collapse. Part III.' +
		    '            </a>' +
		    '          </div>' +
		    '          <div id="collapseThree" class="accordion-body collapse">' +
		    '            <div class="accordion-inner">' +
		    '              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' +
		    '            </div>' +
		    '          </div>' +
		    '        </div>' +
		    '      </div>' +
		    '</div>' +
			'</div>';
		return tpl;
	};
	
	return ProjectDetailMilestoneView;
});