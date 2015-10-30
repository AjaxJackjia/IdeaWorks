define([ 'backbone', 'headroom', 'util' ], function(Backbone, Headroom, util) {
	var NewsListView = Backbone.View.extend({
		
		className: 'item-list',
		
		initialize: function(){
			
		},
		
		sectionItem: function(index, item) {
			var $sectionContainer = $('<section rol="article" class="'+ (index%2 == 0?'odd':'even') +'">');
			
			var $itemHeader = $('<div class="item-header">');
			var _itemHeader_tpl = 
				'<div class="header-wrap"> ' + 
				'	<h2 class="item-title"> ' +
				'		<a href="#">' + item.title + '</a> ' + 
				'	</h2> ' + 
				'	<div class="item-time">' + item.time + '</div> ' +
				'	<div class="line"></div> ' +
				'	<div class="item-description">' + item.description + '</div> ' +
				'	<div class="item-action"> ' +
                '		<a href="#" class="read-more">Read More <i class="fa fa-angle-right"></i></a> ' +
                '	</div> ' +
                '</div>';
			
			$itemHeader.html(_itemHeader_tpl);
			$sectionContainer.append($itemHeader);
			
			return $sectionContainer;
		},
		
		render: function(){
			item = {};
			item.title = 'Item title!';
			item.time = '2015-10-21';
			item.description = 'The past few months were full of exciting announcements at our Recruitee HQ. We\'ve launched a power search feature, secured a seed finance round, and hired a few top-notch new team members. Here\'s a quick update on the power search';
			
			for(var i = 0;i<10;i++) {
				$(this.el).append(this.sectionItem(i, item));
			}
			
			return this;
		}
	});
	
	return NewsListView;
});