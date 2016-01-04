define([ 
         'backbone', 'util', 'MD5', 'cookie', 'i18n!../../../nls/translation',
         'model/LoginModel' 
       ], function(Backbone, util, MD5, cookie, i18n, LoginModel) {

	var SigninView = Backbone.View.extend({
		tagName: 'div',
		
		className: 'login',
		
		events: {
			'click .sign-in': 'login'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'login', 'validate', 'keypress', 'disableBtn', 'activeBtn');
		},
		
		render: function(){
			var $username = $('<div class="input-group">');
			$username.append($('<span class="input-group-addon">'));
			$username.find('.input-group-addon').append('<span class="glyphicon glyphicon-user">');
			$username.append('<input id="userid" class="form-control valid ng-dirty ng-valid ng-valid-required" type="text" placeholder="' + i18n.login.SigninView.USERNAME + '">');

			var $pwd = $('<div class="input-group">');
			$pwd.append($('<span class="input-group-addon">'));
			$pwd.find('.input-group-addon').append('<i class="glyphicon glyphicon-lock">');
			$pwd.append('<input id="password" class="form-control ng-valid-minlength valid ng-dirty ng-valid ng-valid-required" type="password" placeholder="' + i18n.login.SigninView.PASSWORD + '" required="" ng-minlength="6">');
			
			var $signin = $('<div class="actions">');
			$signin.append($('<button class="sign-in btn btn-primary" type="button">' + i18n.login.SigninView.SIGN_IN + '</button>'));
			
			$(this.el).append($username);
			$(this.el).append($pwd);
			$(this.el).append($signin);
			
			//绑定enter点击事件
			$('body').off('keydown').on('keydown', this.keypress);
			
			return this;
		},
		
		keypress: function(e) {
	        var code = e.keyCode || e.which;
	        if(code == 13) {  //press enter button 
	            this.login();
	        }
	    },
		
		login: function() {
			var self = this;
			
			//get params
			var userid = $("#userid").val();
			var password = $("#password").val();
			
			if(!this.validate(userid, password)) {
				return;
			}
			
			//点击登录之后,禁用button
			self.disableBtn();
			
			var loginModel = new LoginModel();
			loginModel.save({
				'userid': userid,
				'password': md5(password)
			},{
				success: function() {
					//登录失败
					if(loginModel.get('msg') != 'ok') {
						$(".actions").find(".login-	").remove();
						$(".sign-in").before('<div class="login-check alert alert-danger" role="alert">'+ loginModel.get('msg') +'</div>');
						
						//恢复按钮状态
						self.activeBtn();
						
						return;
					}
					
					//登录成功,设置登录态
					$.cookie('userid', loginModel.get('userid'));
					$.cookie('userlogo', loginModel.get('userlogo'));
					$.cookie('nickname', loginModel.get('nickname'));
					$.cookie('userlang', loginModel.get('userlang'));
					
					//如果url后面无参数则默认跳转到my.html；否则跳转到参数所指的url
					var urlParams = util.resolveUrlParams();
					if(urlParams.hasOwnProperty('from')) {
						window.location.href = urlParams.from;
					}else{
						window.location.href = util.baseUrl + "/my.html";
					}
				}
			}); 
		},
		
		validate: function(id, pwd) {
			$(".actions").find(".login-check").remove();
			if(id == "" || pwd == "") {
				$(".sign-in").before('<div class="login-check alert alert-danger" role="alert">' + i18n.login.SigninView.CHECK_USERNAME_OR_PWD_EMPTY + '</div>');
				
				return false;
			}else{
				return true;
			}
		},
		
		disableBtn: function() {
			$('.sign-in', this.el).attr('disabled', 'disabled');
			$('.sign-in', this.el).html(i18n.login.SigninView.SIGNING_IN);
		},
		
		activeBtn: function() {
			$('.sign-in', this.el).removeAttr('disabled');
			$('.sign-in', this.el).html(i18n.login.SigninView.SIGN_IN);
		}
	});
	
	return SigninView;
});
