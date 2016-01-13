define([ 
         'backbone', 'util', 'MD5', 'cookie', 'Validator', 'i18n!../../../nls/translation',
         'model/LoginModel', 'model/ForgetPwdModel' 
       ], function(Backbone, util, MD5, cookie, Validator, i18n, LoginModel, ForgetPwdModel) {

	var SigninView = Backbone.View.extend({
		tagName: 'div',
		
		className: 'login',
		
		events: {
			'click .sign-in': 'login',
			'click .forget-pwd': 'forgetPwd',
			'click .wechat-login': 'wechatLogin'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'login', 'forgetPwd', 'wechatLogin',
					'validate', 'keypress', 'disableBtn', 'activeBtn');
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
			
			var $forgetPwd = $('<a class="forget-pwd">' + i18n.login.SigninView.FORGET_PWD + '</a>');
			
			var $signin = $('<div class="actions">');
			$signin.append($('<button class="sign-in btn btn-primary" type="button">' + i18n.login.SigninView.SIGN_IN + '</button>'));
			
			var $loginWithOther = $('<div class="login-other">');
			$loginWithOther.append($('<label class="login-label">' + i18n.login.SigninView.SIGN_IN_WITH + '</label>'));
			$loginWithOther.append($('<span class="wechat-login" title="' + i18n.login.SigninView.SIGN_IN_WITH_WECHAT + '"><i class="fa fa-weixin"></i></span>'));
			
			$(this.el).append($username);
			$(this.el).append($pwd);
			$(this.el).append($forgetPwd);
			$(this.el).append($signin);
			$(this.el).append($loginWithOther);
			
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
					sessionStorage.setItem('userlang', loginModel.get('userlang'));
					
					//如果url后面无参数则默认跳转到my.html；否则跳转到参数所指的url
					var urlParams = util.resolveUrlParams();
					if(urlParams.hasOwnProperty('from')) {
						window.location.href = urlParams.from;
					}else{
						window.location.href = "my.html";
					}
				}
			}); 
		},
		
		forgetPwd: function() {
			var forgetPasswordSubView = new ForgetPasswordSubView();
			var $subView = $('#forget_pwd_sub_view');
			if($subView.length == 0) {
				$('.container').append($(forgetPasswordSubView.render().el));
			}
			//显示view
			$('#forget_pwd_sub_view').modal('toggle');
		},
		
		wechatLogin: function() {
			alert('under construction...');
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
	
	/*
	 * Forget password sub view
	 * */
	var ForgetPasswordSubView = Backbone.View.extend({
		
		id: 'forget_pwd_sub_view',
		
		className: 'forget-pwd-sub-view modal fade',
		
		events: {
			'click .confirm': 'confirm'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'confirm');
		},
		
		render: function(){
			var $modalDialog = $('<div class="modal-dialog" role="document">');
			var $modalDialogContent = $('<div class="modal-content">');
			$modalDialog.append($modalDialogContent);
			
			var header = Header();
			$modalDialogContent.append(header);
			
			var body = Body();
			$modalDialogContent.append(body);
			
			var footer = Footer();
			$modalDialogContent.append(footer);
			
			$(this.el).append($modalDialog);
			
			//绑定modal消失时出发的事件
			var self = this;
			
			$(this.el).on('show.bs.modal', function (event) {
				//form validator
				console.log($modalDialogContent.find('#forgetPwdAttribute'));
				$modalDialogContent.find('#forgetPwdAttribute').bootstrapValidator({
					live: 'enabled',
			        message: 'This value is not valid',
			        feedbackIcons: {
			            valid: 'glyphicon glyphicon-ok',
			            invalid: 'glyphicon glyphicon-remove',
			            validating: 'glyphicon glyphicon-refresh'
			        },
			        fields: {
			        	fpwd_username: {
			                validators: {
			                    notEmpty: {
			                        message: i18n.login.ForgetPasswordSubView.CHECK_USERNAME_EMPTY
			                    },
			                    regexp: {
			                        regexp: '^[a-z0-9]+$',
			                        message: i18n.login.ForgetPasswordSubView.CHECK_USERNAME_VALID
			                    },
			                    stringLength: {
			                    	max: 30,
			                        message: i18n.login.ForgetPasswordSubView.CHECK_USERNAME_LENGTH
			                    }
			                }
			            },
			            fpwd_email: {
			                validators: {
			                	notEmpty: {
			                        message: i18n.login.ForgetPasswordSubView.CHECK_EMAIL_EMPTY
			                    },
			                	emailAddress: {
			                        message: i18n.login.ForgetPasswordSubView.CHECK_EMAIL_VALID
			                    }
			                }
			            }
			        }
			    });
			});
			
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		//confirm function
		confirm: function() {
			//validate
			$('#forgetPwdAttribute').data('bootstrapValidator').validateField('fpwd_username');
			$('#forgetPwdAttribute').data('bootstrapValidator').validateField('fpwd_email');
			if(!$('#forgetPwdAttribute').data('bootstrapValidator').isValid()) return;
			
			var forgetPwdModel = new ForgetPwdModel();
			forgetPwdModel.save({
				'userid': $('#fpwd_username').val(),
				'email': $('#fpwd_email').val()
			},{
				success: function() {
					$('#forget_pwd_sub_view').modal('toggle');
					
					if(forgetPwdModel.get('msg') != 'ok') {//找回密码失败
						alert(forgetPwdModel.get('msg'));
					}else{//找回密码成功
						alert(i18n.login.ForgetPasswordSubView.SUCCESS);
					}
				}
			}); 
		}
	});
	
	var Header = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">' + i18n.login.ForgetPasswordSubView.TITLE + '</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var Footer = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="button" class="cancel btn btn-default" data-dismiss="modal">' + i18n.login.ForgetPasswordSubView.CANCEL + '</a> ' + 
			'	<a type="submit" class="confirm btn btn-primary">' + i18n.login.ForgetPasswordSubView.CONFIRM + '</a> ' + 
			'</div> ';
		return tpl;
	}
	
	var Body = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="forgetPwdAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="fpwd_username" class="control-label">' + i18n.login.ForgetPasswordSubView.USER_ID + '</label> ' + 
			'			<input type="text" class="form-control" id="fpwd_username" name="fpwd_username" placeholder="' + i18n.login.ForgetPasswordSubView.USER_ID_HOLDER + '"> ' + 
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="fpwd_email" class="control-label">' + i18n.login.ForgetPasswordSubView.EMAIL + '</label> ' + 
			'			<input type="text" class="form-control" id="fpwd_email" name="fpwd_email" placeholder="' + i18n.login.ForgetPasswordSubView.EMAIL_HOLDER + '"> ' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}
	
	return SigninView;
});
