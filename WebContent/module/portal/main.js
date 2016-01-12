(function(win){
	require.config({
		waitSeconds: 30,
		
		locale: sessionStorage.getItem('lang') || 'en-us',
		
		paths: {
			'jquery': '../../lib/jquery/dist/jquery.min',
			'backbone': '../../lib/backbone/backbone-min',
			'underscore': '../../lib/underscore/underscore-min',
			'bootstrap' : '../../lib/bootstrap/dist/js/bootstrap.min',
			'headroom': '../../lib/headroom.js/dist/headroom.min',
			'cookie' : '../../lib/jquery.cookie/jquery.cookie',
			'css': '../../lib/require-css/css.min',
			'text': '../../lib/text/text',
			'i18n': '../../lib/i18n/i18n',
			'util': '../common/util',
			'jxExt': '../common/javascript-extensions'
		},
		
		shim: {
	        'underscore': {
	            exports: '_'
	        },
	        'jquery': {
	            exports: '$'
	        },
	        'headroom': {
	        	exports: 'Headroom'
	        },
	        'backbone': {
	            deps: ['underscore', 'jquery'],
	            exports: 'Backbone'
	        },
	        'bootstrap': {  
	            deps : [ 'jquery' ],  
	            exports : 'bootstrap'
	       },
	       'jxExt': {
	    	   exports: 'jxExt'
	       }
		}  
	});

	require([
	         'backbone', 'bootstrap', 'util', 'router',
	         //controllers
	         './controller/PortalCtl', 
	         './controller/AboutCtl',
	         './controller/ContactCtl',
	         './controller/HelpCtl',
	         './controller/IntroductionCtl',
	         './controller/NewsCtl',
	         './controller/ProjectsCtl'
	         ], function(Backbone, bootstrap, util, router, 
	        		//controllers
	        		 PortalCtl, AboutCtl, ContactCtl, HelpCtl, IntroductionCtl, NewsCtl, ProjectsCtl) {

		//start monitoring
	    Backbone.history.start();
	});
})(window);
