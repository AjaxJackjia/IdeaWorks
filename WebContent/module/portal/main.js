(function(win){
	require.config({
		paths: {
			'jquery': '../../lib/jquery/dist/jquery.min',
			'backbone': '../../lib/backbone/backbone-min',
			'underscore': '../../lib/underscore/underscore-min',
			'bootstrap' : '../../lib/bootstrap/dist/js/bootstrap.min',
			'headroom': '../../lib/headroom.js/dist/headroom.min',
			'css': '../../lib/require-css/css.min',
			'text': '../../lib/text/text',
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

	var portalDependencies = [
	        'backbone', 
	        'bootstrap',
	        'util',
	        'router',
	        'css!../../res/css/portal/main.css'
		];

	require(portalDependencies, function(Backbone, bootstrap, util, router, css) {
		
		//start monitoring
	    Backbone.history.start();
	
	});
})(window);
