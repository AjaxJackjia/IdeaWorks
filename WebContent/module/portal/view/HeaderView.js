define([ 'backbone', 'headroom', 'util', 'i18n!../../../nls/translation' ], function(Backbone, Headroom, util, i18n) {
	var HeaderView = Backbone.View.extend({
		
		tagName: 'header',
		
		className: 'header header-fixed',
		
		id: 'header',
		
		initialize: function(){
			//navigation
			this.nav = [{
				index: i18n.portal.HeaderView.HOME,
				url: 'index.html'
			},{
				index: i18n.portal.HeaderView.NEWS,
				url: 'index.html#news'
			},{
				index: i18n.portal.HeaderView.PROJECTS,
				url: 'index.html#projects'
			},{
				index: i18n.portal.HeaderView.LOGIN,
				url: 'login.html'
			}];
		},
		
		render: function(){
			var $nav = $('<ul class="nav nav-main">');
			_.each(this.nav, function(item) {
				$nav.append('<li><a href="'+ item.url +'">' + item.index + '</a></li>');
			});
			
			var brandUrl = 'index.html';
			var $brand = $('<a class="brand" href="'+ brandUrl + '">');
			$brand.append('<img alt="IdeaWorks" src="res/images/portal/logo.png">');
			
			var $headerWrapper = $('<div class="wrapper">');
			
			$headerWrapper.append($brand);
			$headerWrapper.append($nav);
			
			$(this.el).append($headerWrapper);
			
			return this;
		}
	});
	
	return HeaderView;
});