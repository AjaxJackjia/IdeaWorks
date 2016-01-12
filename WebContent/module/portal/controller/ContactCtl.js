define([ 'backbone', '../view/ContactView'], function(Backbone, ContactView) {
	var ContactController = function() {
		console.log("This is contact controller module!");
		
		var contact = new ContactView();
		$('body > .container').append(contact.render().el);
		$('html,body').animate({scrollTop:0},0);
		
		ContactController.clear = function() {
			contact.remove();
		};
	};
	
	return ContactController;
});