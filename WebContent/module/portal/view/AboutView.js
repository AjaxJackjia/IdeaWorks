define([ 'backbone', 'util' ], function(Backbone, util) {
	var AboutView = Backbone.View.extend({
		
		className: 'about-container',
		
		initialize: function(){
			
		},
		
		render: function(){
			var $viewTitle = $('<div class="col-md-12 title">');
			$viewTitle.append('<h1>About Us</h1>');
	        
			var $teamTitle = $('<div class="col-md-12 sub-title">');
			$teamTitle.append('<h2 class="line"> <span> <i class="fa fa-group"></i> Our Team </span> </h2>');
			
			var $teamContent = $('<div class="col-md-12 content">');
			$teamContent.append('<p>IdeaWorks is developed by Lab on Enterprise Process Innovation and Computing (EPIC), which is the home for a group of researchers dedicated to the advancement on process-related research issues including business process modeling, business process design, workflow automation, organizational knowledge distribution, and effective enterprise communication.</p>');
			
			var $historyTitle = $('<div class="col-md-12 sub-title">');
			$historyTitle.append('<h2 class="line"> <span> <i class="fa fa-history"></i> Our History </span> </h2>');
			
			var $historyContent = $('<div class="col-md-12 content">');
			$historyContent.append('<p>We devoted to projects in various business contexts such as open/community source development, legacy system re-factoring, and service-oriented computing, just to name a few. Since the lab is housed in an MIS department and a business school, we do emphasize a lot on the application of process and other information technologies in such business domains as supply chain management, social network analysis, and public health informatics.</p>');
			
			var $futureTitle = $('<div class="col-md-12 sub-title">');
			$futureTitle.append('<h2 class="line"> <span> <i class="fa fa-paper-plane"></i> Our Future </span> </h2>');
			
			var $futureContent = $('<div class="col-md-12 content">');
			$futureContent.append('<p>We plan to integrate and extend IdeaWorks to empower Discover & Innovate @CityU, by Leveraging socially-transformational IT such as social networking, collaboration intelligence, mobile computing, and cloud computing. IdeaWorls will provide Systematic Support to Discover & Innovate @CityU.</p>');
			
			$(this.el).append($viewTitle);
			$(this.el).append($teamTitle);
			$(this.el).append($teamContent);
			$(this.el).append($historyTitle);
			$(this.el).append($historyContent);
			$(this.el).append($futureTitle);
			$(this.el).append($futureContent);
			
			return this;
		}
	});
	
	return AboutView;
});