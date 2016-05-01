define([ 
         'backbone', 'util',
         'i18n!../../../../nls/translation'
       ], 
    function(Backbone, util, i18n) {
	var ProjectDetailActivityView = Backbone.View.extend({
		
		className: 'project-detail-activity-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addActivity', 'loadMoreActivity');
		},
		
		events: {
			'click .load-more': 'loadMoreActivity'
		},
		
		render: function(){
			var $activities = $('<div class="activities well">');
			$activities.append('<div class="placeholder"><h4>No activity...</h4></div>');
			$(this.el).append($activities);
			
			//初始化activity
			this.loadMoreActivity();
			
		    return this;
		},
		
		addActivity: function() {	
			var $content = $(this.el).find('.activities');
			var $placeholder = $content.find('.placeholder');
			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			var $more = $content.find('.load-more');
			if($more.length > 0) {
				$more.remove();
			}
			
			if(this.model.totalCount != 0 || this.model.models != 0) { //当有model时，加载activity
				_.each(this.model.models, function(activity, index) {
					$content.append(ActivityItem(activity));
				});
				
				//若没有完全加载则显示“加载更多按钮”
				if(!this.model.isLoadAll) {
					$content.append(MoreActivityItem());
				}
			}else{ //当没有model时，添加placeholder
				$content.append('<div class="placeholder"><h4>No activity...</h4></div>');
			}
		},
		
		loadMoreActivity: function() {
			this.model.nextPage(this.addActivity);
		}
	});
	
	var ActivityItem = function(activity) {
		var operator = activity.get('operator');
		var $tpl = 
			'<div class="activity"> ' +
			'  <div class="timeline-icon"> ' +
			'    <i class="fa fa-arrow-right"></i> ' +
			'  </div> ' +
			'  <div class="content"> ' +
			'	<div class="heading"> ' +
			'		<img class="img-circle" title="' + operator.nickname + '" src="' + operator.logo + '"> ' +
			'		<span class="time">' + util.timeformat(new Date(activity.get('time')), "smart") + '</span> ' + 
			'		<div class="user">' + operator.nickname + '</div> ' +
			'	</div>' +
			'	<div class="body">'+ activity.get('title') +'</div> ' +
			'  </div> ' +
			'</div>';
		return $tpl;
	};
	
	var MoreActivityItem = function() {
		var $tpl = 
			'<div class="activity load-more"> ' +
			'  <div class="timeline-icon"> ' +
			'    <i class="fa fa-chevron-down"></i> ' +
			'  </div> ' +
			'  <div class="content"> ' +
			'    <h4 class="load-more-content">' + i18n.my.projects.ProjectDetailActivityView.LOAD_MORE + '</h4> ' + 
			'  </div> ' +
			'</div>';
		return $tpl;
	};
	
	return ProjectDetailActivityView;
});