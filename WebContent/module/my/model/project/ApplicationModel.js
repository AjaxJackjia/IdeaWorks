define([ 'backbone' ], function(Backbone) {
	var Application = Backbone.Model.extend({
		defaults: {
			'applicationid': '',
			'projectid': '',
			'proposer': '',
			'msg': '',
			'status': '',
			'createtime': '',
			'modifytime': ''
		},
		
		//fetch时设置id属性, 以便后续的update操作
		parse: function(response) {
			response.id = response.applicationid ? response.applicationid : "";
		    return response;
		}
	});
	
	return Application;
});