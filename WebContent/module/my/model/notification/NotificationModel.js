define([ 'backbone', 'util', 'mappingUtil' ], function(Backbone, util, mappingUtil) {
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
			
			//定制消息的显示内容
			response = mappingUtil.mapping(response);
			
		    return response;
		}
	});
	
	return Notification;
});