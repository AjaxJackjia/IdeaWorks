define(['jquery', 'cookie' ], function($, cookie) {
	/*
	 * 将操作与实体代码与具体显示的语句进行mapping
	 * */
	
	//思路: 关于notification与activity单独维护一个信息映射表;
	/* action code mapping: */
	var action = {};
	action.CREATE 	= 100;
	action.MODIFY 	= 200;
	action.READ 	= 300;
	action.DELETE 	= 400;
	action.JOIN		= 500;
	action.REMOVE	= 600;
	action.LEAVE 	= 700;
	action.UPLOAD 	= 800;
	action.REPLY 	= 900;
	action.APPLY 	= 1000;
	action.REJECT	= 2000;
	action.AGREE	= 3000;
	/* entity code mapping */
	var entity = {};
	entity.PROJECT				 = 100;
	entity.PROJECT_TITLE		 = 101;
	entity.PROJECT_ADVISOR		 = 102;
	entity.PROJECT_ABSTRACT		 = 103;
	entity.PROJECT_LOGO			 = 104;
	entity.PROJECT_STATUS		 = 105;
	entity.PROJECT_SECURITY 	 = 106;
	entity.MEMBER 				 = 200;
	entity.MILESTONE 			 = 300;
	entity.MILESTONE_TITLE 		 = 301;
	entity.MILESTONE_DESCRIPTION = 302;
	entity.TOPIC 				 = 400;
	entity.TOPIC_TITLE 			 = 401;
	entity.TOPIC_DESCRIPTION	 = 402;
	entity.MESSAGE				 = 500;
	entity.FILE					 = 600;
	entity.APPLICATION			 = 700;
	/* msg mapping */
	var kv = {};
	//action
	kv.CREATE 	= 'create';
	kv.MODIFY 	= 'modify';
	kv.READ 	= 'read';
	kv.DELETE 	= 'delete';
	kv.JOIN 	= 'join';
	kv.REMOVE 	= 'remove';
	kv.LEAVE 	= 'leave';
	kv.UPLOAD 	= 'upload';
	kv.REPLY 	= 'reply';
	kv.APPLY 	= 'apply';
	kv.REJECT	= 'reject';
	kv.AGREE	= 'agree';
	//entity
	kv.PROJECT 		= 'project';
	kv.MEMBER 		= 'member';
	kv.MILESTONE 	= 'milestone';
	kv.TOPIC 		= 'topic';
	kv.MESSAGE 		= 'message';
	kv.FILE 		= 'file';
	kv.APPLICATION 	= 'application';
	kv.TITLE 		= 'title';
	kv.ADVISOR 		= 'advisor';
	kv.ABSTRACT 	= 'abstract';
	kv.LOGO 		= 'logo';
	kv.STATUS 		= 'status';
	kv.SECURITY 	= 'security';
	kv.DESCRIPTION 	= 'description';
	//assist
	kv.UNKNOWN = 'unknown';
	kv.OF = "\'s";
	kv.IN = "in";
	kv.FROM = "from";
	kv.TO = "to";
	kv.THIS = "this"; 
	kv.WITH = "with";
	kv.YOU = "you";
	kv.ONGOING = "ongoing";
	kv.COMPLETE = "complete";
	kv.PUBLIC = "public";
	kv.GROUP = "group visible";
	
	kv.emphasize = function(str) {
		return '<span class="foci">' + str + '</span>';
	};
	
	//通过编码来对不同操作来定制显示的内容
	var statusMapping = function(code) {
		/*
		 * 0: ongoing;
		 * 1: complete;
		 * unknown;
		 * */
		if(code == 0) {
			return kv.ONGOING;
		}else if(code == 1) {
			return kv.COMPLETE;
		}else{
			return kv.UNKNOWN;
		}
	};
	
	var securityMapping = function(code) {
		/*
		 * 0: public;
		 * 1: group visible;
		 * unknown;
		 * */
		if(code == 0) {
			return kv.PUBLIC;
		}else if(code == 1) {
			return kv.GROUP;
		}else{
			return kv.UNKNOWN;
		}
	};
	
	var createActionMapping = function(response) {
		var originInfo = $.parseJSON(response.title);
		if(response.entity == entity.PROJECT)
		{
			return kv.CREATE + ' ' + kv.PROJECT + ' ' + originInfo.title;
		}
		else if(response.entity == entity.MILESTONE)
		{
			return kv.CREATE + ' ' + kv.MILESTONE + ' ' + originInfo.title;
		}
		else if(response.entity == entity.TOPIC)
		{
			return kv.CREATE + ' ' + kv.TOPIC + ' ' + originInfo.title;
		}
		else
		{
			return kv.CREATE + ' ' + kv.UNKNOWN + ' ' + originInfo.title;
		}
	};
	
	var modifyActionMapping = function(response) {
		var originInfo = $.parseJSON(response.title);
		if(response.entity == entity.PROJECT_TITLE)
		{
			return kv.MODIFY + ' ' + kv.PROJECT + kv.OF + ' ' + kv.TITLE + ' ' + 
				kv.emphasize(kv.FROM) + ' ' + originInfo.original + ' ' + 
				kv.emphasize(kv.TO) + ' ' + originInfo.current;
		}
		else if(response.entity == entity.PROJECT_ADVISOR)
		{
			return kv.MODIFY + ' ' + kv.PROJECT + kv.OF + ' ' + kv.ADVISOR + ' ' + 
				kv.emphasize(kv.FROM) + ' ' + originInfo.original + ' ' + 
				kv.emphasize(kv.TO) + ' ' + originInfo.current;
		}
		else if(response.entity == entity.PROJECT_ABSTRACT)
		{
			return kv.MODIFY + ' ' + kv.PROJECT + kv.OF + ' ' + kv.ABSTRACT + ' ' + 
				kv.emphasize(kv.FROM) + ' ' + originInfo.original + ' ' + 
				kv.emphasize(kv.TO) + ' ' + originInfo.current;
		}
		else if(response.entity == entity.PROJECT_LOGO)
		{
			return kv.MODIFY + ' ' + kv.PROJECT + kv.OF + ' ' + kv.LOGO + ' ' + 
				kv.emphasize(kv.FROM) + ' ' + originInfo.original + ' ' + 
				kv.emphasize(kv.TO) + ' ' + originInfo.current;
		}
		else if(response.entity == entity.PROJECT_STATUS)
		{
			return kv.MODIFY + ' ' + kv.PROJECT + kv.OF + ' ' + kv.STATUS + ' ' + 
				kv.emphasize(kv.FROM) + ' ' + statusMapping(originInfo.original) + ' ' + 
				kv.emphasize(kv.TO) + ' ' + statusMapping(originInfo.current);
		}
		else if(response.entity == entity.PROJECT_SECURITY)
		{
			return kv.MODIFY + ' ' + kv.PROJECT + kv.OF + ' ' + kv.SECURITY + ' ' + 
				kv.emphasize(kv.FROM) + ' ' + securityMapping(originInfo.original) + ' ' + 
				kv.emphasize(kv.TO) + ' ' + securityMapping(originInfo.current);
		}
		else if(response.entity == entity.MILESTONE_TITLE)
		{
			return kv.MODIFY + ' ' + kv.MILESTONE + ' ' + originInfo.title + kv.OF + ' ' + kv.TITLE + ' ' + 
				kv.emphasize(kv.FROM) + ' ' + originInfo.original + ' ' + 
				kv.emphasize(kv.TO) + ' ' + originInfo.current;
		}
		else if(response.entity == entity.MILESTONE_DESCRIPTION)
		{
			return kv.MODIFY + ' ' + kv.MILESTONE + ' ' + originInfo.title + kv.OF + ' ' + kv.DESCRIPTION;
		}
		else if(response.entity == entity.TOPIC_TITLE)
		{
			return kv.MODIFY + ' ' + kv.TOPIC + ' ' + originInfo.title + kv.OF + ' ' + kv.TITLE + ' ' + 
				kv.emphasize(kv.FROM) + ' ' + originInfo.original + ' ' + 
				kv.emphasize(kv.TO) + ' ' + originInfo.current;
		}
		else if(response.entity == entity.TOPIC_DESCRIPTION)
		{
			return kv.MODIFY + ' ' + kv.TOPIC + ' ' + originInfo.title + kv.OF + ' ' + kv.DESCRIPTION;
		}
		else
		{
			return kv.MODIFY + ' ' + kv.UNKNOWN;
		}
	};
	
	var deleteActionMapping = function(response) {
		var originInfo = $.parseJSON(response.title);
		if(response.entity == entity.PROJECT)
		{
			return kv.DELETE + ' ' + kv.PROJECT + ' ' + originInfo.title;
		}
		else if(response.entity == entity.MILESTONE)
		{
			return kv.DELETE + ' ' + kv.MILESTONE + ' ' + originInfo.title;
		}
		else if(response.entity == entity.TOPIC)
		{
			return kv.DELETE + ' ' + kv.TOPIC + ' ' + originInfo.title;
		}
		else if(response.entity == entity.FILE)
		{
			return kv.DELETE + ' ' + kv.FILE + ' ' + originInfo.title;
		}
		else
		{
			return kv.DELETE + ' ' + kv.UNKNOWN;
		}
	};
	
	var joinActionMapping = function(response) {
		var originInfo = $.parseJSON(response.title);
		if(response.entity == entity.MEMBER)
		{
			return kv.JOIN + ' ' + kv.MEMBER + ' ' + originInfo.title;
		}
		else
		{
			return kv.JOIN + ' ' + kv.UNKNOWN;
		}
	};
	
	var leaveActionMapping = function(response) {
		return kv.LEAVE + ' ' + kv.THIS + ' ' + kv.PROJECT;
	};
	
	var uploadActionMapping = function(response) {
		var originInfo = $.parseJSON(response.title);
		if(response.entity == entity.FILE)
		{
			return kv.UPLOAD + ' ' + kv.FILE + ' ' + response.title;
		}
		else
		{
			return kv.UPLOAD + ' ' + kv.UNKNOWN;
		}
	};
	
	var replyActionMapping = function(response) {
		var originInfo = $.parseJSON(response.title);
		if(response.entity == entity.MESSAGE)
		{
			if(originInfo.hasOwnProperty('pmessageid')) {
				return kv.emphasize(kv.IN + ' ' + kv.TOPIC) + ' ' + originInfo.topic_title + '<br/>' + 
					kv.emphasize(kv.REPLY) + ' ' + originInfo.pmsg + 
					kv.emphasize(kv.WITH)  + ' ' + originInfo.msg;
			}else{
				return kv.emphasize(kv.IN + ' ' + kv.TOPIC) + ' ' + originInfo.topic_title + '<br/>' + 
					kv.emphasize(kv.REPLY) + ' ' + originInfo.msg;
			}
		}
		else
		{
			return kv.REPLY + ' ' + kv.UNKNOWN;
		}
	};
	
	var applyActionMapping = function(response) {
		if(response.entity == entity.APPLICATION)
		{
			return kv.APPLY + ' ' + kv.TO + ' ' + kv.JOIN + ' ' + kv.THIS + ' ' + kv.PROJECT;
		}
		else
		{
			return kv.APPLY + ' ' + kv.UNKNOWN;
		}
	};
	
	var rejectActionMapping = function(response) {
		if(response.entity == entity.APPLICATION)
		{
			return kv.REJECT + ' ' + kv.YOU + ' ' + kv.TO + ' ' + kv.JOIN + ' ' + kv.THIS + ' ' + kv.PROJECT;
		}
		else
		{
			return kv.REJECT + ' ' + kv.UNKNOWN;
		}
	};
	var agreeActionMapping = function(response) {
		if(response.entity == entity.APPLICATION)
		{
			return kv.AGREE + ' ' + kv.YOU + ' ' + kv.TO + ' ' + kv.JOIN + ' ' + kv.THIS + ' ' + kv.PROJECT;
		}
		else
		{
			return kv.AGREE + ' ' + kv.UNKNOWN;
		}
	};
	
	var KeyRouteMapping = function(response) {
		switch(response.action) {
		case action.CREATE: 
			response.title = createActionMapping(response);
			break;
		case action.MODIFY: 
			response.title = modifyActionMapping(response);
			break;
		case action.READ: break;
		case action.DELETE: 
			response.title = deleteActionMapping(response);
			break;
		case action.JOIN: 
			response.title = joinActionMapping(response);
			break;
		case action.REMOVE: break;
		case action.LEAVE: 
			response.title = leaveActionMapping(response);
			break;
		case action.UPLOAD: 
			response.title = uploadActionMapping(response);
			break;
		case action.REPLY: 
			response.title = replyActionMapping(response);
			break;
		case action.APPLY: 
			response.title = applyActionMapping(response);
			break;
		case action.REJECT: 
			response.title = rejectActionMapping(response);
			break;
		case action.AGREE: 
			response.title = agreeActionMapping(response);
			break;
		default: break;
		}
		return response;
	};
	
	return {
		mapping: KeyRouteMapping
	}
});