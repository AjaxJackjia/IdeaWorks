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
				Dashboard: 'line-chart',
				Projects : 'suitcase',
				Settings : 'cog'
			};
		},
		
		render: function(){

			/*
			 * user profile
			 * */
			var $user = userProfile({ });
			
			/*
			 * navigation list
			 * */
			var $nav = navList(this.nav, this.navIcon);
			
			/*
			 * new something
			 * */
			var $create = createBtn();

			$(this.el).append($user);
			$(this.el).append($nav);
			$(this.el).append($create);
			
			return this;
		},
		
		select: function(e) {
			$('.navigation > .list-unstyled > li').removeClass('active');
			$(e.target).closest('li').addClass('active');
		}
	});
	
	var userProfile = function(user) {
		//user.avatar
		//user.name
		var $user = $('<div class="profile">');
		var user_tpl = 
			'<a class="avatar" href="#settings"> ' + 
			'	<img src="'+ util.baseUrl +'/res/images/my/avatar.png" class="img-circle" alt="..."> ' +
			'</a> ' +
			'<a class="username" href="#settings"> ' + 
            '	<h4>Jack Jia</h4> ' +
            '</a>';
		$user.html(user_tpl);
		
		return $user;
	};
	
	var navList = function(nav, navIcons) {
		var $nav = $('<nav class="navigation">');
		var nav_tpl = '<ul class="list-unstyled">';
		
		_.each(nav, function(value, key) {
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
		
		return $nav;
	};
	
	var createBtn = function() {
		var $create = $('<div class="create">');
		var create_tpl = 
			'<a href="javascript:;">' + 
			'	<div class="nav-icon fa fa-plus-circle"></div>' + 
			'	<div class="create-title">New</div>' + 
			'</a>';
		$create.html(create_tpl);
		
		return $create;
	};
	
	return LeftPanelView;
});