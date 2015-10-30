define([ 'backbone', 'util', '../view/NewsListView', '../view/NewsView' ], function(Backbone, util, NewsListView, NewsView) {
	var NewsController = function() {
		console.log("This is news controller module!");
		
		var params = util.resolveUrlParams();
		
		if(params.hasOwnProperty('id')) {
			var news = new NewsView();
			$('body > .container').html(news.render().el);
			$('html,body').animate({scrollTop:0},0);
			
			NewsController.clear = function() {
				news.remove();
			};
		}else{
			var newsList = new NewsListView();
			$('body > .container').html(newsList.render().el);
			$('html,body').animate({scrollTop:0},0);
			
			NewsController.clear = function() {
				newsList.remove();
			};
		}
		
	};
	
	return NewsController;
});