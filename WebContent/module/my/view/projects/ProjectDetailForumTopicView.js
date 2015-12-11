define([ 
         'backbone', 'util',
         //view
         'view/projects/ProjectDetailForumTopicMessageView'
       ], 
    function(Backbone, util, ProjectDetailForumTopicMessageView) {
	var ProjectDetailForumTopicView = Backbone.View.extend({
		
		className: 'topic project-detail-forum-topic-view',
		
		events: {
			'click .content>.heading': 'toggle',
			'click .modify-topic': 'modifyTopic',
			'click .delete-topic': 'deleteTopic'
		},
		
		initialize: function(){
			//添加view dom的其他属性
			$(this.el).attr('cid', this.model.cid);
			
			//确保在正确作用域
			_.bindAll(this, 'render', 'toggle', 'modifyTopic', 'deleteTopic');
			
			//监听model变化
			this.model.bind('change', this.render);
			
			//global param
			this.isExpanded = false; 	//控制topic伸缩的标志位
			
			//初始化scrollY
			if($.cookie('scrollY_topic') == null) {
				$.cookie('scrollY_topic', 0);
			}
			
			this.render();
		},
		
		render: function(){
			var topic = this.model;
			
			if(!this.isExpanded) 
			{
				//topic item 未展开
				var topicItem = TopicItemShrink(topic);
				$(this.el).html(topicItem);
				
				//其他topic处于show状态
				$('.add-topic').fadeIn();
				$('.topic[cid!='+ topic.cid +']').fadeIn();
				
				//还原scrollY位置
				$('.project-content').scrollTop( $.cookie('scrollY_topic') );
			}
			else
			{
				//topic item 展开
				var topicItem = TopicItemExpand(topic);
				$(this.el).html(topicItem);
				
				//单独加载topic的discussion模块
				var discussionView = new ProjectDetailForumTopicMessageView({
					model: this.model
				});
				$('.body', this.el).append($(discussionView.el));
				
				//其他topic处于hide状态
				$('.add-topic').hide();
				$('.topic[cid!='+ topic.cid +']').hide();
			}
			
		    return this;
		},
		
		toggle: function() {
			this.isExpanded = !this.isExpanded;
			
			//记录点击topic时的scrollY的位置，以便还原
			if(this.isExpanded) {
				var currentScrollY = $('.project-content').scrollTop();
				$.cookie('scrollY_topic', currentScrollY);
			}
			
			this.render();
		},
		
		modifyTopic: function() {
			var modifyTopicSubView = new ModifyTopicSubView({
				model: this.model
			});
			
			var $modifyView = $('#modify_topic_sub_view');
			if($modifyView.length > 0) {
				$('#modify_topic_sub_view').remove();
			}
			$('.content-panel').append($(modifyTopicSubView.render().el));
			
			//显示view
			$('#modify_topic_sub_view').modal('toggle');
		},
		
		deleteTopic: function() {
			if(confirm('Do you want to delete this topic?')) {
				//触发全局事件
				Backbone.trigger('ProjectDetailForumView:deleteTopic', this.model);
			}
		}
	});
	
	/*
	 * view component html template - topic item shrink view
	 * */
	var TopicItemShrink = function(topic) {
		var creator = topic.get('creator');
		var tpl = 
				'<div class="timeline-icon"> ' +
				'	<i class="fa fa-users"></i> ' +
				'</div> ' +
				'<div class="content"> ' +
				'	<div class="heading"> ' +
				'		<div class="expand-icon" title="show topic detail"><i class="fa fa-angle-down"></i></div>' + 
				'		<span class="create-time">' + util.timeformat(new Date(topic.get('createtime')), "smart") + '</span> ' + 
				'		<img class="create-operator img-circle" title="' + creator.nickname + '" src="' + util.baseUrl + creator.logo + '"> ' +
				'		<div class="title" cid="'+ topic.cid +'" title="'+ topic.get('title') + '">'+ topic.get('title') + '</div> ' +
				'	</div>' +
				'	<div class="body"> ' + 
				'		<div class="short-description" title="'+ topic.get('description') + '">'+ topic.get('description') + '</div> ' +
				'	</div> ' +
				'</div> ';
		
		return tpl;
	};
	
	/*
	 * view component html template - topic item expand view
	 * */
	var TopicItemExpand = function(topic) {
		var creator = topic.get('creator');
		
		var meta_tpl = 
			'<div class="meta-container">' + 
	        '	<img class="creator img-circle" title="' + creator.nickname + '" src="' + util.baseUrl + creator.logo + '">' + 
	        '	<div class="creator-nickname">' + creator.nickname + '</div>' + 
	        '	<div class="create-title"> create this topic at </div>' + 
	        '	<div class="time">' + util.timeformat(new Date(topic.get('createtime')), "smart") + '</div> ' + 
	        '	<div class="topic-action"> ' + 
			'		<a class="modify-topic btn btn-default"> ' + 
			'			<i class="fa fa-pencil"></i> Edit' +
			'		</a>' + 
			'		<a class="delete-topic btn btn-default"> ' + 
			'			<i class="fa fa-trash"></i> Delete' +
			'		</a>' + 
			'	</div> ' + 
	        '</div>';
		
		var description_tpl = 
			'<div class="description-container well">' + 
	        '	<h4 class="heading">Description</h4>' + 
	        '	<div class="description-content">' + topic.get('description') + '</div>' + 
	        '</div>';
		
		var tpl =
			'<div class="timeline-icon"> ' +
			'	<i class="fa fa-users"></i> ' +
			'</div> ' +
			'<div class="content"> ' +
			'	<div class="heading"> ' +
			'		<div class="expand-icon" title="show topic detail"><i class="fa fa-angle-up"></i></div>' + 
			'		<div class="title" cid="'+ topic.cid +'" title="'+ topic.get('title') + '">'+ topic.get('title') + '</div> ' +
			'	</div>' +
			'	<div class="body"> ' + meta_tpl + description_tpl + ' </div> ' +
			'</div> ';
		
		return tpl;
	};
	
	/*
	 * subview - modify topic sub view
	 * */
	var ModifyTopicSubView = Backbone.View.extend({
		
		id: 'modify_topic_sub_view',
		
		className: 'modify-topic-sub-view modal fade',
		
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
			
			var header = Header();
			$modalDialogContent.append(header);
			
			var body = Body();
			$modalDialogContent.append(body);
			
			var footer = Footer();
			$modalDialogContent.append(footer);
			
			$(this.el).append($modalDialog);
			
			//form validator
			$modalDialog.find('#topicAttribute').bootstrapValidator({
				live: 'enabled',
		        message: 'This value is not valid',
		        feedbackIcons: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },
		        fields: {
		        	topic_title: {
		                validators: {
		                    notEmpty: {
		                        message: 'The topic title is required'
		                    }
		                }
		            },
		            topic_description: {
		                validators: {
		                    notEmpty: {
		                        message: 'The topic description is required'
		                    }
		                }
		            }
		        }
		    });
			
			//绑定modal消失时出发的事件
			var self = this;
			
			//bind modal event through jquery
			$(this.el).on('show.bs.modal', function (event) {
				var $dom = $(this);
				
				//将topic basic info 填充到相应区域
				$dom.find('#topic_title').val(self.model.get('title'));
				$dom.find('#topic_description').val(self.model.get('description'));
			});
			
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		//保存milestone修改
		save: function() {
			//validate
			$('#topicAttribute').data('bootstrapValidator').validateField('topic_title');
			$('#topicAttribute').data('bootstrapValidator').validateField('topic_description');
			if(!$('#topicAttribute').data('bootstrapValidator').isValid()) return;
			
			//修改topic
			this.model.set('title', $('#topic_title').val());
			this.model.save('description', $('#topic_description').val(), {
				wait: true,
				error: function(model, response, options) {
					var alertMsg = 'Update topic failed. Please try again later!';
					util.commonErrorHandler(response.responseJSON, alertMsg);
				}
			});
			
			$('#modify_topic_sub_view').modal('toggle');
		}
	});
	
	var Header = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">Modify Topic</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var Footer = function() {
		var tpl = 
				'<div class="modal-footer"> ' + 
				'	<a type="button" class="cancel btn btn-default" data-dismiss="modal">Cancel</a> ' + 
				'	<a type="submit" class="save btn btn-primary">Save</a> ' + 
				'</div> ';
		return tpl;
	}
	
	var Body = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="topicAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="topic_title" class="control-label">Title:</label> ' + 
			'			<input type="text" class="form-control" id="topic_title" name="topic_title" placeholder="topic title..."> ' + 
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="topic_description" class="control-label">Description:</label> ' + 
			'			<textarea class="form-control" id="topic_description" name="topic_description" placeholder="topic description..."></textarea> ' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}
	
	return ProjectDetailForumTopicView;
});