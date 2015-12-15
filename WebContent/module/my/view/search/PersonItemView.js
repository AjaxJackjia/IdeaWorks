define([ 
         'backbone', 'util'
       ], 
    function(Backbone, util, ProjectCollection) {
	var PersonItemView = Backbone.View.extend({
		
		className: 'person-item-view',
		
		initialize: function(){
			//确保在正确作用域
			_.bindAll(this, 'render', 'unrender');
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
		}
	});
	
	var Item = function(person) {
		var $tpl = 
			'<div class="person-action">' + 
			'	<a class="view-profile btn btn-default">Detail</a>' + 
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
	
	return PersonItemView;
});