define([ 'backbone' ], function(Backbone) {
	var SettingsController = function() {
		console.log("This is settings controller module!");
		
//		var about = new AboutView();
//		$('body > .container').append(about.render().el);
//		$('html,body').animate({scrollTop:0},0);
		
		//初始化侧边栏状态
		$($('.navigation > .list-unstyled > li')[2]).click();
		
		SettingsController.clear = function() {
			
		};
	};
	
	return SettingsController;
});