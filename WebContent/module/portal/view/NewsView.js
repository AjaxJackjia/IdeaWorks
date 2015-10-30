define([ 'backbone', 'headroom', 'util' ], function(Backbone, Headroom, util) {
	var NewsView = Backbone.View.extend({
		
		className: 'news-container',
		
		initialize: function(){
			
		},
		
		render: function(){
			var $title = $('<h1>IdeaWorks @ CityU</h1>');
			var $time = $('<h3>2015-10-21</h3>');
			
			var $description = $('<p>The Discovery-enriched Curriculum (DEC) has the goal of giving all students the opportunity to make an original discovery while at City University of Hong Kong. The DEC has been set as the academic blueprint in CityU Academic Development Proposal 2012-15 that was endorsed by the UGC. The DEC emphasizes on discovery, innovation, and creativity, which lie at the heart of academic strategy and four-year curriculum for teaching and learning, advanced scholarship, and community-related activities at City University. IdeaWorks captures the DEC approach to teaching and learning, which is to motivate and ignite a passion for knowledge and discovery in our students, prepare them to practice professionally at and beyond international standards, and promote a culture of knowledge and innovation that spurs local and global advancements in professional practice.</p>');
			
			var $more = $('<a href="http://www.cityu.edu.hk/provost/dec/" target="_blank">Detail Information</a>');
			
			var imagesContent = 
				'<div class="row"><img class="img-thumbnail" src="'+ util.baseUrl +'/res/images/portal/introduction/discovery_3.png"></div>';
			var $images = $(imagesContent);
			
			$(this.el).append($title);
			$(this.el).append($time);
			$(this.el).append($description);
			$(this.el).append($more);
			$(this.el).append($images);
			
			return this;
		}
	});
	
	return NewsView;
});