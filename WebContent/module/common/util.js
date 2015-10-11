define(['jquery'], function($) {
	
	//load css file on demand
	var loadcss = function(p_cssPath) {
		//css path, 绝对地址url
		var cssUrl = p_cssPath || "";
				
		// 异步加载，防止阻塞
		$.ajax({
			url: cssUrl,
			success: function(cssContent) {
				
				//judge whether this css file is existed in <head> 
				var $existedCss = $('head style');
				var isExisted = false;
				$.each($existedCss, function(index, css) {
					if($(css).attr('module-href') === cssUrl) {
						isExisted = true;
					}
		        });

				if(!isExisted) {
					$style = $('<style>');
					$style.attr('module-href', cssUrl);
					$style[0].innerHTML = cssContent;
					$('head').append($style);
				}
			},
			error: function() {
				console.err("load css file error!");
			}
		});
	};
	
    var resolveUrlParams = function() {
    	var hash = location.hash || location.search;
    	var questionMark = hash.indexOf('?');
    	if(questionMark !== -1) {
    		var search = hash.substring(questionMark + 1);
    		return JSON.parse('{"' + search.replace(/&/g, '","').replace(/\=/g, '":"') + '"}', function(key, value) {
    			return key === "" ? value : decodeURIComponent(value);
    		});
    	}
    	
    	return {};
    };
    
    var attrIsValid = function(options, attr) {
    	return options.hasOwnProperty(attr) && options.attr !== "" ? 
			true : false;
	};
	
	return {
		baseUrl: 'http://localhost:8888/IdeaWorks',
		loadcss: loadcss,
		resolveUrlParams: resolveUrlParams,
		attrIsValid: attrIsValid
	}
});