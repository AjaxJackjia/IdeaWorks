define([ 'backbone', './view/HeaderView', './view/FooterView' ], function (Backbone, HeaderView, FooterView) {
	
	//create header and footer of portal page
	var header = new HeaderView();
	$('body > .container').before(header.render().el);
	
	var footer = new FooterView();
	$('body > .container').after(footer.render().el);
	
	//initialize header with headroom
	var header = document.getElementById("header");
	var headroom = new Headroom(header, {
	  "tolerance": 5,
	  "offset": 70,
	  "classes": {
	    "initial": "animated",
	    "pinned": "slideDown",
	    "unpinned": "slideUp"
	  }
	});
	headroom.init(); 
    
	// router basic settings
	var routesMap = {
    	"": './controller/PortalCtl',
    	'news': './controller/NewsCtl',
        'projects': './controller/ProjectsCtl',
        'introduction': './controller/IntroductionCtl',
        'about': './controller/AboutCtl',
        'contact': './controller/ContactCtl',
        'help': './controller/HelpCtl',
        '*error': './controller/PortalCtl',
    };

    var Router = Backbone.Router.extend({
        routes: routesMap
    });

    var router = new Router();
    
    router.on('route', function (route, params) {
        require([route], function (controller) {
            if(router.currentController && router.currentController !== controller){
            	//clear current container
            	if(typeof router.currentController.clear === 'function') {
            		router.currentController.clear();
            	}
            	
                router.currentController.onRouteChange && router.currentController.onRouteChange();
            }
            router.currentController = controller;
            controller.apply(null, params); 
        });
    });

    return router;
});
