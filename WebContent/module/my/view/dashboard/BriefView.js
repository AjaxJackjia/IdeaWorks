define([ 'backbone', 'util', 'i18n!../../../../nls/translation' ], function(Backbone, util, i18n) {
	var BriefView = Backbone.View.extend({
		
		className: 'brief-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'update');
			
			//监听model变化
			this.model.bind('change', this.update);
			
			this.render();
		},
		
		render: function(){
			$(this.el).append(BriefItem('suitcase', this.model.get('projectNo'), i18n.my.dashboard.BriefView.PROJECTS));
			$(this.el).append(BriefItem('thumbs-up', this.model.get('activityNo'), i18n.my.dashboard.BriefView.ACTIVITIES));
			$(this.el).append(BriefItem('users', this.model.get('relatedMemberNo'), i18n.my.dashboard.BriefView.RELATED_MEMBERS));
			$(this.el).append(BriefItem('history', this.model.get('forumParticipationNo'), i18n.my.dashboard.BriefView.FORUM_PARTICIPATIONS));
			
			return this;
		},
		
		update: function() {
			var model = this.model;
			
			//更新每个元素值
			_.each($(this.el).find('.stats h3'), function(item, index) {
				switch(index) {
				case 0: 
					$(item).html(model.get('projectNo'));break;
				case 1: 
					$(item).html(model.get('activityNo'));break;
				case 2: 
					$(item).html(model.get('relatedMemberNo'));break;
				case 3: 
					$(item).html(model.get('forumParticipationNo'));break;
				}
			});
		}
	});
	
	var BriefItem = function(icon, number_content, title_content) {
		var $item = $('<a class="stats" href="javascript:;">');
		var $well = $('<div class="well">');
		
		$well.append('<i class="fa fa-'+ icon +'"></i>');
		$well.append('<h3 class="darker-text-color">'+ number_content +'</h3>');
		$well.append('<p class="text-color">'+ title_content +'</p>');
		
		$item.append($well);

		return $item;
	};
	
	return BriefView;
});