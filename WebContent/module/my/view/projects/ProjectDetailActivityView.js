define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var ProjectDetailActivityView = Backbone.View.extend({
		
		className: 'project-detail-activity-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
		},
		
		render: function(){
			var $activities = $('<div class="activities well">');
			
			for(var index = 0; index<20; index++) {
				$activities.append(activity(1, { }));
			}
			
			$(this.el).append($activities);
			
		    return this;
		}
	});
	
	var activity = function(type, data) {
		var $tpl = 
		'<div class="activity"> ' +
		'  <div class="timeline-icon"> ' +
		'    <i class="fa fa-arrow-right"></i> ' +
		'  </div> ' +
		'  <div class="content"> ' +
		'	<div class="heading"> ' +
		'		<img class="img-circle" src="https://recruitee.com/uploads/candidates/98148/thumb_photo_1445852651.png"> ' +
		'		<span class="time">2 days ago</span> ' + 
		'		<div class="user">Annette Bartoletti</div> ' +
		'	</div>' +
		'	<div class="body"> ' + 
		'		Sent an email to candidate. ' +
		'	</div> ' +
		'  </div> ' +
		'</div>';
		return $tpl;
	};
	
	return ProjectDetailActivityView;
});