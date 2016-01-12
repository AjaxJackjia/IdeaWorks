define([ 'backbone', '../view/HelpView'], function(Backbone, HelpView) {
	var HelpController = function() {
		console.log("This is contact controller module!");
		
		var help = new HelpView();
		$('body > .container').append(help.render().el);
		$('html,body').animate({scrollTop:0},0);
		
		HelpController.clear = function() {
			help.remove();
		};
	};
	
	return HelpController;
});