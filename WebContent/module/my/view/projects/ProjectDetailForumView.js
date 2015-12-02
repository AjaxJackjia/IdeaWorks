define([ 
         'backbone', 'util',
         //view
         'view/projects/ProjectDetailForumTopicView',
         //model
         'model/project/TopicModel'
       ], 
    function(Backbone, util, ProjectDetailForumTopicView, TopicModel) {
	var ProjectDetailForumView = Backbone.View.extend({
		
		className: 'project-detail-forum-view',
		
		events: {
			'click .add-topic-title': 'clickToCreate'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'addTopicItem', 'removeTopicItem', 'createTopic', 'deleteTopic');
			
			//注册全局事件
			Backbone.
				off('ProjectDetailForumView:createTopic').
				on('ProjectDetailForumView:createTopic', this.createTopic, this);
			Backbone.
				off('ProjectDetailForumView:deleteTopic').
				on('ProjectDetailForumView:deleteTopic', this.deleteTopic, this);
			
			//监听model变化
			this.model.bind('add', this.addTopicItem);
			this.model.bind('remove', this.removeTopicItem);
		},
		
		render: function(){
			var $topics = $('<div class="topics well">');
			$topics.append(TopicAddButton()); // topic add button
			$(this.el).append($topics);
			
		    return this;
		},
			
		/*
		 * 向topic集合中添加topic
		 * */
		addTopicItem: function(topic) {
			var $topicAddBtn = $(this.el).find('.topic.add-topic');
			//set topic url
			topic.url = this.model.url + '/' + topic.id;
			var projectDetailForumTopicView = new ProjectDetailForumTopicView({
				model: topic
			});
			$(projectDetailForumTopicView.el).insertAfter($topicAddBtn);
			
			//保持scrollY在最上
			$('.project-content').scrollTop( 0 );
		},
		
		/*
		 * 从topic集合中删除topic
		 * */
		removeTopicItem: function(topic) {
			_.each($('.topic[cid]', this.el), function(element, index, list){ 
				if($(element).attr('cid') == topic.cid) {
					$(element).fadeOut();
					$(element).remove();
				}
			});
			
			//其他topic应当在该topic删除时展示出来
			$('.topic', this.el).show();
		},
		
		/*
		 * 新增topic
		 * */
		createTopic: function(topic) {
			var topics = this.model;
			topics.create(topic, {
				 wait: true, 
				 success: function() {
					 //添加topic到topic list
					 topics.add(topic);
				 }, 
				 error: function() {
					 alert('Create topic failed. Please try again later!');
				 }
			});
		},
		
		/*
		 * 删除topic
		 * */
		deleteTopic: function(topic) {
			var topics = this.model;
			topics.get(topic.cid).destroy({
				wait: true, 
				success: function() {
					//从list中删除topic
					topics.remove(topic);
				},
				error: function() {
					alert('Delete topic failed. Please try again later!');
				}
			});
		},
		
		/*
		 * 点击新建topic按钮事件
		 * */
		clickToCreate: function() {
			var topics = this.model;
			var createTopicSubView = new CreateTopicSubView({
				model: topics
			});
			var $subView = $('#create_topic_sub_view');
			if($subView.length == 0) {
				$('.content-panel').append($(createTopicSubView.render().el));
			}
			//显示view
			$('#create_topic_sub_view').modal('toggle');
		}
	});
	
	var TopicAddButton = function() {
		var $tpl = 
			'<div class="topic add-topic"> ' +
			'  <div class="timeline-icon"> ' +
			'    <i class="fa fa-plus"></i> ' +
			'  </div> ' +
			'  <div class="content"> ' +
			'	 <div class="add-topic-title">Add New Topic</div> ' +
			'  </div> ' +
			'</div>';
		return $tpl;
	};
	
	/*
	 * subview - create new topic sub view
	 * */
	var CreateTopicSubView = Backbone.View.extend({
		
		id: 'create_topic_sub_view',
		
		className: 'create-topic-sub-view modal fade',
		
		events: {
			'click .create': 'create'
		},
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender', 'create');
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
			$(this.el).on('hide.bs.modal', function (event) {
				self.unrender();
			});
			
		    return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		//创建新的topic
		create: function() {
			//validate
			$('#topicAttribute').data('bootstrapValidator').validateField('topic_title');
			$('#topicAttribute').data('bootstrapValidator').validateField('topic_description');
			if(!$('#topicAttribute').data('bootstrapValidator').isValid()) return;
			
			//创建topic model
			var topic = new TopicModel();
			topic.set('title', $('#topic_title').val());
			topic.set('description', $('#topic_description').val());
			topic.set('creator', util.currentUserProfile());
			
			//触发全局事件
			Backbone.trigger('ProjectDetailForumView:createTopic', topic);
			
			//隐藏窗口
			$('#create_topic_sub_view').modal('toggle');
		}
	});
	
	var Header = function() {
		var tpl = 
			'<div class="modal-header"> ' + 
			'	<a type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a> ' + 
			'	<h3 class="modal-title">Create Forum Topic</h3> ' + 
			'</div>';
		return tpl;
	}
	
	var Footer = function() {
		var tpl = 
			'<div class="modal-footer"> ' + 
			'	<a type="button" class="cancel btn btn-default" data-dismiss="modal">Cancel</a> ' + 
			'	<a type="submit" class="create btn btn-primary">Create</a> ' + 
			'</div> ';
		return tpl;
	}
	
	var Body = function() {
		var tpl = 
			'<div class="modal-body"> ' + 
			'	<form id="topicAttribute"> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="topic_title" class="control-label">Title:</label> ' + 
			'			<input type="text" class="form-control" id="topic_title" name="topic_title" placeholder="forum topic title..."> ' + 
			'		</div> ' + 
			'		<div class="form-group"> ' + 
			'			<label for="topic_description" class="control-label">Description:</label> ' + 
			'			<textarea class="form-control" id="topic_description" name="topic_description" placeholder="topic description..."></textarea> ' + 
			'		</div> ' + 
			'	</form> ' + 
			'</div> '
		return tpl;
	}
	
	return ProjectDetailForumView;
});