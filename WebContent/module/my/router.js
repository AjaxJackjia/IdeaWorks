define([ 'backbone', 'util', 
         'cookie',
         'view/LeftPanelView', 
         'view/TopPanelView',
       ], function (Backbone, util, cookie, LeftPanelView, TopPanelView) {
	
	//check login status when load router
	if(util.isLogin()) {
		//create header and footer of portal page
		var leftPanel = new LeftPanelView();
		$('body > .content-panel').before(leftPanel.render().el);
		
		var topPanel = new TopPanelView();
		$('body > .content-panel').before(topPanel.render().el);
	}else{
		window.location.href = 'login.html';
	}
	
	// router basic settings
	var routesMap = {
    	"": './controller/IndexCtl',
    	'dashboard': './controller/DashboardCtl',
    	'projects': './controller/ProjectsCtl',
    	'settings': './controller/SettingsCtl',
        '*error': './controller/PortalCtl',
    };

    var Router = Backbone.Router.extend({
        routes: routesMap
    });

    var router = new Router();
    
    router.on('route', function (route, params) {
    	//check user login status when change router
    	if(!util.isLogin()) {
    		window.location.href = 'login.html';
    	}
    	
        require([route], function (controller) {
            if(router.currentController && router.currentController !== controller){
                router.currentController.onRouteChange && router.currentController.onRouteChange();
            }
            router.currentController = controller;
            controller.apply(null, params); 
        });
    });

    return router;
});
