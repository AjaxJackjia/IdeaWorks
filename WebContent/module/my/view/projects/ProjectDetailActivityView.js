define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var ProjectDetailActivityView = Backbone.View.extend({
		
		className: 'project-detail-activity-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addActivity');
			
			//监听model变化
			this.model.bind('add', this.addActivity);
		},
		
		render: function(){
			var $activities = $('<div class="activities well">');
			$activities.append('<div class="placeholder"><h4>No activity...</h4></div>');
			$(this.el).append($activities);
			
		    return this;
		},
		
		addActivity: function(activity) {	
			var $content = $(this.el).find('.activities');
			var $placeholder = $content.find('.placeholder');
			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			$content.prepend(ActivityItem(activity));
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
	
	return ProjectDetailActivityView;
});