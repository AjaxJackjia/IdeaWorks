(function(win){
	require.config({
		paths: {
			'jquery': '../../lib/jquery/dist/jquery.min',
			'cookie' : '../../lib/jquery.cookie/jquery.cookie',
			'backbone': '../../lib/backbone/backbone',
			'underscore': '../../lib/underscore/underscore-min',
			'bootstrap' : '../../lib/bootstrap/dist/js/bootstrap.min',
			'Validator' : '../../lib/bootstrapvalidator/dist/js/bootstrapValidator.min',
			'util': '../common/util',
			'MD5' : '../../lib/js-md5/build/md5.min',
			'css': '../../lib/require-css/css.min'
		},
		
		shim: {
	        'underscore': {
	            exports: '_'
	        },
	        'jquery': {
	            exports: '$'
	        },
	        'backbone': {
	            deps: ['underscore', 'jquery'],
	            exports: 'Backbone'
	        },
	        'bootstrap': {  
	            deps : [ 'jquery' ],  
	            exports : 'bootstrap'
	       },
	       'Validator': {  
	            deps : [ 'jquery' ],  
	            exports : 'Validator'
	       },
	       'MD5' : {
	    	   exports: 'MD5'
	       }
		}  
	});
	
	require(['backbone', 
	         'bootstrap', 
	         'css!../../res/css/login/main.css',
	         'util',
	         './view/SigninView',
	         './view/SignupView'
	        ], function(Backbone, bootstrap, css, util, SigninView, SignupView) {
		
		var Entry = Backbone.View.extend({
			el: 'div.container',
			
			events: {
				'click .tabs li': 'switchOption'
			},
			
			initialize: function(){
				this.render();
			},
			
			render: function(){
				//logo
				var $logo = $('<div id="logo">');
				$logo.append('<a href="'+ util.baseUrl +'">');
				$logo.find('a').append('<img alt="IdeaWorks" src="'+ util.baseUrl +'/res/images/portal/logo.png">');
				
				//tabs-container
				var $well = $('<div class="tabs-container">');
				
				var $tabs = $('<ul class="tabs nav nav-tabs" role="tablist">');
				$tabs.append($('<li class="active"><a data-target="#login">Sign In</a></li>'));
				$tabs.append($('<li><a data-target="#signup">Sign Up</a></li>'));
				$well.append($tabs);
				$('title').html('Sign in :: IdeaWorks');
				
				var $tabContent = $('<div class="tab-content">');
				var signinView = new SigninView();
				$tabContent.append($('<div class="tab-pane active" id="login">'));
				$tabContent.find('#login').append(signinView.render().el);
				
				var signupView = new SignupView();
				$tabContent.append($('<div class="tab-pane" id="signup">'));
				$tabContent.find('#signup').append(signupView.render().el);
				
				$well.append($tabContent);
				
				$(this.el).append($logo);
				$(this.el).append($well);
			},
			
			switchOption: function(e) {
				$(e.target).tab('show');
				
				//modify page title
				if($(e.target).html() === 'Sign In') {
					$('title').html('Sign in :: IdeaWorks');
				}else{
					$('title').html('Sign up :: IdeaWorks');
				}
			}
		});
		
		var entry = new Entry();
	});
})(window);
	