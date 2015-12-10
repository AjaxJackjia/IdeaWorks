define([ 'backbone', 'util', 'Validator', 'model/SignupModel' ], function(Backbone, util, Validator, SignupModel) {
	
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
			$signup.append($('<input class="sign-up btn btn-primary" type="button" value="Sign Up">'));
			
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
		                        message: 'The topic title is required'
		                    }
		                }
		            },
		            pwd: {
		                validators: {
		                	notEmpty: {
		                        message: 'The password is required'
		                    },
		                    identical: {
		                        field: 'pwd_confirm',
		                        message: 'The password twice input are not the same'
		                    },
		                    stringLength: {
		                    	min: 6,
		                        message: 'The password must be larger than 6 characters'
		                    }
		                }
		            },
		            pwd_confirm: {
		                validators: {
		                	notEmpty: {
		                        message: 'The confirm password is required'
		                    },
		                    identical: {
		                        field: 'pwd',
		                        message: 'The password twice input are not the same'
		                    }
		                }
		            },
		            email: {
		                validators: {
		                	notEmpty: {
		                        message: 'The email address is required'
		                    },
		                	emailAddress: {
		                        message: 'The value is not a valid email address'
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
			//validate
			$('#signupAttribute').data('bootstrapValidator').validateField('username');
			$('#signupAttribute').data('bootstrapValidator').validateField('pwd');
			$('#signupAttribute').data('bootstrapValidator').validateField('pwd_confirm');
			$('#signupAttribute').data('bootstrapValidator').validateField('email');
			if(!$('#signupAttribute').data('bootstrapValidator').isValid()) return;
			
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
						return;
					}
					
					//注册成功
					alert("Sign up success! Please login in use your username and password! Enjoy~")
					window.location.href = util.baseUrl + "/login.html";
				}
			}); 
		}
	});
	
	var SiupItems = function() {
		var tpl = 
			'<form id="signupAttribute"> ' + 
			'	<div class="form-group"> ' + 
			'		<label for="username" class="control-label">User name:</label> ' + 
			'		<input type="text" class="form-control" id="username" name="username" placeholder="user name..."> ' + 
			'	</div> ' + 
			'	<div class="form-group"> ' + 
			'		<label for="pwd" class="control-label">Password:</label> ' + 
			'		<input type="password" class="form-control" id="pwd" name="pwd" placeholder="password..."> ' + 
			'	</div> ' + 
			'	<div class="form-group"> ' + 
			'		<label for="pwd_confirm" class="control-label">Password Confirm:</label> ' + 
			'		<input type="password" class="form-control" id="pwd_confirm" name="pwd_confirm" placeholder="password confirm..."> ' + 
			'	</div> ' + 
			'	<div class="form-group"> ' + 
			'		<label for="usertype" class="control-label">User Type:</label> ' + 
			'		<select id="usertype" class="form-control"> ' + 
			'			<option value="0">Student</option>' +
			'			<option value="1">Teacher</option>' +
			'			<option value="2">Other</option>' +
			'		</select> ' + 
			'	</div> ' + 
			'	<div class="form-group"> ' + 
			'		<label for="email" class="control-label">Email:</label> ' + 
			'		<input type="text" class="form-control" id="email" name="email" placeholder="email..."> ' + 
			'	</div> ' + 
			'</form> ';
		return tpl;
	}
	
	return SignupView;
});
