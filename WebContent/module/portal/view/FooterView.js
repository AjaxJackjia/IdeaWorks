define([ 'backbone', 'util' ], function(Backbone, util) {
	var FooterView = Backbone.View.extend({
		
		tagName: 'footer',
		
		className: 'footer',
		
		id: 'footer',
		
		initialize: function(){
			//navigation
			this.nav = {
				'Help Center': 'index.html#help',
				'About Us'   : 'index.html#about',
				'Contact Us' : 'index.html#contact'
			};
		},
		
		render: function(){
			var $nav = $('<ul class="nav">');
			_.each(this.nav, function(value, key) {
				$nav.append('<li><a href="'+ value +'">' + key + '</a></li>');
			});
			
			var $copyright = $('<div class="copyright">');
			var $copyrightInfo = 'Copyright © ' + (new Date()).getFullYear() + ' <span>CityU</span> All rights reserved.'
			$copyright.html($copyrightInfo);
			
			$(this.el).append($nav);
			$(this.el).append($copyright);
			
			return this;
		}
	});
	
	return FooterView;
});