define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var ProjectDetailFilesView = Backbone.View.extend({
		
		className: 'project-detail-files-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addFile');
			
			//监听model变化
			this.model.bind('add', this.addFile);
		},
		
		render: function(){
			var $action = $('<div class="action">');
			var uploads_tpl = 
				'<div class="btn btn-default upload" file-select="uploadAttachment($file)" style="position: relative;">' + 
				'	<i class="fa fa-cloud-upload"></i>' + 
				'		Upload file ' + 
				'	<input type="file">' +
				'</div>';
			$action.append(uploads_tpl);
		  
			
			var $files = $('<div class="files-container">');
			$files.append('<div class="placeholder"><h4>No files...</h4></div>');
			
			$(this.el).append($action);
			$(this.el).append($files);
			
		    return this;
		},
		
		/*
		 * 向files集合中添加file所触发的事件
		 * */
		addFile: function(file) {
			var $filesContainer = $(this.el).find('.files-container');
			var $placeholder = $filesContainer.find('.placeholder');
			if($placeholder.length > 0) {
				$placeholder.remove();
			}
			$filesContainer.append(FileItem(file));
		}
	});
	
	var FileItem = function(file) {
		var creator = file.get('creator');
		var file_tpl = 
			'<div class="attachment well">' + 
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
	
	var emptyStatus = function() {
		var empty_tpl = 
			'<div class="empty-state">' +
		    '	<i class="fa fa-folder-open-o"></i>' +
		    '	<p>Looks like this project has no files</p>' +
			'</div>';
		 
		return empty_tpl;
	}
	
	return ProjectDetailFilesView;
});