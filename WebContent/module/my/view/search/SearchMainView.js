define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var SearchMainView = Backbone.View.extend({
		
		className: 'search-main-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender');
		},
		
		render: function(){
			$(this.el).html('<div class="placeholder"><h4>This part will coming soon :) </h4></div>');
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		}
	});
	
	return SearchMainView;
});