define([ 
         'backbone', 'util', 'i18n!../../../../nls/translation'
       ], 
    function(Backbone, util, i18n) {
	var PersonItemView = Backbone.View.extend({
		
		className: 'person-item-view',
		
		events: {
			'click .view-profile': 'viewPersonDetail'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'viewPersonDetail');
		},
		
		render: function(){
			//set item cid
			$(this.el).attr('cid', this.model.cid);
			
			var personItem = Item(this.model);
			$(this.el).append(personItem);
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		viewPersonDetail: function() {
			var person = this.model;
			var searchPersonDetailSubView = new SearchPersonDetailSubView({
				model: person
			});
			var $subView = $('#search_person_detail_sub_view');
			if($subView.length == 0) {
				$('.content-panel').append($(searchPersonDetailSubView.render().el));
			}
			//显示view
			$('#search_person_detail_sub_view').modal('toggle');
		}
	});
	
	var Item = function(person) {
		var $tpl = 
			'<div class="person-action">' + 
			'	<a class="view-profile btn btn-default">' + i18n.my.search.PersonItemView.DETAIL + '</a>' + 
			'</div>' + 
        	'<div class="person-photo"> ' +
        	'	<img class="img-circle" src="' + util.baseUrl + person.get('logo') + '"> ' +
        	'</div> ' +
		    '<div class="person-info"> ' +
		    '   <h4> ' +
		    '       <span class="center">' + person.get('nickname') + '</span> ' +
		    '   </h4> ' +
		    '   <div class="signature" title="' + person.get('signature') + '"> ' + person.get('signature') + ' </div> ' +
		    '</div> ';
		return $tpl;
	};
	
	/*
	 * search person detail sub view
	 * */
	var SearchPersonDetailSubView = Backbone.View.extend({
		
		id: 'search_person_detail_sub_view',
		
		className: 'search-person-detail-sub-view modal fade',
		
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
			
			var body = Body();
			$modalDialogContent.append(body);
			
			var footer = Footer();
			$modalDialogContent.append(footer);
			
			$(this.el).append($modalDialog);
			
			//绑定modal消失时出发的事件
			var self = this;
			
			$(this.el).on('show.bs.modal', function (event) {
				//get person detail info
				self.model.fetch({
					wait: true,
					success: function() {
						generateDetailedInfo(self.model);
					},
					error: function(model, response, options) {
						var alertMsg = i18n.my.search.PersonItemView.FETCH_PERSON_FAILED;
						util.commonErrorHandler(response.responseJSON, alertMsg);
					}
				});
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
			'	<h3 class="modal-title">' + i18n.my.search.PersonItemView.PERSON_DETAIL_INFO + '</h3> ' + 
			'</div>';
		return tpl;
	};
	
	var Footer = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="button" class="btn btn-primary" data-dismiss="modal">' + i18n.my.search.PersonItemView.OK + '</a> ' + 
			'</div> ';
		return tpl;
	};
	
	var Body = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="personAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<img id="person_logo" class="img-circle">' + 
			'			<div class="person-info">' + 
			'				<h4>' + 
			'					<span id="person_nickname" class="center"></span>' + 
			'					(<span id="person_userid" class="center"></span>)' + 
			'				</h4>' +
			'				<div id="person_signature" class="signature" title=""></div>' +
			'			</div>' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	};
	
	var generateDetailedInfo = function(person) {
		//basic info
		$('#person_logo').attr('src', util.baseUrl + person.get('logo'));
		$('#person_nickname').html(person.get('nickname'));
		$('#person_userid').html(person.get('userid'));
		$('#person_signature').html(person.get('signature')!=''?person.get('signature'):i18n.my.search.PersonItemView.DETAIL_SIGNATURE_EMPTY);
		
		//根据email的属性来判断用户信息是否对外公开,具体判断逻辑在java代码中
		var privacy_flag = (person.has('email') && person.get('email') != '') ? true : false;
		var detailed_tpl = '';
		if(privacy_flag) {
			detailed_tpl = 
				'<div class="form-group"> ' + 
				'	<label for="person_realname" class="control-label">' + i18n.my.search.PersonItemView.DETAIL_REALNAME + '</label>' + 
				'	<input type="text" class="form-control" id="person_realname" name="person_realname" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_phone" class="control-label">' + i18n.my.search.PersonItemView.DETAIL_PHONE + '</label>' + 
				'	<input type="text" class="form-control" id="person_phone" name="person_phone" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_email" class="control-label">' + i18n.my.search.PersonItemView.DETAIL_EMAIL + '</label>' + 
				'	<input type="text" class="form-control" id="person_email" name="person_email" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_skype" class="control-label">' + i18n.my.search.PersonItemView.DETAIL_SKYPE + '</label>' + 
				'	<input type="text" class="form-control" id="person_skype" name="person_skype" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_wechat" class="control-label">' + i18n.my.search.PersonItemView.DETAIL_WECHAT + '</label>' + 
				'	<input type="text" class="form-control" id="person_wechat" name="person_wechat" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_major" class="control-label">' + i18n.my.search.PersonItemView.DETAIL_MAJOR + '</label>' + 
				'	<input type="text" class="form-control" id="person_major" name="person_major" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_department" class="control-label">' + i18n.my.search.PersonItemView.DETAIL_DEPARTMENT + '</label>' + 
				'	<input type="text" class="form-control" id="person_department" name="person_department" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_college" class="control-label">' + i18n.my.search.PersonItemView.DETAIL_COLLEGE + '</label>' + 
				'	<input type="text" class="form-control" id="person_college" name="person_college" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_address" class="control-label">' + i18n.my.search.PersonItemView.DETAIL_ADDRESS + '</label>' + 
				'	<input type="text" class="form-control" id="person_address" name="person_address" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_interests" class="control-label">' + i18n.my.search.PersonItemView.DETAIL_INTERESTS + '</label>' + 
				'	<input type="text" class="form-control" id="person_address" name="person_address" disabled> ' + 
				'</div> ' + 
				'<div class="form-group"> ' + 
				'	<label for="person_introduction" class="control-label">' + i18n.my.search.PersonItemView.DETAIL_INTRODUCTION + '</label>' + 
				'	<textarea class="form-control" id="person_introduction" name="person_introduction" disabled></textarea> ' + 
				'</div> ';
		}else{
			detailed_tpl = 
				'<div class="form-group"> ' + 
				'	<label class="control-label">' + i18n.my.search.PersonItemView.DETAIL_PRIVACY_TIPS + '</label>' + 
				'</div> ';
		}
		$('#personAttribute').append(detailed_tpl);
		if(privacy_flag) {
			$('#person_realname').val(person.get('realname'));
			$('#person_phone').val(person.get('phone'));
			$('#person_email').val(person.get('email'));
			$('#person_skype').val(person.get('skype'));
			$('#person_wechat').val(person.get('wechat'));
			$('#person_major').val(person.get('major'));
			$('#person_department').val(person.get('department'));
			$('#person_college').val(person.get('college'));
			$('#person_address').val(person.get('address'));
			$('#person_interests').val(person.get('interests'));
			$('#person_introduction').val(person.get('introduction'));
		}
	};
	
	return PersonItemView;
});