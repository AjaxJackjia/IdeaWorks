define([ 'backbone', 'util' ], function(Backbone, util) {
	var Notification = Backbone.Model.extend({
		defaults: {
			'notificationid': 0,
			'user': '',
			'projectid': '',
			'projectTitle': '',
			'operator': '',
			'action': '',
			'entity': '',
			'title': '',
			'time': '',
			'isRead': ''
		},
		
		//fetch时设置id属性, 以便后续的update操作
		parse: function(response) {
			response.id = response.notificationid ? response.notificationid : "";
			
			response.action = actionMapping(response.action);
			response.entity = entityMapping(response.entity);
			
		    return response;
		}
	});
	
	var actionMapping = function(action) {
		switch(action) {
		case 100: return "create";
		case 200: return "modify";
		case 300: return "read";
		case 400: return "delete";
		case 500: return "join";
		case 600: return "remove";
		case 700: return "leave";
		case 800: return "upload";
		case 900: return "reply";
		case 1000: return "apply";
		default: return "unknown";
		}
	};
	
	var entityMapping = function(entity) {
		switch(entity) {
		case 100: return "project";
		case 101: return "project title";
		case 102: return "project advisor";
		case 103: return "project abstract";
		case 104: return "project logo";
		case 105: return "project status";
		case 106: return "project security";
		case 200: return "member";
		case 300: return "milestone";
		case 301: return "milestone title";
		case 302: return "milestone description";
		case 400: return "topic";
		case 401: return "topic title";
		case 402: return "topic description";
		case 500: return "message";
		case 600: return "file";
		case 700: return "application";
		default: return "unknown";
		}
	};
	
	return Notification;
});