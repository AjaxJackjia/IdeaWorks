define([ 'backbone' ], function(Backbone) {
	var IndexController = function() {
		console.log("This is index controller module!");
		
		//默认跳转到dashboard页面
		window.location = '#dashboard';
		
		IndexController.clear = function() {
			
		};
	};
	
	return IndexController;
});