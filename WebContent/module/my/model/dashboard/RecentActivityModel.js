define([ 'backbone' ], function(Backbone) {
	var RecentActivityModel = Backbone.Model.extend({
		defaults: {
			'activityid': 0,
			'activity_action': 0,
			'activity_entity': 0,
			'activity_title': '',
			'porject_title': '',
			'operator': '',
			'activity_time': 0
		},
		
		//fetch时设置对应的action以及entity
		parse: function(response) {
			response.activity_action = actionMapping(response.activity_action);
			response.activity_entity = entityMapping(response.activity_entity);
		    return response;
		}
	});
	
	var actionMapping = function(action) {
		switch(action) {
		case 0: return "create";
		case 1: return "modify";
		case 2: return "read";
		case 3: return "delete";
		case 4: return "join";
		case 5: return "remove";
		case 6: return "leav";
		case 7: return "upload";
		default: return "unknown";
		}
	};
	
	var entityMapping = function(entity) {
		switch(entity) {
		case 0: return "project";
		case 1: return "advisor and abstract";
		case 2: return "project logo";
		case 3: return "member";
		case 4: return "milestone";
		case 5: return "topic";
		case 6: return "dicussion";
		case 7: return "file";
		default: return "unknown";
		}
	};
	
	return RecentActivityModel;
});