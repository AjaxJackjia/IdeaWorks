define([ 'backbone', 'util', 'mappingUtil' ], function(Backbone, util, mappingUtil) {
	var ActivityModel = Backbone.Model.extend({
		defaults: {
			'activityid': 0,
			'projectid': 0,
			'action': 0,
			'entity': 0,
			'title': '',
			'operator': '',
			'time': ''
		},
		
		//fetch时设置对应的action以及entity
		parse: function(response) {
			//定制消息的显示内容
			response = mappingUtil.mapping(response);
			
		    return response;
		}
	});
	
	return ActivityModel;
});