define([ 'backbone', 'util' ], function(Backbone, util) {
	var LeftPanelView = Backbone.View.extend({
		
		className: 'left-panel',
		
		events: {
			'click .navigation > .list-unstyled > li': 'select'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'select');
			
			//navigation
			this.nav = {
				Dashboard: 'my.html#dashboard',
				Projects : 'my.html#projects',
				Settings : 'my.html#settings'
			};
			
			this.navIcon = {
				Dashboard: 'briefcase',
				Projects : 'archive',
				Settings : 'cog'
			};
		},
		
		render: function(){

			/*
			 * user profile
			 * */
			var $user = $('<div class="profile">');
			var user_tpl = 
				'<a class="avatar" href="#"> ' + 
				'	<img src="'+ util.baseUrl +'/res/images/my/avatar.jpg" class="img-circle" alt="..."> ' +
				'</a> ' +
				'<a class="username" href="#"> ' + 
	            '	<h4>Jack Jia</h4> ' +
	            '</a>';
			$user.html(user_tpl);
			
			/*
			 * navigation list
			 * */
			var navIcons = this.navIcon;
			var $nav = $('<nav class="navigation">');
			var nav_tpl = '<ul class="list-unstyled">';
			
			_.each(this.nav, function(value, key) {
				if(key == 'Projects') {
					nav_tpl += 
						'<li>' + 
		            	'	<a href="'+ value +'">' +
		            	'		<div class="nav-icon"><i class="fa fa-'+ navIcons[key] +'"></i></div>' + 
		            	'		<div class="nav-label">' + key + '</div>' +
		            	'	</a>' +
						'</li>';
				}else{
					nav_tpl += 
						'<li>' + 
		            	'	<a href="'+ value +'">' +
		            	'		<div class="nav-icon"><i class="fa fa-'+ navIcons[key] +'"></i></div>' + 
		            	'		<div class="nav-label">' + key + '</div>' +
		            	'	</a>' +
						'</li>';
				}
			});
			nav_tpl += '</ul>';
			$nav.html(nav_tpl);

			$(this.el).append($user);
			$(this.el).append($nav);
			
			return this;
		},
		
		select: function(e) {
			$('.navigation > .list-unstyled > li').removeClass('active');
			$(e.target).closest('li').addClass('active');
		}
	});
	
	return LeftPanelView;
});