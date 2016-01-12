define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation'
       ], 
    function(Backbone, util, i18n) {
	var SettingListView = Backbone.View.extend({
		
		tagName: 'ul', 
		
		className: 'setting-list-view',
		
		events: {
			'click .setting': 'select'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'select');
			
			this.list = [
			    {icon: 'user', title: i18n.my.settings.SettingListView.PROFILE},
			    {icon: 'bell', title: i18n.my.settings.SettingListView.NOTIFICATION},
			    {icon: 'user-secret', title: i18n.my.settings.SettingListView.PRIVACY_SETTINGS},
			    {icon: 'cog', title: i18n.my.settings.SettingListView.ADVANCED_SETTINGS}
			];
			
			this.render();
		},
		
		render: function(){
			var listContent = '';
			_.each(this.list, function(item){
				listContent += Item(item);
			});
			$(this.el).html(listContent);
			
		    return this;
		},
		
		select: function(e) {
			$('.setting').removeClass('active');
			var $target = $(e.target).closest('.setting');
			$target.addClass('active');
		
			Backbone.trigger('ShowSettingDetail', $target.attr('title'));
		}
	});
	
	var Item = function(data) {
		var tpl = 
			'<li class="setting" title="'+ data.title +'">' + 
			'	<a href="javascript:;">' + 
			'		<i class="fa fa-'+ data.icon +'"></i>' + data.title + 
			'	</a>' + 
			'</li>';
		return tpl;
	};
	
	return SettingListView;
});