define([ 'backbone', 'util', 'i18n!../../../nls/translation' ], function(Backbone, util, i18n) {
	var NewsView = Backbone.View.extend({
		
		className: 'news-container',
		
		initialize: function(){
			this.news = this.model;
		},
		
		render: function(){
			if(this.news == null) {
				var tpl404 = 
					'<div class="not-found">' +
					'	<h4 class="title">' + i18n.portal.NewsView.NEWS_NOT_FOUND + '</h4>' +
					'</div>';
				$(this.el).append(tpl404);
			}else{
				var $title = $('<h1>' + this.news.get('title') + '</h1>');
				var $time = $('<h3>' + this.news.get('time') + '</h3>');
				var $description = $('<p>' + this.news.get('content') + '</p>');
				var $more = $('<a href="' + this.news.get('directUrl') + '" target="_blank">' + i18n.portal.NewsView.DETAIL_INFORMATION + '</a>');
				var imagesContent = 
					'<div class="row"><img class="img-thumbnail" src="res/images/portal/news/' + this.news.get('img') + '"></div>';
				var $images = $(imagesContent);
				
				$(this.el).append($title);
				$(this.el).append($time);
				$(this.el).append($description);
				$(this.el).append($more);
				$(this.el).append($images);
			}
			
			return this;
		}
	});
	
	return NewsView;
});