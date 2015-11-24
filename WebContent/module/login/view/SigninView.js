define([ 'backbone', 'util', 'cookie', 'model/LoginModel' ], function(Backbone, util, cookie, LoginModel) {

	var SigninView = Backbone.View.extend({
		tagName: 'div',
		
		className: 'login',
		
		events: {
			'click .sign-in': 'login'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'login', 'validate');
		},
		
		render: function(){
			var $username = $('<div class="input-group">');
			$username.append($('<span class="input-group-addon">'));
			$username.find('.input-group-addon').append('<span class="glyphicon glyphicon-user">');
			$username.append('<input id="userid" class="form-control valid ng-dirty ng-valid ng-valid-required" type="text" placeholder="please enter your username">');

			var $pwd = $('<div class="input-group">');
			$pwd.append($('<span class="input-group-addon">'));
			$pwd.find('.input-group-addon').append('<i class="glyphicon glyphicon-lock">');
			$pwd.append('<input id="password" class="form-control ng-valid-minlength valid ng-dirty ng-valid ng-valid-required" type="password" placeholder="please enter your password" required="" ng-minlength="6">');
			
			var $signin = $('<div class="actions">');
			$signin.append($('<input class="sign-in btn btn-primary" type="button" value="Sign In">'));
			
			$(this.el).append($username);
			$(this.el).append($pwd);
			$(this.el).append($signin);
			
			return this;
		},
		
		login: function() {
			//get params
			var userid = $("#userid").val();
			var password = $("#password").val();
			
			if(!this.validate(userid, password)) {
				return;
			}
			
			var loginModel = new LoginModel();
			loginModel.save({
				'userid': userid, 
				'password': password
			},{
				success: function() {
					//登录失败
					if(loginModel.get('msg') != 'ok') {
						$(".actions").find(".login-check").remove();
						$(".sign-in").before('<div class="login-check alert alert-danger" role="alert">'+ loginModel.get('msg') +'</div>');
						return;
					}
					
					//登录成功
					$.cookie('userid', userid);
					window.location.href = util.baseUrl + "/my.html";
				}
			}); 
		},
		
		validate: function(id, pwd) {
			$(".actions").find(".login-check").remove();
			if(id == "" || pwd == "") {
				$(".sign-in").before('<div class="login-check alert alert-danger" role="alert">Username or password can\'t be empty!</div>');
				
				return false;
			}else{
				return true;
			}
		}
	});
	
	return SigninView;
});
