define(['jquery', 'cookie' ], function($, cookie) {
	
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
    
    var setUserNickname = function(nickname) {
    	$.cookie('nickname', nickname)
    };
    
    var setUserLogo = function(logo) {
    	$.cookie('userlogo', logo)
    };
    
    var currentUser = function() {
    	if(isLogin()) {
    		return $.cookie('userid');
    	}else{
    		logout();
    	}
    };
    
    var currentUserProfile = function() {
    	if(isLogin()) {
    		var profile = {};
    		profile.userid = $.cookie('userid');
    		profile.nickname = $.cookie('nickname');
    		profile.userlogo = $.cookie('userlogo');
    		return profile;
    	}else{
    		logout();
    	}
    };
    
    var isLogin = function() {
    	return !($.cookie('userid') == undefined || $.cookie('userid') == null);
    };
    
    var logout = function() {
    	$.cookie('userid', null);
    	$.cookie('userlogo', null);
    	$.cookie('nickname', null);
    	$.cookie('nicklang', null);
    	
    	window.location.href = 'login.html';
    };
    
    var attrIsValid = function(options, attr) {
    	return options.hasOwnProperty(attr) && options.attr !== "" ? 
			true : false;
	};
	
	var commonErrorHandler = function(data, definedMsg) {
		if(data.ret == '400') { //参数错误
			alert(data.msg);
		}else if(data.ret == '401') { //session失效
			alert(data.msg);
			window.location.href = 'login.html';
		}else{ //自定义提示错误
			if(definedMsg != "")
				alert(data.msg);
		}
	};
	
	// 判断类型

	function isBoolean(p_value)
	{
	    return typeof (p_value) === "boolean";
	}

	function isString(p_value)
	{
	    return typeof (p_value) === "string";
	}

	function isNumber(p_value)
	{
	    return typeof (p_value) === "number";
	}

	function isDate(p_value)
	{
	    return notEmpty(p_value) && p_value.constructor === Date;
	}

	function isArray(p_value)
	{
	    if (typeof(Array.isArray) === "function")
	    {
	        return Array.isArray(p_value);
	    }
	    else
	    {
	        return notEmpty(p_value) && (typeof (p_value) === "object" && typeof (p_value.length) === "number");
	    }
	}

	function isObject(p_value)
	{
	    return notEmpty(p_value) && typeof (p_value) === "object";
	}

	function isPlainObject(p_value)
	{
	    return $.isPlainObject(p_value);
	}

	function isFunction(p_value)
	{
	    return typeof (p_value) === "function";
	}

	function isClass(p_value)
	{
	    return typeof (p_value) === "function";
	}
	
	// =====================================================================
	// Number
	// =====================================================================

	Number.format = function(p_value, p_formatString)
	{
	    if (isEmpty(p_value))
	    {
	        return "";prop
	    }
	    if (typeof (p_formatString) === "undefiend")
	    {
	        return p_value + "";
	    }
	    if (!isNumber(p_value))
	    {
	        p_value = 0;
	    }

	    var percentage = "";
	    if (p_formatString.endsWith("%") && p_formatString.length > 1)
	    {
	        percentage = "%";
	        p_value = p_value * 100;
	        p_formatString = p_formatString.substr(0, p_formatString.length - 1);
	    }

	    var string = p_value + "";
	    if (notEmpty(p_formatString) && p_formatString !== "")
	    {
	        var stringParts = string.split('.');
	        var formatParts = p_formatString.split('.');

	        if (!formatParts[0].endsWith(",000") && stringParts[0].length < formatParts[0].length)
	        {
	            stringParts[0] = formatParts[0].substring(0, formatParts[0].length - stringParts[0].length) + stringParts[0];
	        }

	        if (formatParts[0].endsWith(",000"))
	        {
	            stringParts[0] = stringParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	        }

	        if (formatParts.length === 1)
	        {
	            return stringParts[0] + percentage;
	        }
	        else
	        {
	            var fl = parseFloat("0." + stringParts[1]);
	            fl = fl.toFixed(formatParts[1].length);
	            return stringParts[0] + "." + fl.substr(2) + percentage;
	        }
	    }
	    else
	    {
	        return string;
	    }
	};
	
	// =====================================================================
	// Date
	// =====================================================================
	
	function $format(p_value, p_format)
	{
	    if (isString(p_value) && (isArray(p_format) || isNumber(p_format) || isPlainObject(p_format)))
	    {
	        return String.format(p_value, p_format);
	    }
	    if (isNumber(p_value))
	    {
	        return Number.format(p_value, p_format);
	    }
	    else if (isDate(p_value))
	    {
	        return Date.format(p_value, p_format);
	    }
	    else
	    {
	        return notEmpty(p_value) ? p_value.toString() : "";
	    }
	}

	function isEmpty(p_value)
	{
	    return p_value === undefined || p_value === null;
	}

	function notEmpty(p_value)
	{
	    return !isEmpty(p_value);
	}
	
	Date.today = new Date();
	Date.today = new Date(Date.today.getFullYear(), Date.today.getMonth(), Date.today.getDate());
	Date.format = function(p_value, p_formatString)
	{
	    if (notEmpty(p_value))
	    {
	        var text;
	        if (!p_formatString)
	        {
	            text = "yyyy-MM-dd HH:mm:ss";
	        }
	        else if (p_formatString === "smart")
	        {
	            var result = null;
	            var now = new Date();
	            var deltaMin = Math.round((now.getTime() - p_value) / 1000 / 60);
	            if (deltaMin <= 0)
	            {
	                result = "a moment ago";
	            }
	            else if (deltaMin <= 1)
	            {
	                result = Math.round((now.getTime() - p_value) / 1000) + " seconds ago";
	            }
	            else if (deltaMin < 60)
	            {
	                result = deltaMin + " minutes ago";
	            }
	            else if (deltaMin === 60)
	            {
	                result = "1 hour ago";
	            }
	            else
	            {
	                var deltaHour = Math.round(deltaMin / 60);
	                if (deltaHour < 24)
	                {
	                    result = deltaHour + " hours ago";
	                }
	                else if (deltaHour === 24)
	                {
	                    result = "1 day ago";
	                }
	                else
	                {
	                    var deltaDay = Math.round(deltaHour / 24);
	                    if (deltaDay < 8)
	                    {
	                        result = deltaDay + " days ago";
	                    }
	                }
	            }
	            if (notEmpty(result))
	            {
	                return result;
	            }
	            else
	            {
	                text = "yyyy-M-d";
	            }
	        }
	        else
	        {
	            text = p_formatString;
	        }

	        var yy = p_value.getYear();
	        var M = p_value.getMonth() + 1;
	        var d = p_value.getDate();
	        var h = p_value.getHours();
	        if (h > 12)
	        {
	            h = p_value.getHours() % 12;
	        }
	        var H = p_value.getHours();
	        var m = p_value.getMinutes();
	        var s = p_value.getSeconds();

	        var yyyy = p_value.getFullYear();
	        var MM = Number.format(M, "00");
	        var dd = Number.format(d, "00");
	        var hh = Number.format(h, "00");
	        var HH = Number.format(H, "00");
	        var mm = Number.format(m, "00");
	        var ss = Number.format(s, "00");

	        text = text.replace("yyyy", yyyy).replace("MM", MM).replace("dd", dd);
	        text = text.replace("HH", HH).replace("hh", hh).replace("mm", mm).replace("ss", ss);
	        text = text.replace("yy", yy).replace("M", M).replace("d", d);
	        text = text.replace("H", H).replace("h", h).replace("m", m).replace("s", s);

	        return text;
	    }
	    else
	    {
	        return "";
	    }
	};

	Date.getDaysInMonth = function(p_year, p_month)
	{
	    switch (p_month + 1)
	    {
	        case 2:
	            if ((p_year % 400 === 0) || (p_year % 4 === 0) && (p_year % 100 !== 0))
	            {
	                return 29;
	            }
	            else
	            {
	                return 28;
	            }
	            break;
	        case 1:
	        case 3:
	        case 5:
	        case 7:
	        case 8:
	        case 10:
	        case 12:
	            return 31;
	        default:
	            return 30;
	    }
	};

	Date.prototype.addMilliSecond = function(p_ms)
	{
	    var ms = this * 1 + p_ms;
	    var date = new Date(ms);
	    return date;
	};

	Date.prototype.addSeconds = function(p_seconds)
	{
	    var ms = this * 1 + p_seconds * 1000;
	    var date = new Date(ms);
	    return date;
	};

	Date.prototype.addMinutes = function(p_minutes)
	{
	    return this.addSeconds(p_minutes * 60);
	};

	Date.prototype.addHours = function(p_hours)
	{
	    return this.addMinutes(p_hours * 60);
	};

	Date.prototype.addDays = function(p_days)
	{
	    return this.addHours(p_days * 24);
	};

	Date.prototype.addWeeks = function(p_weeks)
	{
	    return this.addDays(p_weeks * 7);
	};

	Date.prototype.addMonths = function(p_months)
	{
	    var copy = new Date(this * 1);
	    var months = copy.getMonth() + 1 + p_months;

	    var years = Math.floor(months / 12);

	    var year = copy.getFullYear() + years;
	    var month = Math.abs(years * 12 - months) % 12;
	    var date = copy.getDate();
	    var daysInMonth = Date.getDaysInMonth(year, month - 1);

	    if (date > daysInMonth)
	    {
	        date = daysInMonth;
	    }

	    copy.setDate(1);
	    copy.setFullYear(year);
	    copy.setMonth(month - 1);
	    copy.setDate(date);

	    return copy;
	};

	Date.prototype.addYears = function(p_years)
	{
	    var copy = this.addMonths(p_years * 12);
	    return copy;
	};

	Date.prototype.equals = function(p_date)
	{
	    return this.compare(p_date) === 0;
	};

	Date.prototype.compare = function(p_date)
	{
	    if (isEmpty(p_date))
	    {
	        return -1;
	    }

	    if (p_date.constructor !== Date)
	    {
	        return -1;
	    }

	    return p_date * 1 - this * 1;
	};

	Date.prototype.clone = function()
	{
	    var date = new Date(this * 1);
	    return date;
	};
	
	return {
		resolveUrlParams: resolveUrlParams,
	    setUserNickname: setUserNickname,
	    setUserLogo: setUserLogo,
		currentUser: currentUser,
		currentUserProfile: currentUserProfile,
		isLogin: isLogin,
		logout: logout,
		attrIsValid: attrIsValid,
		timeformat: Date.format,
		
		//请求统一错误处理函数
		commonErrorHandler: commonErrorHandler
	}
});