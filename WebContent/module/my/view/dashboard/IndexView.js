define([ 'backbone', 'util' ], function(Backbone, util) {
	var IndexView = Backbone.View.extend({
		
		className: 'dashboard-container',
		
		initialize: function(){
			
		},
		
		render: function(){
			var $content = $('<p>Test IndexView!</p>');
			
			$(this.el).append($content);
			
			return this;
		}
	});
	
	return IndexView;
});