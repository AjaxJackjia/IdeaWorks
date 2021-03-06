({
    baseUrl: ".",
    name: "main",
    out: "portal.min.js",
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
})
