define([ 
         'backbone', 'util', 'MD5'
       ], 
    function(Backbone, util, MD5) {
	var SettingDetaiProfilelView = Backbone.View.extend({
		
		className: 'setting-detail-profile-view',
		
		events: {
			'click .edit-signature': 'editSignature',
			'click .change-logo': 'changeLogo',
			'click .edit-profile': 'editProfile',
			'click .change-password': 'changePassword'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'editSignature', 'changeLogo', 'editProfile', 'changePassword');
			
			//绑定model变化事件
			this.model.bind('change', this.render);
		},
		
		render: function(){
			var user = this.model;
			
			var $profile = $('<div class="profile-container well">');
			$profile.append(BaseInfo(user));
			$profile.append(DetailInfo(user));
			
			$(this.el).html($profile);
			
		    return this;
		},
		
		editSignature: function() {
			var user = this.model;
			var editSignatureSubView = new EditSignatureSubView({
				model: user
			});
			var $subView = $('#edit_signature_sub_view');
			if($subView.length == 0) {
				$('.content-panel').append($(editSignatureSubView.render().el));
			}
			//显示view
			$('#edit_signature_sub_view').modal('toggle');
		},
		
		changeLogo: function() {
			var user = this.model;
			var logoUploadSubView = new LogoUploadSubView({
				model: user
			});
			var $subView = $('#logo_upload_sub_view');
			if($subView.length == 0) {
				$('.content-panel').append($(logoUploadSubView.render().el));
			}
			//显示view
			$('#logo_upload_sub_view').modal('toggle');
		},
		
		editProfile: function() {
			var user = this.model;
			var editProfileSubView = new EditProfileSubView({
				model: user
			});
			var $subView = $('#edit_profile_sub_view');
			if($subView.length == 0) {
				$('.content-panel').append($(editProfileSubView.render().el));
			}
			//显示view
			$('#edit_profile_sub_view').modal('toggle');
		},
		
		changePassword: function() {
			var user = this.model;
			var changePasswordSubView = new ChangePasswordSubView({
				model: user
			});
			var $subView = $('#change_password_sub_view');
			if($subView.length == 0) {
				$('.content-panel').append($(changePasswordSubView.render().el));
			}
			//显示view
			$('#change_password_sub_view').modal('toggle');
		}
	});
	
	var BaseInfo = function(user) {
		var tpl = 
			'<div class="base-info">' + 
			'	<div class="actions">' + 
			'		<a class="edit-signature btn btn-default"> ' + 
			'			<i class="fa fa-paper-plane"></i> Edit Signature' +
			'		</a>' + 
			'		<a class="change-logo btn btn-default"> ' + 
			'			<i class="fa fa-picture-o"></i> Logo' +
			'		</a>' + 
			'		<a class="edit-profile btn btn-default"> ' + 
			'			<i class="fa fa-pencil"></i> Edit profile' +
			'		</a>' + 
			'		<a class="change-password btn btn-default"> ' + 
			'			<i class="fa fa-lock"></i> Change password' +
			'		</a>' + 
			'	</div>' + 
			'	<img class="img-circle" src="'+ util.baseUrl + user.get('logo') +'">' + 
			'	<div class="info">' + 
			'		<h3 class="user">' + user.get('nickname') + '</h3>' + 
	        '		<div class="signature">' + 
			'			<span class="text-color"><i class="fa fa-tag"></i></span> ' + 
	        '			<h4 class="dark-text-color">' + (user.get('signature') != "" ? user.get('signature') : "Say Something :)") + '</h4>' + 
	        '		</div>' +
			'	</div>' +
			'</div>';
		return tpl;
	};
	
	var DetailInfo = function(user) {
		var tpl = 
			'<div class="detail-info">' + 
			'	<div class="detail-item"> ' + 
			'		<label class="control-label">User ID:</label> ' + 
			'		<span class="dark-text-color" id="userid">' + user.get('userid') + '</span> ' + 
			'	</div> ' + 
			'	<div class="detail-item"> ' + 
			'		<label class="control-label">Nickname:</label> ' + 
			'		<span class="dark-text-color" id="nickname">' + user.get('nickname') + '</span> ' + 
			'	</div> ' + 
			'	<div class="detail-item"> ' + 
			'		<label class="control-label">Real Name:</label> ' + 
			'		<span class="dark-text-color" id="realname">' + user.get('realname') + '</span> ' + 
			'	</div> ' + 
			'	<div class="detail-item"> ' + 
			'		<label class="control-label">Phone:</label> ' + 
			'		<span class="dark-text-color" id="phone">' + user.get('phone') + '</span> ' + 
			'	</div> ' + 
			'	<div class="detail-item"> ' + 
			'		<label class="control-label">Email:</label> ' + 
			'		<span class="dark-text-color" id="email">' + user.get('email') + '</span> ' + 
			'	</div> ' + 
			'	<div class="detail-item"> ' + 
			'		<label class="control-label">Skype:</label> ' + 
			'		<span class="dark-text-color" id="skype">' + user.get('skype') + '</span> ' + 
			'	</div> ' + 
			'	<div class="detail-item"> ' + 
			'		<label class="control-label">WeChat:</label> ' + 
			'		<span class="dark-text-color" id="wechat">' + user.get('wechat') + '</span> ' + 
			'	</div> ' + 
			'	<div class="detail-item"> ' + 
			'		<label class="control-label">User Type:</label> ' + 
			'		<span class="dark-text-color" id="usertype">' + user.get('usertype') + '</span> ' + 
			'	</div> ' + 
			'	<div class="detail-item"> ' + 
			'		<label class="control-label">Major:</label> ' + 
			'		<span class="dark-text-color" id="major">' + user.get('major') + '</span> ' + 
			'	</div> ' + 
			'	<div class="detail-item"> ' + 
			'		<label class="control-label">Department:</label> ' + 
			'		<span class="dark-text-color" id="department">' + user.get('department') + '</span> ' + 
			'	</div> ' + 
			'	<div class="detail-item"> ' + 
			'		<label class="control-label">College:</label> ' + 
			'		<span class="dark-text-color" id="college">' + user.get('college') + '</span> ' + 
			'	</div> ' + 
			'	<div class="detail-item"> ' + 
			'		<label class="control-label">Address:</label> ' + 
			'		<span class="dark-text-color" id="address">' + user.get('address') + '</span> ' + 
			'	</div> ' + 
			'	<div class="detail-item"> ' + 
			'		<label class="control-label">Interests:</label> ' + 
			'		<span class="dark-text-color" id="interests">' + user.get('interests') + '</span> ' + 
			'	</div> ' + 
			'	<div class="detail-item"> ' + 
			'		<label class="control-label">Introduction:</label> ' + 
			'		<span class="dark-text-color" id="introduction">' + user.get('introduction') + '</span> ' + 
			'	</div> ' + 
			'</div>';
		return tpl;
	};
	
	/*
	 * Edit signature sub view
	 * */
	var EditSignatureSubView = Backbone.View.extend({
		
		id: 'edit_signature_sub_view',
		
		className: 'edit-signature-sub-view modal fade',
		
		events: {
			'click .save': 'save'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'save');
		},
		
		render: function(){
			var $modalDialog = $('<div class="modal-dialog" role="document">');
			var $modalDialogContent = $('<div class="modal-content">');
			$modalDialog.append($modalDialogContent);
			
			var header = SigatureModalHeader();
			$modalDialogContent.append(header);
			
			var body = SigatureModalBody();
			$modalDialogContent.append(body);
			
			var footer = SigatureModalFooter();
			$modalDialogContent.append(footer);
			
			$(this.el).append($modalDialog);
			
			//绑定modal事件
			var self = this;
			$(this.el).on('show.bs.modal', function (event) {
				$('#signature_input').val(self.model.get('signature'));
			});
			
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		save: function() {
			this.model.save('signature', $('#signature_input').val(), {
				success: function() {
					$('#edit_signature_sub_view').modal('toggle');
				},
				error: function(model, response, options) {
					var alertMsg = 'Update signature failed. Please try again later!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
					$('#edit_signature_sub_view').modal('toggle');
				}
			});
		}
	});
	
	var SigatureModalHeader = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">Edit Signature</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var SigatureModalFooter = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="submit" class="save btn btn-primary">&nbsp;&nbsp;&nbsp;Save&nbsp;&nbsp;&nbsp;</a> ' + 
			'</div> ';
		return tpl;
	}
	
	var SigatureModalBody = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="signatureAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="signature_input" class="control-label">Signature:</label> ' + 
			'			<input type="text" class="form-control" id="signature_input" name="signature_input" placeholder="say something..."> ' +
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}
	/*
	 * user logo upload sub view
	 * */
	var LogoUploadSubView = Backbone.View.extend({
		
		id: 'logo_upload_sub_view',
		
		className: 'logo-upload-sub-view modal fade',
		
		events: {
			'click .upload-logo': 'upload'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'upload');
		},
		
		render: function(){
			var $modalDialog = $('<div class="modal-dialog" role="document">');
			var $modalDialogContent = $('<div class="modal-content">');
			$modalDialog.append($modalDialogContent);
			
			var header = LogoModalHeader();
			$modalDialogContent.append(header);
			
			var body = LogoModalBody();
			$modalDialogContent.append(body);
			
			var footer = LogoModalFooter();
			$modalDialogContent.append(footer);
			
			$(this.el).append($modalDialog);
			
			//绑定modal消失时出发的事件
			var self = this;
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		//上传file
		upload: function() {
			//当前user model
			var self = this;
			
			//validate
			if(!this.validate()) {
				return;
			}
			
			//创建file model
			var fileDom = document.getElementById("upload_logo_input");
			//因为backbone post请求默认是"application/x-www-form-urlencoded"，所以在这里需要重写上传logo的方法
			var data = new FormData();
			data.append('logo', fileDom.files[0]);
			
			$.ajax({
			    url: self.model.url + '/logo',
			    data: data,
			    cache: false,
			    contentType: false,
			    processData: false,
			    type: 'POST',
			    success: function(data){
			    	alert("Upload complete!");
			    	
			    	//更新user
			    	self.model.set('logo', data.logo);
			    	//更新cookie
			    	util.setUserLogo(data.logo);
			    	//更新left panel
			    	Backbone.trigger('LeftPanelView:updateProfile');
			    	
	    			//隐藏窗口
					$('#logo_upload_sub_view').modal('toggle');
			    },
			    error: function(response){
					var alertMsg = 'Upload logo failed. Please try again later!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
			    	//隐藏窗口
			    	$('#logo_upload_sub_view').modal('toggle');
			    }
			});
		},
		
		//检查logo上传
		validate: function() {
			var maxsize = 1 * 1024 * 1024; //文件大小最大1M
			var emptyMsg = "Please select your upload logo image!";
			var errMsg = "The maxsize of upload file is 1M!";
			var fileTypeMsg = "The file type doesn't support!";
			var tipMsg = "Please use Chrome or Firefox browser to upload file!";
			var ua = window.navigator.userAgent;
			var browserCfg = {};
			if(ua.indexOf("Firefox")>=1){
				browserCfg.firefox = true;
			}else if(ua.indexOf("Chrome")>=1){
				browserCfg.chrome = true;
			}
			
			//检查浏览器类型
			if(!browserCfg.firefox && !browserCfg.chrome ){
		 		alert(tipMsg);
		 		return false;
		 	}
			
			//检查上传文件是否非空
			var file = document.getElementById("upload_logo_input");
		 	if(file.value == ""){
		 		alert(emptyMsg);
		 		return false;
		 	}
		 	
		 	//检查文件类型
		 	var accept_file_type = [
	   	        'image/gif',
	   	        'image/jpeg',
	   	        'image/png'
	           ];
		 	var filetype = file.files[0].type;
		 	var isValid = _.indexOf(accept_file_type, filetype);
		 	if(isValid == -1) {
		 		alert(fileTypeMsg);
		 		return false;
		 	}
	        
		 	//检查文件大小
		 	var filesize = file.files[0].size;
		 	if(filesize > maxsize){
		 		alert(errMsg);
		 		return false;
			}
		 	
		 	return true;
		}
	});
	
	var LogoModalHeader = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">Change Project Logo</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var LogoModalFooter = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="submit" class="upload-logo btn btn-primary">Upload</a> ' + 
			'</div> ';
		return tpl;
	}
	
	var LogoModalBody = function() {
		var accept_file_type = [
	        'image/gif',
	        'image/jpeg',
	        'image/png'
        ];

		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="fileAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="upload_logo_input" class="control-label">File:</label> ' + 
			'			<input id="upload_logo_input" type="file" accept="' + accept_file_type.join(', ') + '"> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label class="control-label">(Max upload logo image size is 1M. Support file type: gif, jpeg, jpg, png)</label> ' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}
	
	/*
	 * Edit profile sub view
	 * */
	var EditProfileSubView = Backbone.View.extend({
		
		id: 'edit_profile_sub_view',
		
		className: 'edit-profile-sub-view modal fade',
		
		events: {
			'click .save': 'save'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'save');
		},
		
		render: function(){
			var $modalDialog = $('<div class="modal-dialog" role="document">');
			var $modalDialogContent = $('<div class="modal-content">');
			$modalDialog.append($modalDialogContent);
			
			var header = ProfileModalHeader();
			$modalDialogContent.append(header);
			
			var body = ProfileModalBody();
			$modalDialogContent.append(body);
			
			var footer = ProfileModalFooter();
			$modalDialogContent.append(footer);
			
			$(this.el).append($modalDialog);
			
			//form validator
			$modalDialog.find('#profileAttribute').bootstrapValidator({
				live: 'enabled',
		        message: 'This value is not valid',
		        feedbackIcons: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },
		        fields: {
		        	nickname_input: {
		                validators: {
		                    notEmpty: {
		                        message: 'The nickname is required'
		                    },
		                    stringLength: {
		                    	max: 30,
		                        message: 'The nickname must be smaller than 30 characters'
		                    }
		                }
		            }
		        }
		    });
			
			//绑定modal事件
			var self = this;
			$(this.el).on('show.bs.modal', function (event) {
				$('#nickname_input').val(self.model.get('nickname'));
				$('#realname_input').val(self.model.get('realname'));
				$('#phone_input').val(self.model.get('phone'));
				$('#email_input').val(self.model.get('email'));
				$('#skype_input').val(self.model.get('skype'));
				$('#wechat_input').val(self.model.get('wechat'));
				$('#major_input').val(self.model.get('major'));
				$('#department_input').val(self.model.get('department'));
				$('#college_input').val(self.model.get('college'));
				$('#address_input').val(self.model.get('address'));
				$('#interests_input').val(self.model.get('interests'));
				$('#introduction_input').val(self.model.get('introduction'));
			});
			
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		save: function() {
			//validate
			$('#profileAttribute').data('bootstrapValidator').validateField('nickname_input');
			if(!$('#profileAttribute').data('bootstrapValidator').isValid()) return;
			
			this.model.set('nickname', $('#nickname_input').val());
			this.model.set('realname', $('#realname_input').val());
			this.model.set('phone', $('#phone_input').val());
			this.model.set('email', $('#email_input').val());
			this.model.set('skype', $('#skype_input').val());
			this.model.set('wechat', $('#wechat_input').val());
			this.model.set('major', $('#major_input').val());
			this.model.set('college', $('#college_input').val());
			this.model.set('address', $('#address_input').val());
			this.model.set('interests', $('#interests_input').val());
			this.model.save('introduction', $('#introduction_input').val(), {
				success: function() {
			    	//更新cookie
			    	util.setUserNickname($('#nickname_input').val());
			    	//更新left panel
			    	Backbone.trigger('LeftPanelView:updateProfile');
			    	
					$('#edit_profile_sub_view').modal('toggle');
				},
				error: function(model, response, options) {
					var alertMsg = 'Update profile failed. Please try again later!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
					$('#edit_profile_sub_view').modal('toggle');
				}
			});
		}
	});
	
	var ProfileModalHeader = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">Edit Profile</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var ProfileModalFooter = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="submit" class="save btn btn-primary">&nbsp;&nbsp;&nbsp;Save&nbsp;&nbsp;&nbsp;</a> ' + 
			'</div> ';
		return tpl;
	}
	
	var ProfileModalBody = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="profileAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="nickname_input" class="control-label">Nickname:</label> ' + 
			'			<input type="text" class="form-control" id="nickname_input" name="nickname_input" placeholder="nickname..."> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="realname_input" class="control-label">Real Name:</label> ' + 
			'			<input type="text" class="form-control" id="realname_input" name="realname_input" placeholder="realname..."> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="phone_input" class="control-label">Phone:</label> ' + 
			'			<input type="text" class="form-control" id="phone_input" name="phone_input" placeholder="phone..."> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="email_input" class="control-label">Email:</label> ' + 
			'			<input type="text" class="form-control" id="email_input" name="email_input" placeholder="email..."> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="skype_input" class="control-label">Skype:</label> ' + 
			'			<input type="text" class="form-control" id="skype_input" name="skype_input" placeholder="skype..."> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="wechat_input" class="control-label">WeChat:</label> ' + 
			'			<input type="text" class="form-control" id="wechat_input" name="wechat_input" placeholder="wechat..."> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="major_input" class="control-label">Major:</label> ' + 
			'			<input type="text" class="form-control" id="major_input" name="major_input" placeholder="major..."> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="department_input" class="control-label">Department:</label> ' + 
			'			<input type="text" class="form-control" id="department_input" name="department_input" placeholder="department..."> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="college_input" class="control-label">College:</label> ' + 
			'			<input type="text" class="form-control" id="college_input" name="college_input" placeholder="college..."> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="address_input" class="control-label">Address:</label> ' + 
			'			<input type="text" class="form-control" id="address_input" name="address_input" placeholder="address..."> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="interests_input" class="control-label">Interests:</label> ' + 
			'			<input type="text" class="form-control" id="interests_input" name="interests_input" placeholder="interests..."> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="introduction_input" class="control-label">Introduction:</label> ' + 
			'			<textarea class="form-control" id="introduction_input" name="introduction_input" placeholder="self Introduction..."></textarea>' +
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}
	
	/*
	 * Change password sub view
	 * */
	var ChangePasswordSubView = Backbone.View.extend({
		
		id: 'change_password_sub_view',
		
		className: 'change-password-sub-view modal fade',
		
		events: {
			'click .save': 'save'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'save');
		},
		
		render: function(){
			var $modalDialog = $('<div class="modal-dialog" role="document">');
			var $modalDialogContent = $('<div class="modal-content">');
			$modalDialog.append($modalDialogContent);
			
			var header = PasswordModalHeader();
			$modalDialogContent.append(header);
			
			var body = PasswordModalBody();
			$modalDialogContent.append(body);
			
			var footer = PasswordModalFooter();
			$modalDialogContent.append(footer);
			
			$(this.el).append($modalDialog);
			
			//form validator
			$modalDialog.find('#passwordAttribute').bootstrapValidator({
				live: 'enabled',
		        message: 'This value is not valid',
		        feedbackIcons: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },
		        fields: {
		        	old_pwd_input: {
		                validators: {
		                    notEmpty: {
		                        message: 'The old password is required'
		                    }
		                }
		            },
		            new_pwd_input: {
		                validators: {
		                    notEmpty: {
		                        message: 'The new password is required'
		                    },
		                    identical: {
		                        field: 'new_pwd_again_input',
		                        message: 'The password twice input are not the same'
		                    },
		                    stringLength: {
		                    	min: 6,
		                        message: 'The password must be larger than 6 characters'
		                    }
		                }
		            },
		            new_pwd_again_input: {
		                validators: {
		                    notEmpty: {
		                        message: 'The new password is required'
		                    },
		                    identical: {
		                        field: 'new_pwd_input',
		                        message: 'The password twice input are not the same'
		                    }
		                }
		            }
		        }
		    });
			
			//绑定modal事件
			var self = this;
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		save: function() {
			//validate
			$('#passwordAttribute').data('bootstrapValidator').validateField('old_pwd_input');
			$('#passwordAttribute').data('bootstrapValidator').validateField('new_pwd_input');
			$('#passwordAttribute').data('bootstrapValidator').validateField('new_pwd_again_input');
			if(!$('#passwordAttribute').data('bootstrapValidator').isValid()) return;
			
			var data = {};
			data.userid = util.currentUser();
			data.oldpassword = md5($('#old_pwd_input').val());
			data.newpassword = md5($('#new_pwd_input').val());
			
			$.ajax({
			    url: util.baseUrl + '/api/auth/password',
			    data: data,
			    type: 'POST',
			    success: function(result){
			    	if(result.ret == 0) {
			    		alert("Change password successful!");
			    	}else{
			    		alert(result.msg);
			    	}
			    	$('#change_password_sub_view').modal('toggle');
			    },
			    error: function(response) {
					var alertMsg = 'Change password failed. Please try again later!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
					$('#change_password_sub_view').modal('toggle');
				}
			});
		}
	});
	
	var PasswordModalHeader = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">Chagne Password</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var PasswordModalFooter = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="submit" class="save btn btn-primary">&nbsp;&nbsp;&nbsp;Save&nbsp;&nbsp;&nbsp;</a> ' + 
			'</div> ';
		return tpl;
	}
	
	var PasswordModalBody = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="passwordAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="old_pwd_input" class="control-label">Old Password:</label> ' + 
			'			<input type="password" class="form-control" id="old_pwd_input" name="old_pwd_input" placeholder="Old password..."> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="new_pwd_input" class="control-label">New Password:</label> ' + 
			'			<input type="password" class="form-control" id="new_pwd_input" name="new_pwd_input" placeholder="New password..."> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="new_pwd_again_input" class="control-label">New Password Again:</label> ' + 
			'			<input type="password" class="form-control" id="new_pwd_again_input" name="new_pwd_again_input" placeholder="New password again..."> ' +
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}
	
	return SettingDetaiProfilelView;
});