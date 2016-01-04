define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation',
         //view
         'view/search/ProjectSearchView',
         'view/search/PersonSearchView'
       ], 
    function(Backbone, util, i18n, ProjectSearchView, PersonSearchView) {
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
			$searchOptions.append('<li class="option active" data-type="project"><i class="fa fa-flag"></i><span>' + i18n.my.search.SearchMainView.PROJECT + '</span></li>');
			$searchOptions.append('<li class="option" data-type="person"><i class="fa fa-user"></i><span>' + i18n.my.search.SearchMainView.PERSON + '</span></li>');
			
			var $searchResult = $('<div class="search-result">');
			$searchResult.append(Placeholder(i18n.my.search.SearchMainView.NO_RESULT));
			
			$(this.el).html($searchOptions);
			$(this.el).append($searchResult);
			
			//绑定enter搜索事件
			$('body').off('keydown').on('keydown', this.keypress);
			$('.search-options', this.el).off('click').on('click', this.changeSearchOption);
			
		    return this;
		},
		
		unrender: function() {
			//解绑定enter事件
			$('body').off('keydown');
			$('.search-options', this.el).off('click');
			
			$(this.el).remove();
			
			//reset state
			this.currentSearchOption = 'project';
			this.currentSearchView = this.projectSearchView;
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
	    	var $li = $(e.target).closest('li');
	    	if($li.length != 0) {
	    		$('.search-options > .option', this.el).removeClass('active');
	    		$('.search-input > input').val('');
	    		$li.addClass('active');
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
	    }
	});
	
	var Placeholder = function(msg) {
		return '<div class="placeholder"><h4>' + msg + '</h4></div>';
	};
	
	return SearchMainView;
});