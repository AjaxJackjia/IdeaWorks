define([ 'backbone', 'util' ], function(Backbone, util) {
	var TopPanelView = Backbone.View.extend({
		
		className: 'top-panel',
		
		events: {
			'click .signout-btn': 'logout'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'logout');
		},
		
		render: function(){
			/*
			 * search
			 * */
			var $search = $('<div class="search-box">');
			var search_tpl = 
				'<div class="search-btn btn btn-default">' +
				'	<i class="fa fa-search"></i>' +
				'</div>' + 
				'<div class="search-input input-group">' +
				'	<input class="form-control" type="text" placeholder="Search...">' +
				'</div>';
			$search.html(search_tpl);
			
			/*
			 * tool
			 * */
			var $tool = $('<div class="tool-box">');
			var tool_tpl = 
				'<div class="signout-btn btn btn-default">' +
				'	<i class="fa fa-sign-out"></i>' +
				'</div>' + 
				'<div class="msg-btn btn btn-default">' +
				'	<i class="fa fa-bell-o"></i>' +
				'</div>';
			$tool.html(tool_tpl);
			
			$(this.el).append($search);
			$(this.el).append($tool);
			
			return this;
		},
		
		logout: function() {
			if(confirm("Are you sure to logout?")) {
				util.logout();
			}
		}
	});
	
	return TopPanelView;
});