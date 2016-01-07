define([ 'backbone', 'util', 'cookie', 'i18n!../../../nls/translation' ], function(Backbone, util, cookie, i18n) {
	var FooterView = Backbone.View.extend({
		
		tagName: 'footer',
		
		className: 'footer',
		
		id: 'footer',
		
		events: {
			'click ul.dropdown-menu > li': 'switchLang'
		},
		
		initialize: function(){
			//获取当前语言类型
			this.currentLang = sessionStorage.getItem('lang') || 'en-us';
			
			_.bindAll(this, 'render', 'genLanguageItem', 'switchLang');
			
			//navigation
			this.nav = [{
				index: i18n.portal.FooterView.HELP_CENTER,
				url: 'index.html#help'
			},{
				index: i18n.portal.FooterView.ABOUT_US,
				url: 'index.html#about'
			},{
				index: i18n.portal.FooterView.CONTACT_US,
				url: 'index.html#contact'
			}];
		},
		
		render: function(){
			var $nav = $('<ul class="nav">');
			_.each(this.nav, function(item) {
				$nav.append('<li><a href="'+ item.url +'">' + item.index + '</a></li>');
			});
			
			var $copyright = $('<div class="copyright">');
			var $copyrightInfo = 'Copyright © ' + (new Date()).getFullYear() + ' <span>CityU</span> All rights reserved.';
			var $switchLanguage = this.genLanguageItem();
			$copyright.html($copyrightInfo);
			$copyright.append($switchLanguage);
			
			$(this.el).append($nav);
			$(this.el).append($copyright);
			
			return this;
		},
		
		genLanguageItem: function() {
			var $tpl = $('<div class="switch-lang dropup">');
			var $tplBtn = $('<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">');
			var $tplList = $('<ul class="dropdown-menu" aria-labelledby="dropdownMenu">');
			
			if(this.currentLang == 'en-us') {
				$tplBtn.append('<span class="current-lang lang-item en-us">English</span> <span class="caret"></span>');
				$tplList.append('<li><span class="lang-item zh-cn">中文</span></li>');
			}else{
				$tplBtn.append('<span class="current-lang lang-item zh-cn">中文</span> <span class="caret"></span>');
				$tplList.append('<li><span class="lang-item en-us">English</span></li>');
			}
			
			$tpl.append($tplBtn);
			$tpl.append($tplList);
			
			return $tpl[0];
		},
		
		switchLang: function(event) {
			$target = $(event.target).closest('li');
			if($target != null) {
				if($target.find('.en-us').length > 0) {
					sessionStorage.setItem('lang', 'en-us');
				}else{
					sessionStorage.setItem('lang', 'zh-cn');
				}
				location.reload();
			}
		}
	});
	
	return FooterView;
});