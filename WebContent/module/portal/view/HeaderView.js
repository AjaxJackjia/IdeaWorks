define([ 'backbone', 'headroom', 'util' ], function(Backbone, Headroom, util) {
	var HeaderView = Backbone.View.extend({
		
		tagName: 'header',
		
		className: 'header header-fixed',
		
		id: 'header',
		
		initialize: function(){
			//navigation
			this.nav = {
				'Home': 'index.html',
				'News': 'index.html#news',
				'Projects': 'index.html#projects',
				'Login': 'login.html'
			};
		},
		
		render: function(){
			var $nav = $('<ul class="nav nav-main">');
			_.each(this.nav, function(value, key) {
				$nav.append('<li><a href="'+ value +'">' + key + '</a></li>');
			});
			
			var brandUrl = util.baseUrl + '/index.html';
			var $brand = $('<a class="brand" href="'+ brandUrl + '">');
			$brand.append('<img alt="IdeaWorks" src="'+ util.baseUrl +'/res/images/portal/logo.png">');
			
			var $headerWrapper = $('<div class="wrapper">');
			
			$headerWrapper.append($brand);
			$headerWrapper.append($nav);
			
			$(this.el).append($headerWrapper);
			
			return this;
		}
	});
	
	return HeaderView;
});