define([ 
         'backbone', 'util', 'i18n!../../../nls/translation', 
         'model/NewsCollection' 
       ], function(Backbone, util, i18n, NewsCollection) {
	var NewsListView = Backbone.View.extend({
		
		className: 'item-list',
		
		initialize: function(){
			this.newsList = this.model;
		},
		
		render: function(){
			var self = this;
			_.each(this.newsList.models, function(news, index) {
				$(self.el).append(NewsItem(index, news));
			});
			
			return this;
		}
	});
	
	var NewsItem = function(index, news) {
		var $sectionContainer = $('<section rol="article" class="'+ (index%2 == 0?'odd':'even') +'">');
		
		var $itemHeader = $('<div class="item-header">');
		var _itemHeader_tpl = 
			'<div class="header-wrap"> ' + 
			'	<h2 class="item-title"> ' +
			'		<a href="index.html#news?id='+ news.get('newsid') + '">' + news.get('title') + '</a> ' + 
			'	</h2> ' + 
			'	<div class="item-time">' + news.get('time') + '</div> ' +
			'	<div class="line"></div> ' +
			'	<div class="item-description">' + news.get('abstractContent') + '</div> ' +
			'	<div class="item-action"> ' +
            '		<a href="index.html#news?id='+ news.get('newsid') + '" class="read-more">' + i18n.portal.NewsListView.READ_MORE + '<i class="fa fa-angle-right"></i></a> ' +
            '	</div> ' +
            '</div>';
		
		$itemHeader.html(_itemHeader_tpl);
		$sectionContainer.append($itemHeader);
		
		return $sectionContainer;
	}
	
	return NewsListView;
});