define([ 
         'backbone', 'util', 'Validator', 'i18n!../../../nls/translation',
         'model/SignupModel', 'model/LoginModel' 
       ], function(Backbone, util, Validator, i18n, SignupModel, LoginModel) {
	
	var SignupView = Backbone.View.extend({
		tagName: 'div',
		
		className: 'signup',
		
		events: {
			'click .sign-up': 'signup'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'signup');
		},
		
		render: function(){
			var $signup_items = $(SiupItems());
			
			var $signup = $('<div class="actions">');
			$signup.append($('<button class="sign-up btn btn-primary" type="button">' + i18n.login.SignupView.SIGN_UP + '</button>'));
			
			//form validator
			$signup_items.bootstrapValidator({
				live: 'enabled',
		        message: 'This value is not valid',
		        feedbackIcons: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },
		        fields: {
		        	username: {
		                validators: {
		                    notEmpty: {
		                        message: i18n.login.SignupView.CHECK_USERNAME_EMPTY
		                    },
		                    regexp: {
		                        regexp: '^[a-z0-9]+$',
		                        message: i18n.login.SignupView.CHECK_USERNAME_VALID
		                    },
		                    stringLength: {
		                    	max: 30,
		                        message: i18n.login.SignupView.CHECK_USERNAME_LENGTH
		                    }
		                }
		            },
		            pwd: {
		                validators: {
		                	notEmpty: {
		                        message: i18n.login.SignupView.CHECK_PWD_EMPTY
		                    },
		                    identical: {
		                        field: 'pwd_confirm',
		                        message: i18n.login.SignupView.CHECK_PWD_CONFIRM
		                    },
		                    stringLength: {
		                    	min: 6,
		                        message: i18n.login.SignupView.CHECK_PWD_LENGTH
		                    }
		                }
		            },
		            pwd_confirm: {
		                validators: {
		                	notEmpty: {
		                        message: i18n.login.SignupView.CHECK_PWD_EMPTY
		                    },
		                    identical: {
		                        field: 'pwd',
		                        message: i18n.login.SignupView.CHECK_PWD_CONFIRM
		                    }
		                }
		            },
		            email: {
		                validators: {
		                	notEmpty: {
		                        message: i18n.login.SignupView.CHECK_EMAIL_EMPTY
		                    },
		                	emailAddress: {
		                        message: i18n.login.SignupView.CHECK_EMAIL_VALID
		                    }
		                }
		            }
		        }
		    });
			
			$(this.el).append($signup_items);
			$(this.el).append($signup);
			
			return this;
		},
		
		signup: function() {
			var self = this;
			
			//validate
			$('#signupAttribute').data('bootstrapValidator').validateField('username');
			$('#signupAttribute').data('bootstrapValidator').validateField('pwd');
			$('#signupAttribute').data('bootstrapValidator').validateField('pwd_confirm');
			$('#signupAttribute').data('bootstrapValidator').validateField('email');
			if(!$('#signupAttribute').data('bootstrapValidator').isValid()) return;
			
			//禁用按钮
			self.disableBtn();
			
			var signupModel = new SignupModel();
			signupModel.save({
				'username': $('#username').val(),
				'password': md5($('#pwd').val()),
				'usertype': $('#usertype').val(),
				'email': $('#email').val() 
			},{
				success: function() {
					//注册失败
					if(signupModel.get('msg') != 'ok') {
						alert(signupModel.get('msg'));
						
						//恢复按钮
						self.activeBtn();
						
						return;
					}
					
					//注册成功
					self.login(signupModel.get('username'), signupModel.get('password'));
				}
			}); 
		},
		
		login: function(username, password) {
			var loginModel = new LoginModel();
			loginModel.save({
				'userid': username,
				'password': password
			},{
				success: function() {
					//若登录失败,则让用户重新手动登录
					if(loginModel.get('msg') != 'ok') {
						alert(i18n.login.SignupView.SIGN_UP_SUCCESS);
						window.location.href = "login.html";
						return;
					}
					
					//登录成功,设置登录态
					$.cookie('userid', loginModel.get('userid'));
					$.cookie('userlogo', loginModel.get('userlogo'));
					$.cookie('nickname', loginModel.get('nickname'));
					sessionStorage.setItem('userlang', loginModel.get('userlang'));
					
					//跳转到个人中心
					window.location.href = "my.html";
				}
			}); 
		},
		
		disableBtn: function() {
			$('.sign-up', this.el).attr('disabled', 'disabled');
			$('.sign-up', this.el).html(i18n.login.SignupView.SIGNING_UP);
		},
		
		activeBtn: function() {
			$('.sign-up', this.el).removeAttr('disabled');
			$('.sign-up', this.el).html(i18n.login.SignupView.SIGN_UP);
		}
	});
	
	var SiupItems = function() {
		var tpl = 
			'<form id="signupAttribute"> ' + 
			'	<div class="form-group"> ' + 
			'		<label for="username" class="control-label">' + i18n.login.SignupView.USERNAME_TITLE + '</label> ' + 
			'		<input type="text" class="form-control" id="username" name="username" placeholder="' + i18n.login.SignupView.USERNAME_HOLDER + '"> ' + 
			'	</div> ' + 
			'	<div class="form-group"> ' + 
			'		<label for="pwd" class="control-label">' + i18n.login.SignupView.PASSWORD_TITLE + '</label> ' + 
			'		<input type="password" class="form-control" id="pwd" name="pwd" placeholder="' + i18n.login.SignupView.PASSWORD_HOLDER + '"> ' + 
			'	</div> ' + 
			'	<div class="form-group"> ' + 
			'		<label for="pwd_confirm" class="control-label">' + i18n.login.SignupView.PASSWORD_CONFIRM_TITLE + '</label> ' + 
			'		<input type="password" class="form-control" id="pwd_confirm" name="pwd_confirm" placeholder="' + i18n.login.SignupView.PASSWORD_CONFIRM_HOLDER + '"> ' + 
			'	</div> ' + 
			'	<div class="form-group"> ' + 
			'		<label for="usertype" class="control-label">' + i18n.login.SignupView.USERTYPE_TITLE + '</label> ' + 
			'		<select id="usertype" class="form-control"> ' + 
			'			<option value="0">' + i18n.login.SignupView.STUDENT + '</option>' +
			'			<option value="1">' + i18n.login.SignupView.TEACHER + '</option>' +
			'			<option value="2">' + i18n.login.SignupView.SOCIAL + '</option>' +
			'		</select> ' + 
			'	</div> ' + 
			'	<div class="form-group"> ' + 
			'		<label for="email" class="control-label">' + i18n.login.SignupView.EMAIL_TITLE + '</label> ' + 
			'		<input type="text" class="form-control" id="email" name="email" placeholder="' + i18n.login.SignupView.EMAIL_HOLDER + '"> ' + 
			'	</div> ' + 
			'</form> ';
		return tpl;
	}
	
	return SignupView;
});
