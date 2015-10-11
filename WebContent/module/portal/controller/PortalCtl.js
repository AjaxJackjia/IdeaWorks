define([ 'backbone', '../view/PortalBodyView'], function(Backbone, BodyView) {
	var PortalController = function() {
		console.log("This is portal controller module!");
		
		var body = new BodyView();
		$('body > .container').append(body.render().el);
		$('html,body').animate({scrollTop:0},0);
		
		PortalController.clear = function() {
			body.remove();
		};
	};
	
	return PortalController;
});