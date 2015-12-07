define([ 'backbone' ], function(Backbone) {
	var File = Backbone.Model.extend({
		defaults: {
			'fileid': 0,
			'projectid': 0,
			'filename': '',
			'filesize': '',
			'filetype': '',
			'url': '',
			'attachment': '',
			'creator': '',
			'createtime': '',
			'description': ''
		},
		
		//fetch时设置id属性, 以便后续的delete操作
		parse: function(response) {
			response.id = response.fileid ? response.fileid : "";
		    return response;
		}
	});
	
	return File;
});