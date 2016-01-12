define([ 'backbone', 'util' ], function(Backbone, util) {
	var Advice = Backbone.Model.extend({
		url: '/IdeaWorks/api/users/' + util.currentUser() + '/advice',
		
		defaults: {
			'userid': '',
			'advice': ''
		},
		
		//fetch时设置id属性, 以便后续的update操作
		parse: function(response) {
			response.id = response.adviceid ? response.adviceid : "";
			
		    return response;
		}
	});
	
	return Advice;
});