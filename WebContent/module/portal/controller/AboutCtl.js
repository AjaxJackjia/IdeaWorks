define([ 'backbone', '../view/AboutView'], function(Backbone, AboutView) {
	var AboutController = function() {
		console.log("This is portal controller module!");
		
		var about = new AboutView();
		$('body > .container').append(about.render().el);
		$('html,body').animate({scrollTop:0},0);
		
		AboutController.clear = function() {
			about.remove();
		};
	};
	
	return AboutController;
});