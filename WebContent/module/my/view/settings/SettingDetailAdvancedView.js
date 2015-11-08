define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var SettingDetailAdvancedView = Backbone.View.extend({
		
		className: 'setting-detail-advanced-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
		},
		
		render: function(){
			
		    return this;
		}
	});
	
	return SettingDetailAdvancedView;
});