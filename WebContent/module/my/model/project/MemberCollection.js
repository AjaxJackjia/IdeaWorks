define([ 'backbone', 'util', 'model/project/MemberModel' ], function(Backbone, util, MemberModel) {
	var MemberList = Backbone.Collection.extend({
		model: MemberModel,
		
		save: function(options) {
			var params = new BulkUpdateModel();
			params.url = this.url;
			_.each(this.models, function(model, index) {
				params.set('id' + index, model.get('userid'));
			});
			
			Backbone.sync("create", params, options);
		}
	});
	
	var BulkUpdateModel = Backbone.Model.extend({ });
	
	return MemberList;
});