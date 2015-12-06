define([ 'backbone' ], function(Backbone) {
	var File = Backbone.Model.extend({
		defaults: {
			'fileid': 0,
			'projectid': 0,
			'filename': '',
			'filesize': '',
			'filetype': '',
			'url': '',
			'creator': '',
			'createtime': '',
			'description': ''
		}
	});
	
	return File;
});