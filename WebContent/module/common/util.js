define(['jquery'], function($) {
	
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
		resolveUrlParams: resolveUrlParams,
		attrIsValid: attrIsValid
	}
});