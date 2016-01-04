define([ 'backbone', 'util', 'i18n!../../../nls/translation' ], function(Backbone, util, i18n) {
	var HelpView = Backbone.View.extend({

		className: 'help-container',
		
		initialize: function(){
			
		},
		
		render: function(){
			var $viewTitle = $('<div class="col-md-12 title">');
			$viewTitle.append('<h1>' + i18n.portal.HelpView.TITLE + '</h1>');
	        
			var $registerTitle = $('<div class="col-md-12 sub-title">');
			$registerTitle.append('<h2 class="line"> <span> <i class="fa fa-sign-in"></i> ' + i18n.portal.HelpView.REGISTER_TITLE + ' </span> </h2>');
			
			var $registerContent = $('<div class="col-md-12 content">');
			var _register = 
				'To register to use IdeaWorks visit the Front page of IdeaWorks and click on the "Register" button at the top of the page. <br/>' +
				'Steps to Register <br/>' +
				'1. Clicking on the "Register " buttons <br/>' +
				'2. Fill out the registration form, making sure that your user name and email are correctly input. You must choose a user type <br/>' +
				'Congratulations! You are now registered to use IdeaWorks';
			$registerContent.append('<p>' + _register + '</p>');
			
			var $joinProjectTitle = $('<div class="col-md-12 sub-title">');
			$joinProjectTitle.append('<h2 class="line"> <span> <i class="fa fa-map"></i> ' + i18n.portal.HelpView.JOIN_PROJECT_TITLE + ' </span> </h2>');
			
			var $joinProjectContent = $('<div class="col-md-12 content">');
			var _joinProject = 
				'When you\'ve created your account, open a project page, click Join Project to start the process of joining a project. <br/>' +
				'If you\'re attempting to join an existing project, you\'re prompted to enter the project name. Generally, this is available from the project founder through an automated email invitation. <br/>' +
				'If you\'re having problems with the project name, contact the group founder to confirm that the info you\'ve entered is correct. <br/>' +
				'To remove yourself from a project, click Leave Project on the project page.';
			$joinProjectContent.append('<p>' + _joinProject + '</p>');
			
			$(this.el).append($viewTitle);
			$(this.el).append($registerTitle);
			$(this.el).append($registerContent);
			$(this.el).append($joinProjectTitle);
			$(this.el).append($joinProjectContent);
			
			return this;
		}
	});
	
	return HelpView;
});