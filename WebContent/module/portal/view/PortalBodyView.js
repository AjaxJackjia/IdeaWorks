define([ 'backbone', 'util' ], function(Backbone, util) {
	var PortalBodyView = Backbone.View.extend({
		
		className: 'portal-container',
		
		initialize: function(){

		},
		
		render: function(){
			//Part #1: slides
			var $carousel = $('<div id="portal-carousel" class="carousel slide">');
			var carousel_tpl = 
			   '<!-- 轮播（Carousel）指标 -->													 		   ' +
			   '<ol class="carousel-indicators">											 		   ' + 
			   '   <li data-target="#portal-carousel" data-slide-to="0" class="active"></li> 		   ' + 
			   '   <li data-target="#portal-carousel" data-slide-to="1"></li>                		   ' + 
			   '</ol>   																	 		   ' + 
			   '<!-- 轮播（Carousel）项目 -->													 		   ' +
			   '<div class="carousel-inner">												 		   ' + 
			   '   <div class="item active">												 		   ' + 
			   '	  <div class="carousel-fg">														   ' +
			   '		<div class="carousel-title">Welcome to IdeaWorks!</div>  					   ' + 
			   '		<div class="carousel-content">The Discovery-enriched Curriculum (DEC) has the goal of giving all students the opportunity to make an original discovery while at City University of Hong Kong. The DEC has been set as the academic blueprint in CityU Academic Development Proposal 2012-15 that was endorsed by the UGC.</div>' + 
			   '		<div class="carousel-link"><a class="btn" href="index.html#introduction" target="_blank">Read More >></a></div>  					   ' + 
			   '	  </div>							 										       ' +
			   '      <img src="'+ util.baseUrl +'/res/images/portal/portal1.png" alt="First slide">   ' + 
			   '   </div>																			   ' + 
			   '   <div class="item">																   ' + 
			   '      <img src="'+ util.baseUrl +'/res/images/portal/portal2.jpg" alt="Second slide">  ' + 
			   '   </div>							  												   ' + 
			   '</div>								  												   ' + 
			   '<!-- 轮播（Carousel）导航 -->							  								   ' + 
			   '<a class="carousel-control left" href="#portal-carousel" data-slide="prev">&lsaquo;</a>' + 
			   '<a class="carousel-control right" href="#portal-carousel" data-slide="next">&rsaquo;</a>';
			$carousel.html(carousel_tpl);

			$(this.el).append($carousel);
			
			//Part #2: three character icons with words
			var $reason = $('<div class="row reason_list" id="reason_list">');
			var reason_tpl = 
	            '<div class="col-xs-4 col-md-4 col-lg-4 reason">' + 			
	            '    <div class="icon-container"><i class="fa fa-search fa-5x"></i></div>' +
	            '    <p class="reason_desc"><h3>Find new ideas</h3></p>' +
	            '</div>' +
	            '<div class="col-xs-4 col-md-4 col-lg-4 reason">' +
	            '    <div class="icon-container"><i class="fa fa-lightbulb-o fa-5x"></i></div>' +
	            '    <p class="reason_desc"><h3>Hilight inspiration</h3></p>' +
	            '</div>' +
	            '<div class="col-xs-4 col-md-4 col-lg-4 reason">' +
	            '    <div class="icon-container"><i class="fa fa-group fa-5x"></i></div>' +
	            '    <p class="reason_desc"><h3>Share with people</h3></p>' +
	            '</div>';
			$reason.html(reason_tpl);

			$(this.el).append($reason);
			
			//Part #3: latest news (three items with thumbnail style)
			var moreNewsUrl = util.baseUrl + '/index.html#news';
			var $newsTitle = $('<div class="row latest-news-title"><h1>Latest News <a class="title-more" href="'+ moreNewsUrl +'">more>></a></h1></div>');
			var $news = $('<div class="row latest-news">');
			var news_tpl = '';
			for(var i = 0;i<3;i++) {
				news_tpl += 
					'<div class="col-sm-6 col-md-4 latest-news-item">' +
					'	<div class="thumbnail">' + 
					'		<img src="'+ util.baseUrl +'/res/images/portal/news/dec_fair3.png">' + 
					'		<div class="caption">' + 
					'			<h3>Gateway Education@CityU</h3>' + 
					'			<p>Gateway Education (GE) enables student to make a more informed choice of major and augments and rounds out the specialised training students will receive in their majors by providing exposure to cutting-edge knowledge and ideas that cross multiple disciplines.</p>' + 
					'			<p><a href="#" class="btn btn-primary">More >></a></p>' +
					'		</div>' +
					'	</div>' + 
					'</div>';
			}
			$news.html(news_tpl);

			$(this.el).append($newsTitle);
			$(this.el).append($news);
			
			//Part #4: microscope with words
			var $microscope = $('<div class="row microscope">');
			var microscope_tpl =
				'<div class="col-sm-4 col-md-4 microscope-image"></div>' + 
				'<div class="col-sm-8 col-md-8 container padded text-center">' +
				'	<h1>Discovery & Innovation & Teamwork</h1>' +
				'	<h3>The DEC emphasizes on discovery, innovation, and creativity, which lie at the heart of academic strategy and four-year curriculum for teaching and learning, advanced scholarship, and community-related activities at City University.</h3>' +
				'</div>';
			$microscope.html(microscope_tpl);

			$(this.el).append($microscope);
			
			//Part #5: popular projects (three items with thumbnail style)
			var morePorjectsUrl = util.baseUrl + '/index.html#projects';
			var $projectsTitle = $('<div class="row popular-projects-title"><h1>Popular Projects <a class="title-more" href="'+ morePorjectsUrl +'">more>></a></h1></div>');
			var $projects = $('<div class="row popular-projects">');
			var projects_tpl = '';
			for(var i = 0;i<3;i++) {
				projects_tpl += 
					'<div class="col-sm-6 col-md-4 popular-projects-item">' +
					'	<div class="thumbnail">' + 
					'		<img src="'+ util.baseUrl +'/res/images/portal/projects/carbon_1.jpg">' + 
					'		<div class="caption">' + 
					'			<h3>Low-carbon Home-Green Residential Development Design</h3>' + 
					'			<p>These five students won the Platinum Award of the Business Environment Council (BEC) Low-carbon Home-Green Residential Development Design Competition. </p>' + 
					'			<p><a href="#" class="btn btn-primary">More >></a></p>' +
					'		</div>' +
					'	</div>' + 
					'</div>';
			}
			$projects.html(projects_tpl);

			$(this.el).append($projectsTitle);
			$(this.el).append($projects);
			
			//Part #6: join us
			var $joinus = $('<div class="joinus">');
			var joinus_tpl =
				'<div class="container padded text-center">' +
				'	<h1>Wonderful IdeaWorks!</h1>' +
				'	<h3>IdeaWorks captures the DEC approach to teaching and learning, which is to motivate and ignite a passion for knowledge and discovery in our students, prepare them to practice professionally at and beyond international standards, and promote a culture of knowledge and innovation that spurs local and global advancements in professional practice.</h3>' +
				'	<a href="'+ util.baseUrl +'/login.html" class="btn btn-transparent btn-huge" id="try-now-btn">Try Now!</a>' +
				'</div>';
			$joinus.html(joinus_tpl);

			$(this.el).append($joinus);
			
			return this;
		}
	});
	
	return PortalBodyView;
});