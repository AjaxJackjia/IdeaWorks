define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var SettingDetailPrivacyView = Backbone.View.extend({
		
		className: 'setting-detail-privacy-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
		},
		
		render: function(){
			
		    return this;
		}
	});
	
	return SettingDetailPrivacyView;
});