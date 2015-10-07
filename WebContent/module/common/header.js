define([ 'backbone' ], function() {
	var HeaderView = Backbone.View.extend({
		
		tagName: 'div',
		
		className: '.header',
		
		initialize: function(){
			//navigation
			this.nav = {
				home: 'index.html',
				projects: 'index.html#projects',
				login: 'login.html'
			};
		},
		
		render: function(){
			
		}
	});
	
	return HeaderView;
});