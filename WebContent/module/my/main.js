(function(win){
	require.config({
		paths: {
			'jquery': '../../lib/jquery/dist/jquery.min',
			'backbone': '../../lib/backbone/backbone',
			'underscore': '../../lib/underscore/underscore-min',
			'bootstrap' : '../../lib/bootstrap/dist/js/bootstrap.min',
			'Switch' : '../../lib/bootstrap-switch/dist/js/bootstrap-switch.min',
			'Editor' : '../../lib/bootstrap-wysiwyg/bootstrap-wysiwyg',
			'Validator' : '../../lib/bootstrapvalidator/dist/js/bootstrapValidator.min',
			'cookie' : '../../lib/jquery.cookie/jquery.cookie',
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
	       'jxExt': {
	    	   exports: 'jxExt'
	       }
		}  
	});

	var portalDependencies = [
	        'backbone', 
	        'bootstrap',
	        'router',
	        'css!../../res/css/my/main.css'
		];

	require(portalDependencies, function(Backbone, bootstrap, router, css) {
		//start monitoring
	    Backbone.history.start();
	});
})(window);
