define([ 'backbone', 'util' ], function(Backbone, util) {
	var BriefView = Backbone.View.extend({
		
		className: 'brief-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
			
			this.render();
		},
		
		render: function(){

			$(this.el).append(BriefItem('#projects', 'suitcase', '18', 'projects'));
			$(this.el).append(BriefItem('#projects', 'thumbs-up', '22', 'activities'));
			$(this.el).append(BriefItem('#projects', 'users', '51', 'related members'));
			$(this.el).append(BriefItem('#projects', 'history', '12', 'forum participations'));
			
			return this;
		}
	});
	
	var BriefItem = function(link, icon, number_content, title_content) {
		var $item = $('<div class="stats" href="' + link + '">');
		var $well = $('<div class="well">');
		
		$well.append('<i class="fa fa-'+ icon +'"></i>');
		$well.append('<h3 class="darker-text-color">'+ number_content +'</h3>');
		$well.append('<p class="text-color">'+ title_content +'</p>');
		
		$item.append($well);

		return $item;
	};
	
	return BriefView;
});