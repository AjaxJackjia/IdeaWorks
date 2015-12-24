define([ 'backbone', 'util', 'mappingUtil' ], function(Backbone, util, mappingUtil) {
	var RecentActivityModel = Backbone.Model.extend({
		defaults: {
			'activityid': 0,
			'action': 0,
			'entity': 0,
			'title': '',
			'porject_title': '',
			'operator': '',
			'time': 0
		},
		
		//fetch时设置对应的action以及entity
		parse: function(response) {
			//定制消息的显示内容
			response = mappingUtil.mapping(response);
			
		    return response;
		}
	});
	
	return RecentActivityModel;
});