define([ 'backbone', 'util' ], function(Backbone, util) {
	var HelpView = Backbone.View.extend({

		className: 'help-container',
		
		initialize: function(){
			
		},
		
		render: function(){
			var $viewTitle = $('<div class="col-md-12 title">');
			$viewTitle.append('<h1>Online Help</h1>');
	        
			var $registerTitle = $('<div class="col-md-12 sub-title">');
			$registerTitle.append('<h2 class="line"> <span> <i class="fa fa-group"></i> How to register </span> </h2>');
			
			var $registerContent = $('<div class="col-md-12 content">');
			var _register = 
				'To register to use IdeaWorks visit the Front page of IdeaWorks and click on the "Register" button at the top of the page. <br/>' +
				'Steps to Register <br/>' +
				'1. Clicking on the "Register " buttons <br/>' +
				'2. Fill out the registration form, making sure that your user name and email are correctly input. You must choose a user type <br/>' +
				'Congratulations! You are now registered to use IdeaWorks';
			$registerContent.append('<p>' + _register + '</p>');
			
			var $joinProjectTitle = $('<div class="col-md-12 sub-title">');
			$joinProjectTitle.append('<h2 class="line"> <span> <i class="fa fa-history"></i> How to join a project </span> </h2>');
			
			var $joinProjectContent = $('<div class="col-md-12 content">');
			var _joinProject = 
				'When you\'ve created your account, open a project page, click Join Project to start the process of joining a project. <br/>' +
				'If you\'re attempting to join an existing project, you\'re prompted to enter the project name. Generally, this is available from the project founder through an automated email invitation. <br/>' +
				'If you\'re having problems with the project name, contact the group founder to confirm that the info you\'ve entered is correct. <br/>' +
				'To remove yourself from a project, click Leave Project on the project page.';
			$joinProjectContent.append('<p>' + _joinProject + '</p>');
			
			var $joinGroupTitle = $('<div class="col-md-12 sub-title">');
			$joinGroupTitle.append('<h2 class="line"> <span> <i class="fa fa-paper-plane"></i> How to join an interest group </span> </h2>');
			
			var $joinGroupContent = $('<div class="col-md-12 content">');
			var _joinGroup = 
				'When you\'ve created your account, open a group page, click Join Group to start the process of joining an interest group. <br/>' +
				'If you\'re attempting to join an existing group, you\'re prompted to enter the group name. Generally, this is available from the group administrator through an automated email invitation. <br/>' +
				'If you\'re having problems with the group name, contact the administrator to confirm that the info you\'ve entered is correct. <br/>' +
				'To remove yourself from a group, click Leave Group on the group page.';
			$joinGroupContent.append('<p>' + _joinGroup + '</p>');
			
			$(this.el).append($viewTitle);
			$(this.el).append($registerTitle);
			$(this.el).append($registerContent);
			$(this.el).append($joinProjectTitle);
			$(this.el).append($joinProjectContent);
			$(this.el).append($joinGroupTitle);
			$(this.el).append($joinGroupContent);
			
			return this;
		}
	});
	
	return HelpView;
});