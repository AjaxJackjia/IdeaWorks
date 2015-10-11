define([ 'backbone', '../view/IntroductionView' ], function(Backbone, IntroductionView) {
	var IntroductionController = function() {
		console.log("This is introduction controller module!");
		
		var intro = new IntroductionView();
		$('body > .container').html(intro.render().el);
		
		IntroductionController.clear = function() {
			intro.remove();
		};
	};
	
	return IntroductionController;
});