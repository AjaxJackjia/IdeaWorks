(function(win){
	require.config({
		waitSeconds: 30,
		
		locale: sessionStorage.getItem('userlang') || 'en-us', //设置用户预设的语言
		
		paths: {
			'jquery': '../../lib/jquery/dist/jquery.min',
			'backbone': '../../lib/backbone/backbone',
			'underscore': '../../lib/underscore/underscore-min',
			'bootstrap' : '../../lib/bootstrap/dist/js/bootstrap.min',
			'Switch' : '../../lib/bootstrap-switch/dist/js/bootstrap-switch.min',
			'CheckLib' : '../../lib/iCheck/icheck.min',
			'Editor' : '../../lib/bootstrap-wysiwyg/bootstrap-wysiwyg',
			'Validator' : '../../lib/bootstrapvalidator/dist/js/bootstrapValidator.min',
			'cookie' : '../../lib/jquery.cookie/jquery.cookie',
			'MD5' : '../../lib/js-md5/build/md5.min',
			'css': '../../lib/require-css/css.min',
			'text': '../../lib/text/text',
			'i18n': '../../lib/i18n/i18n',
			'util': '../common/util',
			'mappingUtil': '../common/mappingUtil',
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
	       },
	       'Switch': {
	    	   deps : [ 'bootstrap', 'jquery' ],
	           exports : 'Switch'
	       },
	       'CheckLib': {
	    	   deps : [ 'jquery' ],
	           exports : 'CheckLib'
	       },
	       'MD5' : {
	    	   exports: 'MD5'
	       }
		}  
	});

	require([
	         'backbone', 'bootstrap', 'router', 
	         //controllers
	         './controller/DashboardCtl', 
	         './controller/IndexCtl',
	         './controller/ProjectsCtl',
	         './controller/SettingsCtl'
	        ], function(Backbone, bootstrap, router, DashboardCtl, DashboardCtl, ProjectsCtl, SettingsCtl) {
		
		//start monitoring
	    Backbone.history.start();
	});
})(window);
