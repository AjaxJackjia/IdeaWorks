define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation',
         //model
         'model/advice/AdviceModel'
       ], 
    function(Backbone, util, i18n, AdviceModel) {
	var AdviceView = Backbone.View.extend({
		
		id: 'advice_view',
		
		className: 'advice-view  modal fade',
		
		events: {
			'click .modal-footer > .btn-primary': 'feedback'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'feedback');
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
			
			//form validator
			$modalDialog.find('#adviceAttribute').bootstrapValidator({
				live: 'enabled',
		        message: 'This value is not valid',
		        feedbackIcons: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },
		        fields: {
		        	advice_content: {
		                validators: {
		                    notEmpty: {
		                        message: i18n.my.advice.CHECK_NOT_EMPTY
		                    },
		                    stringLength: {
		                    	max: 300,
		                        message: i18n.my.advice.CHECK_LENGTH
		                    }
		                }
		            }
		        }
		    });
			
			$(this.el).on('hide.bs.modal', function (event) {
				//清空modal
				$(this).find('#advice_content').val("");
				$('#adviceAttribute').data('bootstrapValidator').resetForm();
			});
			
			return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		feedback: function() {
			//check param
			$('#adviceAttribute').data('bootstrapValidator').validateField('advice_content');
			if(!$('#adviceAttribute').data('bootstrapValidator').isValid()) return;
			
			//修改project
			var advice = new AdviceModel();
			advice.set('userid', util.currentUser());
			advice.save('advice', $('#advice_content').val(), {
				wait: true,
				success: function() {
					$('#advice_view').modal('toggle');
					alert(i18n.my.advice.ADVICE_THANKYOU);
				},
				error: function(model, response, options) {
					var alertMsg = i18n.my.advice.FEEDBACK_EEROR;
					util.commonErrorHandler(response.responseJSON, alertMsg);
					$('#advice_view').modal('toggle');
				}
			});
		}
	});
	
	var Header = function() {
		var tpl =
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">' + i18n.my.advice.ADVICE_TITLE + '</h3> ' + 
			'</div>';
		return tpl;
	};
	
	var Body = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="adviceAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<textarea class="form-control" id="advice_content" name="advice_content" placeholder="' + i18n.my.advice.ADVICE_CONTENT_TITLE + '"></textarea> ' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	};
	
	var Footer = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="button" class="btn btn-default" data-dismiss="modal">' + i18n.my.advice.CANCEL + '</a> ' + 
			'	<a type="submit" class="btn btn-primary">' + i18n.my.advice.CONFIRM + '</a> ' + 
			'</div> ';
		return tpl;
	}
	
	return AdviceView;
});