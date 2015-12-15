define([ 'backbone', 'util', 'model/search/PersonModel' ], function(Backbone, util, PersonModel) {
	var PersonList = Backbone.Collection.extend({
		url: '/IdeaWorks/api/users/' + util.currentUser() + '/search/persons',
		
		model: PersonModel
	});
	
	return PersonList;
});