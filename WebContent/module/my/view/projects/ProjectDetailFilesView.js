define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation',
         //view
         'view/projects/ProjectDetailFileItemView',
         //model
         'model/project/FileModel'
       ], 
    function(Backbone, util, i18n, ProjectDetailFileItemView, FileModel) {
	var ProjectDetailFilesView = Backbone.View.extend({
		
		className: 'project-detail-files-view',
		
		events: {
			'click .upload': 'upload'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addFileItem', 'removeFileItem', 'uploadFile', 'deleteFile', 'upload');
			
			//注册全局事件
			Backbone.
				off('ProjectDetailFilesView:uploadFile').
				on('ProjectDetailFilesView:uploadFile', this.uploadFile, this);
			Backbone.
				off('ProjectDetailFilesView:deleteFile').
				on('ProjectDetailFilesView:deleteFile', this.deleteFile, this);
			
			//监听model变化
			this.model.bind('add', this.addFileItem);
			this.model.bind('remove', this.removeFileItem);
		},
		
		render: function(){
			var $action = $('<div class="action">');
			var uploads_tpl = 
				'<div class="btn btn-default upload" style="position: relative;">' + 
				'	<i class="fa fa-cloud-upload"></i>' + i18n.my.projects.ProjectDetailFilesView.UPLOAD_FILE + 
				'</div>';
			$action.append(uploads_tpl);
		  
			
			var $files = $('<div class="files-container">');
			$files.append('<div class="placeholder"><h4>' + i18n.my.projects.ProjectDetailFilesView.NO_FILES + '</h4></div>');
			
			$(this.el).append($action);
			$(this.el).append($files);
			
		    return this;
		},
		
		/*
		 * 向files集合中添加file
		 * */
		addFileItem: function(file) {
			var $filesContainer = $(this.el).find('.files-container');
			var $placeholder = $filesContainer.find('.placeholder');
			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			
			var projectDetailFileItemView = new ProjectDetailFileItemView({
				model: file
			});
			
			$filesContainer.prepend($(projectDetailFileItemView.render().el));
			//保持scrollY在最上
			$('.project-content').scrollTop( 0 );
		},
		
		/*
		 * 从milestone集合中删除milestone
		 * */
		removeFileItem: function(file) {
			_.each($('.file[cid]', this.el), function(element, index, list){ 
				if($(element).attr('cid') == file.cid) {
					$(element).fadeOut();
					$(element).remove();
				}
			});
			
			//if list is empty, then add placeholder 
			if($('.file[cid]', this.el).length == 0) {
				$('.files-container', this.el).append('<div class="placeholder"><h4>' + i18n.my.projects.ProjectDetailFilesView.NO_FILES + '</h4></div>');
			}
		},
		
		/*
		 * 点击上传file按钮事件
		 * */
		upload: function() {
			var files = this.model;
			var uploadSubView = new UploadSubView({
				model: files
			});
			var $subView = $('#upload_sub_view');
			if($subView.length == 0) {
				$('.content-panel').append($(uploadSubView.render().el));
			}
			//显示view
			$('#upload_sub_view').modal('toggle');
		},
		
		/*
		 * 上传file
		 * */
		uploadFile: function(file) {
			var files = this.model;
			//因为backbone create默认是发送"application/x-www-form-urlencoded"请求，所以在这里需要重写上传文件的方法
			var data = new FormData();
			data.append('creator[userid]', file.get('creator').userid);  //创建者id
			data.append('description', file.get('description')); 		 //文件描述
			data.append('attachment', file.get('attachment'));	 		 //上传文件
			data.append('filesize', file.get('filesize'));	 		     //上传文件大小
			data.append('filetype', file.get('filetype'));	 		     //上传文件类型
			data.append('filename', file.get('filename'));	 		     //上传文件文件名
			
			$.ajax({
			    url: files.url,
			    data: data,
			    cache: false,
			    contentType: false,
			    processData: false,
			    type: 'POST',
			    success: function(){
			    	alert(i18n.my.projects.ProjectDetailFilesView.UPLOAD_COMPLETE);
			    	
			    	//更新整个file集合(先删除之前，然后再获取新的)
			    	_.each($('.file[cid]'), function(dom, index) {
						var cid = $(dom).attr('cid');
						files.remove(cid);
			    	});
			    	
			    	files.fetch({
			    		wait: true,
			    		success: function() {
			    			//隐藏窗口
							$('#upload_sub_view').modal('toggle');
			    		},
				    	error: function(model, response, options) {
				    		var alertMsg = i18n.my.projects.ProjectDetailFilesView.FETCH_FILES_ERROR;
							util.commonErrorHandler(response.responseJSON, alertMsg);
			    			//隐藏窗口
							$('#upload_sub_view').modal('toggle');
			    		}
			    	});
			    },
			    error: function(response){
			    	var alertMsg = i18n.my.projects.ProjectDetailFilesView.UPLOAD_FILE_ERROR;
					util.commonErrorHandler(response.responseJSON, alertMsg);
			    	//隐藏窗口
			    	$('#upload_sub_view').modal('toggle');
			    }
			});
		},
		
		/*
		 * 删除file
		 * */
		deleteFile: function(file) {
			var files = this.model;
			files.get(file.cid).destroy({
				wait: true, 
				success: function() {
					//从list中删除file
					files.remove(file);
				},
				error: function(model, response, options) {
					var alertMsg = i18n.my.projects.ProjectDetailFilesView.DELETE_FILE_ERROR;
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
		}
	});
	
	/*
	 * File upload sub view
	 * */
	var UploadSubView = Backbone.View.extend({
		
		id: 'upload_sub_view',
		
		className: 'upload-sub-view modal fade',
		
		events: {
			'click .upload-file': 'upload'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'upload');
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
			//validate
			if(!this.validate()) {
				return;
			}
			
			//创建file model
			var fileDom = document.getElementById("upload_file_input");
			var filesize = fileDom.files[0].size,
		 		filetype = fileDom.files[0].type,
		 		filename = fileDom.files[0].name,
		 		filelastmodified = fileDom.files[0].lastModified;
			
			var file = new FileModel();
			file.set('creator', util.currentUserProfile());
			file.set('attachment', fileDom.files[0]);
			file.set('description', $('#file_description').val());
			file.set('filesize', filesize);
			file.set('filetype', filetype);
			file.set('filename', filename);
			
			//触发全局事件
			Backbone.trigger('ProjectDetailFilesView:uploadFile', file);
		},
		
		//检查文件上传
		validate: function() {
			var maxsize = 50 * 1024 * 1024; //文件大小最大50M
			var emptyMsg = i18n.my.projects.ProjectDetailFilesView.CHECK_EMPTY_MSG;
			var errMsg = i18n.my.projects.ProjectDetailFilesView.CHECK_MAX_SIZE_MSG;
			var fileTypeMsg = i18n.my.projects.ProjectDetailFilesView.CHECK_FILE_TYPE_MSG;
			var tipMsg = i18n.my.projects.ProjectDetailFilesView.CHECK_BROWSER_MSG;
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
			var file = document.getElementById("upload_file_input");
		 	if(file.value == ""){
		 		alert(emptyMsg);
		 		return false;
		 	}
		 	
		 	//检查文件类型
		 	var accept_file_type = [
	   	        'application/msword',
	   	        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	   	        'application/pdf',
	   	        'application/vnd.ms-exce',
	   	        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	   	        'application/vnd.ms-powerpoint',
	   	        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	   	        'application/zip',
	   	        'application/x-rar',
	   	        'text/plain',
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
	
	var Header = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">' + i18n.my.projects.ProjectDetailFilesView.UPLOAD_TITLE + '</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var Footer = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="submit" class="upload-file btn btn-primary">' + i18n.my.projects.ProjectDetailFilesView.UPLOAD + '</a> ' + 
			'</div> ';
		return tpl;
	}
	
	var Body = function() {
		var accept_file_type = [
	        'application/msword',
	        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	        'application/pdf',
	        'application/vnd.ms-exce',
	        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	        'application/vnd.ms-powerpoint',
	        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	        'application/zip',
	        'application/x-rar-compressed',
	        'text/plain',
	        'image/gif',
	        'image/jpeg',
	        'image/png'
        ];

		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="fileAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="upload_file_input" class="control-label">' + i18n.my.projects.ProjectDetailFilesView.FILE + '</label> ' + 
			'			<input id="upload_file_input" type="file" accept="' + accept_file_type.join(', ') + '"> ' +
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label class="control-label">' + i18n.my.projects.ProjectDetailFilesView.UPLOAD_TIPS + '</label> ' + 
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="file_description" class="control-label">' + i18n.my.projects.ProjectDetailFilesView.DESCRIPTION + '</label> ' + 
			'			<textarea class="form-control" id="file_description" name="file_description" placeholder="' + i18n.my.projects.ProjectDetailFilesView.DESCRIPTION_HOLDER + '"></textarea> ' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}
	
	return ProjectDetailFilesView;
});