define([ 'backbone' ], function(Backbone) {

	var SigninView = Backbone.View.extend({
		tagName: 'div',
		
		className: 'login',
		
		initialize: function(){
			
		},
		
		render: function(){
			var $username = $('<div class="input-group">');
			$username.append($('<span class="input-group-addon">'));
			$username.find('.input-group-addon').append('<span class="glyphicon glyphicon-user">');
			$username.append('<input class="form-control valid ng-dirty ng-valid ng-valid-required" type="text" placeholder="please enter your username">');

			var $pwd = $('<div class="input-group">');
			$pwd.append($('<span class="input-group-addon">'));
			$pwd.find('.input-group-addon').append('<i class="glyphicon glyphicon-lock">');
			$pwd.append('<input class="form-control ng-valid-minlength valid ng-dirty ng-valid ng-valid-required" type="password" placeholder="please enter your password" required="" ng-minlength="6">');
			
			var $signin = $('<div class="actions">');
			$signin.append($('<input class="btn btn-primary" type="button" value="Sign In">'));
			
			$(this.el).append($username);
			$(this.el).append($pwd);
			$(this.el).append($signin);
			
			return this;
		}
	});
	
	return SigninView;
});
