define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util) {
	var ProjectDetailFilesView = Backbone.View.extend({
		
		className: 'project-detail-files-view',
		
		initialize: function(){
			_.bindAll(this, 'render');
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
			for(var index = 0;index<10;index++) {
				$files.append(fileItem({ }));
			}
			
			$(this.el).append($action);
			$(this.el).append($files);
			
		    return this;
		}
	});
	
	var fileItem = function(file) {
		var file_tpl = 
			'<div class="attachment well">' + 
			'	<div class="preview">' + 
			'		<div class="extension"></div>' +
			'		<div class="overlay">' + 
			'			<div class="top">' +
			'				<span class="time">a few seconds ago</span>' + 
			'				<a class="delete"><i class="fa fa-trash-o"></i></a>'+	
			'			</div>' +
			'			<div class="action">' +
			'				<a class="btn btn-default btn-long">Download file</a>' + 
			'			</div>' +
			'		</div>' +
			'	</div>' +
			'	<div class="footer">' + 
			'		<a class="filename truncate">test</a>' + 
			'		<div class="user">' + 
		    '			<img class="img-circle" src="http://localhost:8888/IdeaWorks/res/images/my/user/kendall.png">' +
		    '			<div class="name truncate">John Doe</div>' +
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