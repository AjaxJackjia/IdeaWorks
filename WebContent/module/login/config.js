({
    baseUrl: ".",
    name: "main",
    out: "login.min.js",
    paths: {
    	'jquery': '../../lib/jquery/dist/jquery.min',
		'cookie' : '../../lib/jquery.cookie/jquery.cookie',
		'backbone': '../../lib/backbone/backbone',
		'underscore': '../../lib/underscore/underscore-min',
		'bootstrap' : '../../lib/bootstrap/dist/js/bootstrap.min',
		'Validator' : '../../lib/bootstrapvalidator/dist/js/bootstrapValidator.min',
		'util': '../common/util',
		'i18n': '../../lib/i18n/i18n',
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
})
