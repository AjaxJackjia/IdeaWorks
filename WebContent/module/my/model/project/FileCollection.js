define([ 'backbone', 'util', 'model/project/FileModel' ], function(Backbone, util, FileModel) {
	var FileList = Backbone.Collection.extend({
		model: FileModel
	});
	
	return FileList;
});