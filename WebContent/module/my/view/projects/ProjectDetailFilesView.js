define([ 
         'backbone', 'util',
         //view
         'view/projects/ProjectDetailFileItemView',
         //model
         'model/project/FileModel'
       ], 
    function(Backbone, util, ProjectDetailFileItemView, FileModel) {
	var ProjectDetailFilesView = Backbone.View.extend({
		
		className: 'project-detail-files-view',
		
		events: {
			'click .upload': 'upload'
		},
		
		initialize: function(){
			//确保在正确作用域
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
				'	<i class="fa fa-cloud-upload"></i>' + 
				'		Upload file ' + 
				'</div>';
			$action.append(uploads_tpl);
		  
			
			var $files = $('<div class="files-container">');
			$files.append('<div class="placeholder"><h4>No files...</h4></div>');
			
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
			$filesContainer.prepend(FileItem(file));
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
			files.create(file, {
				 wait: true, 
				 success: function() {
					 
				 }, 
				 error: function() {
					 alert('Upload file failed. Please try again later!');
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
				error: function() {
					alert('Delete file failed. Please try again later!');
				}
			});
		}
	});
	
	var FileItem = function(file) {
		var creator = file.get('creator');
		var file_tpl = 
			'<div class="file attachment well">' + 
			'	<div class="preview">' + 
			'		<div class="extension"></div>' +
			'		<div class="overlay">' + 
			'			<div class="top">' +
			'				<span class="time">' + util.timeformat(new Date(file.get('createtime')), "smart") + '</span>' + 
			'				<a class="delete"><i class="fa fa-trash-o"></i></a>'+	
			'			</div>' +
			'			<div class="action">' +
			'				<a class="btn btn-default btn-long" href="' + util.baseUrl + file.get('url') + '" target="_blank">Download file</a>' + 
			'			</div>' +
			'		</div>' +
			'	</div>' +
			'	<div class="footer">' + 
			'		<a class="filename truncate" title="' + file.get('filename') + '">' + file.get('filename') + '</a>' + 
			'		<a class="filedescription truncate" title="' + file.get('description') + '">' + file.get('description') + '</a>' + 
			'		<div class="user">' + 
		    '			<img class="img-circle" title="' + creator.nickname + '" src="' + util.baseUrl + creator.logo + '">' +
		    '			<div class="name truncate">' + creator.nickname + '</div>' +
		    '		</div>' + 
			'	</div>' + 
			'</div>';
		
		return file_tpl;
	};
	
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
			file.set('title', $('#milestone_title').val());
			file.set('description', $('#milestone_description').val());
			file.set('creator', util.currentUserProfile());
			
			//触发全局事件
			Backbone.trigger('ProjectDetailFilesView:uploadFile', file);
			
			//隐藏窗口
			$('#upload_sub_view').modal('toggle');
		},
		
		//检查文件上传
		validate: function() {
			var maxsize = 2 * 1024 * 1024;// 文件大小最大500M
			var emptyMsg = "Please select your upload file!";
			var errMsg = "The maxsize of upload file is 500M!";
			var tipMsg = "Please use Chrome or Firefox browser to upload file!";
			var ua = window.navigator.userAgent;
			browserCfg = {};
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
	        //上次修改时间  
	        console.log(file.files[0].lastModifiedDate);  
	        //名称  
	        console.log(file.files[0].name);  
	        //大小 字节  
	        console.log(file.files[0].size);  
	        //类型  
	        console.log(file.files[0].type);
	        
	        console.log(file.files[0]);  
	        
		    return false;
		    
		 	if(file.value == ""){
		 		alert(emptyMsg);
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
			'	<h3 class="modal-title">Upload File</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var Footer = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="submit" class="upload-file btn btn-primary">Upload</a> ' + 
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
			'			<input id="upload_file_input" type="file" accept="' + accept_file_type.join(', ') + '"> ' +
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}
	
	return ProjectDetailFilesView;
});