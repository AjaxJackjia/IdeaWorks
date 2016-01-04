define([ 
         'backbone', 'util', 'i18n!../../../nls/translation', 
         'model/ProjectCollection' 
       ], function(Backbone, util, i18n, ProjectCollection) {
	var ProjectListView = Backbone.View.extend({
		
		className: 'item-list',
		
		initialize: function(){
			this.projectList = this.model;
		},
		
		render: function(){
			var self = this;
			_.each(this.projectList.models, function(project, index) {
				$(self.el).append(ProjectItem(index, project));
			});
			
			return this;
		}
	});
	
	var ProjectItem = function(index, project) {
		var $sectionContainer = $('<section rol="article" class="'+ (index%2 == 0?'odd':'even') +'">');
		
		var $itemHeader = $('<div class="item-header">');
		var _itemHeader_tpl = 
			'<div class="header-wrap"> ' + 
			'	<h2 class="item-title"> ' +
			'		<a href="'+ util.baseUrl +'/index.html#projects?id='+ project.get('projectid') + '">' + project.get('title') + '</a> ' + 
			'	</h2> ' + 
			'	<div class="item-time">' + project.get('time') + '</div> ' +
			'	<div class="line"></div> ' +
			'	<div class="item-description">' + project.get('content') + '</div> ' +
			'	<div class="item-action"> ' +
            '		<a href="'+ util.baseUrl +'/index.html#projects?id='+ project.get('projectid') + '" class="read-more">' + i18n.portal.ProjectListView.READ_MORE + '<i class="fa fa-angle-right"></i></a> ' +
            '	</div> ' +
            '</div>';
		
		$itemHeader.html(_itemHeader_tpl);
		$sectionContainer.append($itemHeader);
		
		return $sectionContainer;
	}
	
	return ProjectListView;
});