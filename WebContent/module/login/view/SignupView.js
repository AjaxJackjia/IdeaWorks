define([ 'backbone' ], function(Backbone) {
	
	var SignupView = Backbone.View.extend({
		tagName: 'div',
		
		className: 'signup',
		
		initialize: function(){
			
		},
		
		render: function(){
			var $username = $('<div class="input-group">');
			$username.append($('<span class="input-group-addon">'));
			$username.find('.input-group-addon').append('User Name');
			$username.find('.input-group-addon').append('<span style="color:red;">*</span>');
			$username.append('<input class="form-control valid ng-dirty ng-valid ng-valid-required" type="text" placeholder="user name ...">');

			var $nickname = $('<div class="input-group">');
			$nickname.append($('<span class="input-group-addon">'));
			$nickname.find('.input-group-addon').append('Nick Name');
			$nickname.find('.input-group-addon').append('<span style="color:red;">*</span>');
			$nickname.append('<input class="form-control valid ng-dirty ng-valid ng-valid-required" type="text" placeholder="nick name ...">');
			
			var $pwd = $('<div class="input-group">');
			$pwd.append($('<span class="input-group-addon">'));
			$pwd.find('.input-group-addon').append('Password');
			$pwd.find('.input-group-addon').append('<span style="color:red;">*</span>');
			$pwd.append('<input class="form-control ng-valid-minlength valid ng-dirty ng-valid ng-valid-required" type="password" placeholder="password ..." required="" ng-minlength="6">');
			
			var $pwdagain = $('<div class="input-group">');
			$pwdagain.append($('<span class="input-group-addon">'));
			$pwdagain.find('.input-group-addon').append('Confirm Password');
			$pwdagain.find('.input-group-addon').append('<span style="color:red;">*</span>');
			$pwdagain.append('<input class="form-control ng-valid-minlength valid ng-dirty ng-valid ng-valid-required" type="password" placeholder="confirm password ..." required="" ng-minlength="6">');
			
			var $realname = $('<div class="input-group">');
			$realname.append($('<span class="input-group-addon">'));
			$realname.find('.input-group-addon').append('Real Name');
			$realname.find('.input-group-addon').append('<span style="color:red;">*</span>');
			$realname.append('<input class="form-control valid ng-dirty ng-valid ng-valid-required" type="text" placeholder="real name ...">');
			
			var $usertype = $('<div class="input-group">');
			$usertype.append($('<span class="input-group-addon">'));
			$usertype.find('.input-group-addon').append('User Type');
			$usertype.find('.input-group-addon').append('<span style="color:red;">*</span>');
			$usertype.append('<select class="form-control">');
			$usertype.find('select').append('<option>1</option>');
			$usertype.find('select').append('<option>2</option>');
			$usertype.find('select').append('<option>3</option>');
			$usertype.find('select').append('<option>4</option>');
			
			var $department = $('<div class="input-group">');
			$department.append($('<span class="input-group-addon">'));
			$department.find('.input-group-addon').append('Department');
			$department.append('<select class="form-control">');
			$department.find('select').append('<option>1</option>');
			$department.find('select').append('<option>2</option>');
			$department.find('select').append('<option>3</option>');
			$department.find('select').append('<option>4</option>');
			
			var $id = $('<div class="input-group">');
			$id.append($('<span class="input-group-addon">'));
			$id.find('.input-group-addon').append('Student/Staff ID');
			$id.find('.input-group-addon').append('<span style="color:red;">*</span>');
			$id.append('<input class="form-control valid ng-dirty ng-valid ng-valid-required" type="text" placeholder="please enter your username">');
			
			var $phoneno = $('<div class="input-group">');
			$phoneno.append($('<span class="input-group-addon">'));
			$phoneno.find('.input-group-addon').append('Phone No');
			$phoneno.append('<input class="form-control valid ng-dirty ng-valid ng-valid-required" type="text" placeholder="please enter your username">');
			
			var $email = $('<div class="input-group">');
			$email.append($('<span class="input-group-addon">'));
			$email.find('.input-group-addon').append('Email');
			$email.find('.input-group-addon').append('<span style="color:red;">*</span>');
			$email.append('<input class="form-control valid ng-dirty ng-valid ng-valid-required" type="text" placeholder="please enter your username">');
			
			var $signup = $('<div class="actions">');
			$signup.append($('<input class="btn btn-primary" type="button" value="Sign Up">'));
			
			$(this.el).append($username);
			$(this.el).append($nickname);
			$(this.el).append($pwd);
			$(this.el).append($pwdagain);
			$(this.el).append($realname);
			$(this.el).append($usertype);
			$(this.el).append($department);
			$(this.el).append($id);
			$(this.el).append($phoneno);
			$(this.el).append($email);
			$(this.el).append($signup);
			
			return this;
		}
	});
	
	return SignupView;
});
