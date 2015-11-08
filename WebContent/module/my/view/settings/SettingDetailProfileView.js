define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var SettingDetaiProfilelView = Backbone.View.extend({
		
		className: 'setting-detail-profile-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
		},
		
		render: function(){
			var $profile = $('<div class="profile-container well">');
			$profile.append(BaseInfo());
			
			$(this.el).append($profile);
			
		    return this;
		}
	});
	
	var BaseInfo = function(data) {
		var data = {};
		data.name = 'Jack Jia';
		data.phone = '+86 15751866291';
		data.email = 'nju_jackjia@163.com';
		
		var tpl = 
			'<div class="base-info">' + 
			'	<div class="actions">' + 
			'		<a class="btn btn-default"> ' + 
			'			<i class="fa fa-pencil"></i> Edit profile' +
			'		</a>' + 
			'		<a class="btn btn-default"> ' + 
			'			<i class="fa fa-lock"></i> Change password' +
			'		</a>' + 
			'	</div>' + 
			'	<img class="img-circle" src="'+ util.baseUrl +'/res/images/my/avatar.png">' + 
			'	<div class="info">' + 
			'		<h3 class="user">' + data.name + '</h3>' + 
			'		<div class="phone">' + 
			'			<span class="text-color">Phone</span> ' + 
	        '			<span class="dark-text-color">' + data.phone + '</span>' + 
	        '		</div>' +
	        '		<div class="email">' + 
			'			<span class="text-color">E-mail</span> ' + 
	        '			<span class="dark-text-color">' + data.email + '</span>' + 
	        '		</div>' +
			'	</div>' +
			'</div>';
		return tpl;
	};
	
	return SettingDetaiProfilelView;
});