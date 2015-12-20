define([ 
		'backbone', 'util', 'CheckLib',
		'css!../../../../lib/iCheck/skins/square/blue.css'
       ], 
    function(Backbone, util, CheckLib, iCheck_css) {
	var SettingDetailPrivacyView = Backbone.View.extend({
		
		className: 'setting-detail-privacy-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
			
			//privacy flags
			this.OWN_FLAG = 0;
			this.ADVISOR_FLAG = 1;
			this.GROUP_FLAG = 2;
			this.PUBLIC_FLAG = 3;
		},
		
		render: function(){
			var $privacys = $('<div class="privacy-container well">');
			$privacys.append(PrivacyItem('own', 'Only self visible'));
			$privacys.append(PrivacyItem('advisor', 'Only project advisor visible'));
			$privacys.append(PrivacyItem('group', 'Only group member visible'));
			$privacys.append(PrivacyItem('public', 'Public to everyone'));
			$(this.el).append($privacys);
			
			//初始化控件并绑定事件
			var self = this;
			setTimeout(function() {
				//初始化
				$('.privacy-item').iCheck({
				    checkboxClass: 'icheckbox_square-blue',
				    radioClass: 'iradio_square-blue	',
				    increaseArea: '20%' // optional
				});
				
				var userPrivacy = self.model.get('privacy');
				switch(userPrivacy) {
				case 0: $('.own').iCheck('check'); break;
				case 1: $('.advisor').iCheck('check'); break;
				case 2: $('.group').iCheck('check'); break;
				case 3: $('.public').iCheck('check'); break;
				default: $('.public').iCheck('check');break;
				}
				
				//绑定事件
				$('.privacy-item').on('ifClicked', function(event){
					$('.privacy-item').iCheck('uncheck');
					var $targetDom = $(event.target).closest('.privacy-item');
					$targetDom.iCheck('check');
					
					self.model.set('privacy', self.PUBLIC_FLAG); //默认为public
					if($targetDom.hasClass('own')) {
						self.model.set('privacy', self.OWN_FLAG);
					}else if($targetDom.hasClass('advisor')) {
						self.model.set('privacy', self.ADVISOR_FLAG);
					}else if($targetDom.hasClass('group')) {
						self.model.set('privacy', self.GROUP_FLAG);
					}
					
					$.ajax({
					    url: util.baseUrl + '/api/users/' + util.currentUser() + '/privacy',
					    data: {'privacy' : self.model.get('privacy')},
					    type: 'POST',
					    success: function(result){
					    	if(result.ret == 0) {
					    		alert("Set complete!");
					    	}else{
					    		alert(result.msg);
					    	}
					    },
					    error: function(response) {
							var alertMsg = 'Set privacy failed. Please try again later!';
							util.commonErrorHandler(response.responseJSON, alertMsg);
						}
					});
				});
			}, 0);
			
		    return this;
		}
	});
	
	var PrivacyItem = function(className, title) {
		var tpl = 
			'<div class="'+ className +' privacy-item"  name="iCheck">' + 
		    '	<input type="radio" />' + 
			'	<div class="option truncate">' + title + '</div>' + 
			'</div>';

		return tpl;
	};
	
	return SettingDetailPrivacyView;
});