require.config({
	paths: {
		'jquery': '../../lib/jquery/dist/jquery.min',
		'backbone': '../../lib/backbone/backbone-min',
		'underscore': '../../lib/underscore/underscore-min',
		'bootstrap' : '../../lib/bootstrap/dist/js/bootstrap.min'  
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
       }
	}  
});

require(['backbone', 'bootstrap', '../common/util', './view/LoginView', './view/SignupView' ], function(Backbone, bootstrap, util, LoginView, SignupView) {
	//load css file
	util.loadcss('res/css/login/main.css');
	
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
			$logo.find('a').append('<img alt="IdeaWorks" src="'+ util.baseUrl +'/res/images/login/logo_login.png">');
			
			//tabs-container
			var $well = $('<div class="tabs-container">');
			
			var $tabs = $('<ul class="tabs nav nav-tabs" role="tablist">');
			$tabs.append($('<li class="active"><a data-target="#login">Login</a></li>'));
			$tabs.append($('<li><a data-target="#signup">Sign Up</a></li>'));
			$well.append($tabs);
			
			var $tabContent = $('<div class="tab-content">');
			var loginView = new LoginView();
			$tabContent.append($('<div class="tab-pane active" id="login">'));
			$tabContent.find('#login').append(loginView.render().el);
			
			var signupView = new SignupView();
			$tabContent.append($('<div class="tab-pane" id="signup">'));
			$tabContent.find('#signup').append(signupView.render().el);
			
			$well.append($tabContent);
			
			$(this.el).append($logo);
			$(this.el).append($well);
		},
		
		switchOption: function(e) {
			console.log(e);
			$(e.target).tab('show');
		}
	});
	
	var entry = new Entry();
});
