define([ 'backbone', 'util', 'view/projects/ProjectDetailModifyView' ], function(Backbone, util, ProjectDetailModifyView) {
	var LeftPanelView = Backbone.View.extend({
		
		className: 'left-panel',
		
		events: {
			'click .navigation > .list-unstyled > li': 'select',
			'click .create > a': 'createProject'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'select', 'createProject', 'updateProfile');
			
			//注册全局事件
			Backbone.
				off('LeftPanelView:updateProfile').
				on('LeftPanelView:updateProfile', this.updateProfile, this);
			
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
			 * new project
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
		},
		
		createProject: function() {
			//跳转视图到project
			$($('.navigation > .list-unstyled > li > a')[1]).click();
			window.location.href = 'my.html#projects';
			
			//将旧的modal view移除,新的modal view添加到内容区域
			var projectDetailModify = new ProjectDetailModifyView({
				model: null
			});
			
			var $modifyView = $('#project_detail_modify_view');
			if($modifyView.length > 0) {
				$('#project_detail_modify_view').remove();
			}
			$('.content-panel').append($(projectDetailModify.render().el));
			
			//显示view
			$('#project_detail_modify_view').modal('toggle');
		},
		
		updateProfile: function() {
			var $profile = $('.profile', this.el);
			$profile.find('img').attr('src', util.baseUrl + $.cookie('userlogo'));
			$profile.find('img').attr('alt', $.cookie('nickname'));
			$profile.find('h4').attr('title', $.cookie('nickname'));
			$profile.find('h4').html($.cookie('nickname'));
		}
	});
	
	var userProfile = function(user) {
		//user.avatar
		//user.name
		var $user = $('<div class="profile">');
		var user_tpl = 
			'<a class="avatar" href="#settings"> ' + 
			'	<img src="'+ util.baseUrl + $.cookie('userlogo') + '" class="img-circle" alt="' + $.cookie('nickname') + '"> ' +
			'</a> ' +
			'<a class="username" href="#settings"> ' + 
            '	<h4 title="' + $.cookie('nickname') + '">' + $.cookie('nickname') + '</h4> ' +
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