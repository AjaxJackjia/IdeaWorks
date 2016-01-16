define([ 
         'backbone', 'util', 'i18n!../../../nls/translation', 
         'view/projects/ProjectDetailModifyView' 
       ], function(Backbone, util, i18n, ProjectDetailModifyView) {
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
			this.nav  = [
			    {
			    	index: i18n.my.LeftPanelView.DASHBOARD,
			    	url: 'my.html#dashboard',
			    	icon: 'line-chart'
			    },
			    {
			    	index: i18n.my.LeftPanelView.PROJECTS,
			    	url: 'my.html#projects',
			    	icon: 'suitcase'
			    },
			    {
			    	index: i18n.my.LeftPanelView.CHAT,
			    	url: 'my.html#chat',
			    	icon: 'comments'
			    },
			    {
			    	index: i18n.my.LeftPanelView.SETTINGS,
			    	url: 'my.html#settings',
			    	icon: 'cog'
			    }
			];
		},
		
		render: function(){

			/*
			 * user profile
			 * */
			var $user = userProfile({ });
			
			/*
			 * navigation list
			 * */
			var $nav = navList(this.nav);
			
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
			$profile.find('img').attr('src', $.cookie('userlogo'));
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
			'	<img src="' + $.cookie('userlogo') + '" class="img-circle" alt="' + $.cookie('nickname') + '"> ' +
			'</a> ' +
			'<a class="username" href="#settings"> ' + 
            '	<h4 title="' + $.cookie('nickname') + '">' + $.cookie('nickname') + '</h4> ' +
            '</a>';
		$user.html(user_tpl);
		
		return $user;
	};
	
	var navList = function(nav) {
		var $nav = $('<nav class="navigation">');
		var nav_tpl = '<ul class="list-unstyled">';
		
		_.each(nav, function(item) {
			nav_tpl += 
				'<li>' + 
            	'	<a href="'+ item.url +'">' +
            	'		<div class="nav-icon"><i class="fa fa-'+ item.icon +'"></i></div>' + 
            	'		<div class="nav-label">' + item.index + '</div>' +
            	'	</a>' +
				'</li>';
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
			'	<div class="create-title">' + i18n.my.LeftPanelView.NEW + '</div>' + 
			'</a>';
		$create.html(create_tpl);
		
		return $create;
	};
	
	return LeftPanelView;
});