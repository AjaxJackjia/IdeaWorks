define([ 
         'backbone', 'util',
         //view
         'view/search/ProjectSearchView',
         'view/search/PersonSearchView'
       ], 
    function(Backbone, util, ProjectSearchView, PersonSearchView) {
	var SearchMainView = Backbone.View.extend({
		
		className: 'search-main-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'keypress', 'search', 'changeSearchOption');
			
			this.projectSearchView = new ProjectSearchView();
			this.personSearchView = new PersonSearchView();
			
			//current status
			this.currentSearchOption = 'project';
			this.currentSearchView = this.projectSearchView;
		},
		
		render: function(){
			var $searchOptions = $('<ul class="search-options">');
			$searchOptions.append('<li class="option active" data-type="project"><i class="fa fa-flag"></i><span>Project</span></li>');
			$searchOptions.append('<li class="option" data-type="person"><i class="fa fa-user"></i><span>Person</span></li>');
			
			var $searchResult = $('<div class="search-result">');
			$searchResult.append(Placeholder('No search result...'));
			
			$(this.el).html($searchOptions);
			$(this.el).append($searchResult);
			
			//绑定enter搜索事件
			$('body').off('keydown').on('keydown', this.keypress);
			$('.search-options', this.el).off('click').on('click', this.changeSearchOption);
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
			
			//解绑定enter事件
			$('body').off('keydown');
		},
		
		keypress: function(e) {
	        var code = e.keyCode || e.which;
	        if(code == 13) {  //press enter button 
	            this.search();
	        }
	    },
	    
	    search: function() {
	    	var searchTxt = $('.search-input > input').val();
	    	if($.trim(searchTxt) != '') {
	    		this.currentSearchView.search();
    			$('.search-result', this.el).html($(this.currentSearchView.render().el));
	    	}
	    },
	    
	    changeSearchOption: function(e) {
	    	$('.search-options > .option', this.el).removeClass('active');
	    	var $li = $(e.target).closest('li');
	    	$li.addClass('active');
	    	$('.search-input > input').val('');
	    	this.currentSearchOption = $li.attr('data-type');
	    	//clean previous result
	    	this.currentSearchView.unrender();
	    	
	    	if(this.currentSearchOption == 'project') {
	    		this.currentSearchView = this.projectSearchView;
    		}else if(this.currentSearchOption == 'person') {
    			this.currentSearchView = this.personSearchView;
    		}
	    	
	    	//init
	    	this.currentSearchView.clean();
	    	$('.search-result', this.el).html($(this.currentSearchView.el));
	    }
	});
	
	var Placeholder = function(msg) {
		return '<div class="placeholder"><h4>' + msg + '</h4></div>';
	};
	
	return SearchMainView;
});