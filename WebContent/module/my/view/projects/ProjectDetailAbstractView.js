define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation'
       ], 
    function(Backbone, util, i18n) {
	var ProjectDetailAbstractView = Backbone.View.extend({
		
		className: 'project-detail-abstract-view',
		
		events: {
			'click .edit-btn': 'editAbstract'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'editAbstract');
			
			//绑定model变化事件
			this.model.bind('change:abstractContent', this.render);
		},
		
		render: function(){
			var project = this.model;
			
			var $abstract = $('<div class="abstract-container well">');
			if(project.get('abstractContent') == "") {
				$abstract.append('<div class="placeholder"><h4>' + i18n.my.projects.ProjectDetailAbstractView.NO_ABSTRACT + '</h4></div>');
			}else{
				$abstract.append('<p>' + project.get('abstractContent') + '</p>');
			}
			
			var $actions = $('<div class="action">');
			$actions.append('<div class="edit-btn btn btn-default"><i class="fa fa-pencil"></i>' + i18n.my.projects.ProjectDetailAbstractView.EDIT_ABSTRACT + '</div>');
			
			$(this.el).append($abstract);
			$(this.el).append($actions);
			
		    return this;
		},
		
		editAbstract: function() {
			var project = this.model;
			var editAbstractSubView = new EditAbstractSubView({
				model: project
			});
			var $subView = $('#edit_abstract_sub_view');
			if($subView.length == 0) {
				$('.content-panel').append($(editAbstractSubView.render().el));
			}
			//显示view
			$('#edit_abstract_sub_view').modal('toggle');
		}
	});
	
	/***********************************************************************************/
	/*
	 * subview - edit abstract view
	 * */
	var EditAbstractSubView = Backbone.View.extend({
		
		id: 'edit_abstract_sub_view',
		
		className: 'edit-abstract-sub-view modal fade',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'save');
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
			
			//confirm self body
			var self = this;
			
			//设置abstract
			var project = this.model;
			$('.abstract-area', this.el).val(project.get('abstractContent'));
			
			//save操作
			$('.save', $modalDialogContent).on('click', function() {
				self.save();
			});
			
			//绑定modal消失时出发的事件
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		save: function() {
			var project = this.model;
			var content = $('.abstract-area').val();
			if(content == "") {
				alert(i18n.my.projects.ProjectDetailAbstractView.EDIT_ABSTRACT_TIPS);
				return;
			}
			
			//如果内容有不同才会发送请求来修改
			if(project.get('abstractContent') != content) {
				project.save('abstractContent', content, {
					wait: true,
					error: function(model, response, options) {
						var alertMsg = i18n.my.projects.ProjectDetailAbstractView.UPDATE_ABSTRACT_ERROR;
						util.commonErrorHandler(response.responseJSON, alertMsg);
					}
				});
			}
			$('#edit_abstract_sub_view').modal('toggle');
		}
	});
	
	var Header = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">' +  i18n.my.projects.ProjectDetailAbstractView.MODIFY_ABSTRACT_TITLE + '</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var Footer = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="button" class="cancel btn btn-default" data-dismiss="modal">' +  i18n.my.projects.ProjectDetailAbstractView.CANCEL + '</a> ' + 
			'	<a type="submit" class="save btn btn-primary">' +  i18n.my.projects.ProjectDetailAbstractView.SAVE + '</a> ' + 
			'</div> ';
		return tpl;
	}
	
	var Body = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<div class="abstract-container well">' +
			'		<textarea class="abstract-area form-control" rows="5"></textarea>' + 
			'	</div> ' + 
			'</div> ';
		return tpl;
	}
	
	return ProjectDetailAbstractView;
});