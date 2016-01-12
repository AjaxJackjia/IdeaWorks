define([ 'backbone', 'util', 
         //view
         '../view/NewsListView', '../view/NewsView',
         //model
         'model/NewsCollection'
       ], function(Backbone, util, NewsListView, NewsView, NewsCollection) {
	var NewsController = function() {
		console.log("This is news controller module!");
		
		var newsCollection = NewsCollection; //已初始化
		
		var params = util.resolveUrlParams();
		
		if(params.hasOwnProperty('id')) {
			var news = new NewsView({
				model: newsCollection.where({newsid: params.id})[0]
			});
			$('body > .container').html(news.render().el);
			$('html,body').animate({scrollTop:0},0);
			
			NewsController.clear = function() {
				news.remove();
			};
		}else{
			var newsList = new NewsListView({
				model: newsCollection
			});
			$('body > .container').html(newsList.render().el);
			$('html,body').animate({scrollTop:0},0);
			
			NewsController.clear = function() {
				newsList.remove();
			};
		}
		
	};
	
	return NewsController;
});