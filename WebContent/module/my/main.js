require.config({
	paths: {
		'jquery': '../../lib/jquery/dist/jquery.min',
		'metro': '../../lib/metro/build/js/metro.min'
	},

	shim : {
	    'metro' : {
	    	deps : [ 'jquery' ],
	    	exports : 'metro'
	    }
	}  
});

require(['metro'], function(metro) {
	console.log('my module!');
});
