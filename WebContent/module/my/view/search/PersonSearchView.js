define([ 
         'backbone', 'util',
       //view
         'view/search/PersonItemView',
         //model
         'model/search/PersonCollection'
       ], 
    function(Backbone, util, PersonItemView, PersonCollection) {
	var PersonSearchView = Backbone.View.extend({
		
		className: 'person-search-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'addPersons');
			
			this.persons = new PersonCollection();
		},
		
		render: function(){
			$(this.el).html('');
			
			if(this.persons.length == 0) {
				this.clean();
			}else{
				this.addPersons();
			}
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		search: function() {
			var searchTxt = $.trim($('.search-input > input').val());
			
			this.persons.fetch({
				data: { key: searchTxt},
				success: this.render,
				error: function(model, response, options) {
					var alertMsg = 'Search person failed. Please try again later!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
		},
		
		clean: function() {
			$(this.el).html(Placeholder('Search Person No result...'));
		},
		
		addPersons: function() {
			var self = this;
			_.each(this.persons.models, function(person, index) {
				person.url = self.persons.url + '/' + person.get('userid');
				var personItemView = new PersonItemView({
					model: person
				});
				$(self.el).append($(personItemView.render().el));
			});
		}
	});
	
	var Placeholder = function(msg) {
		return '<div class="placeholder"><h4>' + msg + '</h4></div>';
	};
	
	return PersonSearchView;
});