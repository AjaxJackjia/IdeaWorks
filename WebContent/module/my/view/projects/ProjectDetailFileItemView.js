define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation'
       ], 
    function(Backbone, util, i18n) {
	var ProjectDetailFileItemView = Backbone.View.extend({
		
		className: 'file attachment well project-detail-files-item-view',
		
		events: {
			'click .footer': 'showDetail',
			'click .preview .delete': 'deleteFile'
		},
		
		initialize: function(){
			//添加view dom的其他属性
			$(this.el).attr('cid', this.model.cid);
			
			//确保在正确作用域
			_.bindAll(this, 'render', 'showDetail', 'deleteFile');
		},
		
		render: function(){
			var file = this.model;
			var fileItem = FileItem(file);
			$(this.el).append(fileItem);
			
		    return this;
		},
		
		showDetail: function() {
			var file = this.model;
			var fileDetailSubView = new FileDetailSubView({
				model: file
			});
			var $subView = $('#file_detail_sub_view');
			if($subView.length == 0) {
				$('.content-panel').append($(fileDetailSubView.render().el));
			}
			//显示view
			$('#file_detail_sub_view').modal('toggle');
		},
		
		deleteFile: function() {
			if(confirm(i18n.my.projects.ProjectDetailFileItemView.DELETE_FILE_CONFIRM)) {
				var file = this.model;
				Backbone.trigger('ProjectDetailFilesView:deleteFile', file);
			}
		}
	});
	
	var FileItem = function(file) {
		var creator = file.get('creator');
		var file_tpl = 
			'<div class="preview">' + 
			'	<div class="extension"></div>' +
			'	<div class="overlay">' + 
			'		<div class="top">' +
			'			<span class="time">' + util.timeformat(new Date(file.get('createtime')), "smart") + '</span>' + 
			'			<a class="delete" title="' + i18n.my.projects.ProjectDetailFileItemView.DELETE_FILE_TIPS + '"><i class="fa fa-trash-o"></i></a>'+	
			'		</div>' +
			'		<div class="action">' +
			'			<a class="btn btn-default btn-long" href="' + file.get('url') + '" target="_blank">' + i18n.my.projects.ProjectDetailFileItemView.DOWNLOAD_FILE + '</a>' + 
			'		</div>' +
			'	</div>' +
			'</div>' +
			'<div class="footer">' + 
			'	<a class="filename truncate" title="' + file.get('filename') + '">' + file.get('filename') + '</a>' + 
			'	<a class="filedescription truncate" title="' + file.get('description') + '">' + file.get('description') + '</a>' + 
			'	<div class="user">' + 
		    '		<img class="img-circle" title="' + creator.nickname + '" src="' + creator.logo + '">' +
		    '		<div class="name truncate">' + creator.nickname + '</div>' +
		    '	</div>' + 
			'</div>';
		
		return file_tpl;
	};
	
	/*
	 * File detail sub view
	 * */
	var FileDetailSubView = Backbone.View.extend({
		
		id: 'file_detail_sub_view',
		
		className: 'file-detail-sub-view modal fade',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender');
		},
		
		render: function(){
			var $modalDialog = $('<div class="modal-dialog" role="document">');
			var $modalDialogContent = $('<div class="modal-content">');
			$modalDialog.append($modalDialogContent);
			
			var header = Header();
			$modalDialogContent.append(header);
			
			var body = Body(this.model);
			$modalDialogContent.append(body);
			
			var footer = Footer();
			$modalDialogContent.append(footer);
			
			$(this.el).append($modalDialog);
			
			//绑定modal消失时出发的事件
			var self = this;
			
			$(this.el).on('show.bs.modal', function (event) {
				var file = self.model;
				
				var filesize = file.get('filesize');
				var filesizeContent = "";
				if(filesize < 1024) {
					filesizeContent = filesize + "B";
				}else if(filesize < 1024*1024) {
					filesizeContent = (filesize / 1024).toFixed(2) + "KB";
				}else{
					filesizeContent = (filesize / (1024*1024)).toFixed(2) + "MB";
				}
				
				var time = new Date(file.get('createtime'));
				var timeContent = time.getFullYear() + "-" + time.getMonth() + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
				
				var creator = file.get('creator');
				$('#file_title', self.el).val(file.get('filename'));
				$('#file_size', self.el).val(filesizeContent);
				$('#creator', self.el).val(creator.nickname);
				$('#creat_time', self.el).val(timeContent);
				$('#file_description', self.el).val(file.get('description'));
			});
			
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		}
	});
	
	var Header = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">' + i18n.my.projects.ProjectDetailFileItemView.FILE_DETAIL_INFO + '</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var Footer = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="button" class="btn btn-primary" data-dismiss="modal">' + i18n.my.projects.ProjectDetailFileItemView.OK + '</a> ' + 
			'</div> ';
		return tpl;
	}
	
	var Body = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="fileAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="file_title" class="control-label">' + i18n.my.projects.ProjectDetailFileItemView.FILE_NAME + '</label>' + 
			'			<input type="text" class="form-control" id="file_title" name="file_title" disabled> ' + 
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="file_size" class="control-label">' + i18n.my.projects.ProjectDetailFileItemView.FILE_SIZE + '</label>' + 
			'			<input type="text" class="form-control" id="file_size" name="file_size" disabled> ' + 
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="creator" class="control-label">' + i18n.my.projects.ProjectDetailFileItemView.CREATOR + '</label>' + 
			'			<input type="text" class="form-control" id="creator" name="creator" disabled> ' + 
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="creat_time" class="control-label">' + i18n.my.projects.ProjectDetailFileItemView.CREATE_TIME + '</label>' + 
			'			<input type="text" class="form-control" id="creat_time" name="creat_time" disabled> ' + 
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="file_description" class="control-label">' + i18n.my.projects.ProjectDetailFileItemView.DESCRIPTION + '</label>' + 
			'			<textarea class="form-control" id="file_description" name="file_description" disabled></textarea> ' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}
	
	return ProjectDetailFileItemView;
});