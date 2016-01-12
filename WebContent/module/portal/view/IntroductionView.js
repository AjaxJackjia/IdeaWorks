define([ 'backbone', 'util', 'i18n!../../../nls/translation' ], function(Backbone, util, i18n) {
	var IntroductionView = Backbone.View.extend({
		
		className: 'introduction-container',
		
		initialize: function(){
			
		},
		
		render: function(){
			var $mainTitle = $('<h1>IdeaWorks @ CityU</h1>');
			var $subTitle = $('<h3>Discovery-enriched Curriculum Bulletin Board</h3>');
			
			var $intro = $('<p>The Discovery-enriched Curriculum (DEC) has the goal of giving all students the opportunity to make an original discovery while at City University of Hong Kong. The DEC has been set as the academic blueprint in CityU Academic Development Proposal 2012-15 that was endorsed by the UGC. The DEC emphasizes on discovery, innovation, and creativity, which lie at the heart of academic strategy and four-year curriculum for teaching and learning, advanced scholarship, and community-related activities at City University. IdeaWorks captures the DEC approach to teaching and learning, which is to motivate and ignite a passion for knowledge and discovery in our students, prepare them to practice professionally at and beyond international standards, and promote a culture of knowledge and innovation that spurs local and global advancements in professional practice.</p>');
			
			var $pointsTitle = $('<h4>Significance of IdeaWorks:</4>');
			var pointsContent = 
				'<ul>' + 
				'	<li>Help institutionalize Discover & Innovate @CityU via flexible and dynamic support;</li>' +
				'	<li>Help execute inter-disciplinary collaboration and external institutions;</li>' +
				'	<li>Help materialize accountability of DEC activities;</li>' +
				'	<li>Help enhance DEC teaching & learning activities.</li>' +
				'</ul>';
			var $points = $(pointsContent);
			
			var $more = $('<a class="btn btn-info" href="http://www.cityu.edu.hk/provost/dec/" target="_blank">' + i18n.portal.IntroductionView.DETAIL_INFORMATION + '</a>');
			
			var imagesContent = 
				'<div class="row"><img class="img-thumbnail" src="res/images/portal/introduction/discovery_1.png"></div>' + 
				'<div class="row"><img class="img-thumbnail" src="res/images/portal/introduction/discovery_2.png"></div>' +
				'<div class="row"><img class="img-thumbnail" src="res/images/portal/introduction/discovery_3.png"></div>';
			var $images = $(imagesContent);
			
			$(this.el).append($mainTitle);
			$(this.el).append($subTitle);
			$(this.el).append($intro);
			$(this.el).append($pointsTitle);
			$(this.el).append($points);
			$(this.el).append($more);
			$(this.el).append($images);
			
			return this;
		}
	});
	
	return IntroductionView;
});