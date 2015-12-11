define([ 
		'backbone', 'util', 'Switch', 
		'css!../../../../lib/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css'
       ], 
    function(Backbone, util, Switch, boostrap_switch_css) {
	var SettingDetailAdvancedView = Backbone.View.extend({
		
		className: 'setting-detail-advanced-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
		},
		
		render: function(){
			var self = this;
			var $advancedSetting = $('<div class="advanced-setting-container well">');
			$advancedSetting.append(SyncItem());
			$advancedSetting.append(LanguageItem());
			
			$(this.el).append($advancedSetting);
			
			//初始化状态
			$advancedSetting.find('.sync input').bootstrapSwitch('state', (this.model.get('sync')?true:false));
			$advancedSetting.find('.sync .bootstrap-switch').addClass('switch bootstrap-switch-mini');
			$advancedSetting.find('.sync input').bootstrapSwitch('handleWidth', 40);
			$advancedSetting.find('.lang > select').val(this.model.get('language'));
			
			$('.bootstrap-switch input', this.el).on('switchChange.bootstrapSwitch', function() {
				self.sendRequest();
			});
			
			$('.lang select', this.el).on('change', function() {
				self.sendRequest();
			});
			
		    return this;
		},
		
		sendRequest: function() {
			//设置状态
			this.model.set('sync', ($('.bootstrap-switch input', this.el).bootstrapSwitch('state') ? 1:0));
			this.model.set('language', $('.lang > select').val());

			//发送请求
			var data = {};
			data.sync = this.model.get('sync');
			data.language = this.model.get('language');
			
			$.ajax({
			    url: util.baseUrl + '/api/users/' + util.currentUser() + '/advancedsetting',
			    data: data,
			    type: 'POST',
			    success: function(result){
			    	if(result.ret == 0) {
			    		alert("Set complete!");
			    	}else{
			    		alert(result.msg);
			    	}
			    },
			    error: function(response) {
					var alertMsg = 'Set advanced settings failed. Please try again later!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
		}
	});
	
	var SyncItem = function() {
		var tpl = 
			'<div class="sync">' + 
		    '	<input type="checkbox" />' + 
			'	<div class="option truncate">Synchronize current browse state</div>' + 
			'</div>';

		return tpl;
	};
	
	var LanguageItem = function() {
		var tpl = 
			'<div class="lang">' + 
			'	<select class="form-control"> ' + 
			'		<option value="en_US">en_US</option>' + 
			'		<option value="zh_CN">zh_CN</option>' +
			'	</select> ' + 
			'	<div class="option truncate">Select language</div>' + 
			'</div>';
		
		return tpl;
	}
	
	return SettingDetailAdvancedView;
});