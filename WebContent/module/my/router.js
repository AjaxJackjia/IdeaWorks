define([ 'backbone', 'util', 
         'cookie',
         'view/LeftPanelView', 
         'view/TopPanelView',
         'model/settings/UserModel'
       ], function (Backbone, util, cookie, LeftPanelView, TopPanelView, UserModel) {
	
	//check login status
	if(util.isLogin()) {
		//get current user info
		var userModel = new UserModel({ 
			id: $.cookie('userid')
		});
		userModel.fetch({
			success: function() {
				console.log('fetch!');
				$.cookie('userlogo', userModel.get('logo'));
				$.cookie('nickname', userModel.get('nickname'));
				
				//create header and footer of portal page
				var leftPanel = new LeftPanelView();
				$('body > .content-panel').before(leftPanel.render().el);
				
				var topPanel = new TopPanelView();
				$('body > .content-panel').before(topPanel.render().el);
			}
		});
	}else{
		window.location.href = util.baseUrl + '/login.html';
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
