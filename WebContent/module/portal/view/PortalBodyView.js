define([ 
         'backbone', 'util', 'i18n!../../../nls/translation', 
         'model/NewsCollection', 'model/ProjectCollection' 
       ], 
	function(Backbone, util, i18n, NewsCollection, ProjectCollection) {
	var PortalBodyView = Backbone.View.extend({
		
		className: 'portal-container',
		
		initialize: function(){
			//latest news
			this.newsList = NewsCollection; //已初始化
			
			//popular projects
			this.projectList = ProjectCollection; //已初始化
		},
		
		render: function(){
			//Part #1: slides
			var $carousel = $('<div id="portal-carousel" class="row carousel slide">');
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
			   '		<div class="carousel-title">' + i18n.portal.PortalBodyView.WELCOME_TITLE + '</div>  ' + 
			   '		<div class="carousel-content">The Discovery-enriched Curriculum (DEC) has the goal of giving all students the opportunity to make an original discovery while at City University of Hong Kong. The DEC has been set as the academic blueprint in CityU Academic Development Proposal 2012-15 that was endorsed by the UGC.</div>' + 
			   '		<div class="carousel-link"><a class="btn" href="index.html#introduction" target="_blank">' + i18n.portal.PortalBodyView.READ_MORE + '<i class="fa fa-angle-right"></i></a></div>  					   ' + 
			   '	  </div>							 										       ' +
			   '      <img src="res/images/portal/portal1.png" alt="First slide">   ' + 
			   '   </div>																			   ' + 
			   '   <div class="item">																   ' + 
			   '	  <div class="carousel-fg">														   ' +
			   '		<div class="carousel-title">' + i18n.portal.PortalBodyView.WELCOME_TITLE + '</div>  					   ' + 
			   '		<div class="carousel-content">The Discovery-enriched Curriculum (DEC) has the goal of giving all students the opportunity to make an original discovery while at City University of Hong Kong. The DEC has been set as the academic blueprint in CityU Academic Development Proposal 2012-15 that was endorsed by the UGC.</div>' + 
			   '		<div class="carousel-link"><a class="btn" href="index.html#introduction" target="_blank">' + i18n.portal.PortalBodyView.READ_MORE + '<i class="fa fa-angle-right"></i></a></div>  					   ' + 
			   '	  </div>					            									       ' +
			   '      <img src="res/images/portal/portal2.jpg" alt="Second slide">  ' + 
			   '   </div>							  												   ' + 
			   '</div>								  												   ' + 
			   '<!-- 轮播（Carousel）导航 -->							  								   ' + 
			   '<a class="carousel-control left" href="#portal-carousel" data-slide="prev">&lsaquo;</a>' + 
			   '<a class="carousel-control right" href="#portal-carousel" data-slide="next">&rsaquo;</a>';
			$carousel.html(carousel_tpl);

			$(this.el).append($carousel);
			
			//Part #2: three character icons with words
			var $reason = $('<div class="row limit-width reason_list" id="reason_list">');
			var reason_tpl = 
	            '<div class="col-xs-4 col-md-4 col-lg-4 reason">' + 			
	            '    <div class="icon-container"><i class="fa fa-search fa-5x"></i></div>' +
	            '    <p class="reason_desc"><h3>' + i18n.portal.PortalBodyView.FIND_NEW_IDEAS + '</h3></p>' +
	            '</div>' +
	            '<div class="col-xs-4 col-md-4 col-lg-4 reason">' +
	            '    <div class="icon-container"><i class="fa fa-lightbulb-o fa-5x"></i></div>' +
	            '    <p class="reason_desc"><h3>' + i18n.portal.PortalBodyView.HILIGHT_INSPIRATION + '</h3></p>' +
	            '</div>' +
	            '<div class="col-xs-4 col-md-4 col-lg-4 reason">' +
	            '    <div class="icon-container"><i class="fa fa-group fa-5x"></i></div>' +
	            '    <p class="reason_desc"><h3>' + i18n.portal.PortalBodyView.SHARE_WITH_PEOPLE + '</h3></p>' +
	            '</div>';
			$reason.html(reason_tpl);

			$(this.el).append($reason);
			
			//Part #3: latest news (three items with thumbnail style)
			var moreNewsUrl = 'index.html#news';
			var $newsTitle = $('<div class="row limit-width latest-news-title"><h1><span>' + i18n.portal.PortalBodyView.LATEST_NEWS + '<a class="title-more" href="'+ moreNewsUrl +'">      ' + i18n.portal.PortalBodyView.READ_MORE + '>></a></span></h1></div>');
			var $news = $('<div class="row limit-width latest-news">');
			var news_tpl = '';
			_.each(this.newsList.models, function(news, index) {
				news_tpl += LatestNewsItem(news);
			});
			$news.html(news_tpl);

			$(this.el).append($newsTitle);
			$(this.el).append($news);
			
			//Part #4: microscope with words
			var $microscope = $('<div class="row microscope">');
			var microscope_tpl =
				'<div class="wrapper">' + 
				'	<div class="microscope-image"></div>' + 
				'	<div class="container padded text-center">' +
				'		<h1>' + i18n.portal.PortalBodyView.MICROSCOPE_TITLE + '</h1>' +
				'		<h3>The DEC emphasizes on discovery, innovation, and creativity, which lie at the heart of academic strategy and four-year curriculum for teaching and learning, advanced scholarship, and community-related activities at City University.</h3>' +
				'	</div>' +
				'</div>';
			$microscope.html(microscope_tpl);

			$(this.el).append($microscope);
			
			//Part #5: popular projects (three items with thumbnail style)
			var morePorjectsUrl = 'index.html#projects';
			var $projectsTitle = $('<div class="row limit-width popular-projects-title"><h1><span>' + i18n.portal.PortalBodyView.POPULAR_PROJECTS + '<a class="title-more" href="'+ morePorjectsUrl +'">      ' + i18n.portal.PortalBodyView.READ_MORE + '>></a></span></h1></div>');
			var $projects = $('<div class="row limit-width popular-projects">');
			var projects_tpl = '';
			_.each(this.projectList.models, function(project, index) {
				projects_tpl += PopularProjectItem(project);
			});
			$projects.html(projects_tpl);

			$(this.el).append($projectsTitle);
			$(this.el).append($projects);
			
			//Part #6: join us
			var $joinus = $('<div class="joinus">');
			var joinus_tpl =
				'<div class="container padded text-center">' +
				'	<h1>' + i18n.portal.PortalBodyView.JOINUS_TITLE + '</h1>' +
				'	<h3>IdeaWorks captures the DEC approach to teaching and learning, which is to motivate and ignite a passion for knowledge and discovery in our students, prepare them to practice professionally at and beyond international standards, and promote a culture of knowledge and innovation that spurs local and global advancements in professional practice.</h3>' +
				'	<a href="login.html" class="btn btn-transparent btn-huge" id="try-now-btn">' + i18n.portal.PortalBodyView.TRY_NOW + '</a>' +
				'</div>';
			$joinus.html(joinus_tpl);

			$(this.el).append($joinus);
			
			return this;
		}
	});
	
	var LatestNewsItem = function(news) {
		var tpl = 
				'<div class="latest-news-item">' +
				'	<div class="thumbnail">' + 
				'		<img src="res/images/portal/news/' + news.get('img') + '">' + 
				'		<div class="caption">' + 
				'			<h3 title="' + news.get('title') + '">' + news.get('title') + '</h3>' + 
				'			<p class="news_abstract">'+ news.get('abstractContent') +'</p>' + 
				'			<p><a href="index.html#news?id='+ news.get('newsid') + '" target="_blank" class="btn btn-primary">' + i18n.portal.PortalBodyView.READ_MORE + ' >></a></p>' +
				'		</div>' +
				'	</div>' + 
				'</div>';
		return tpl;
	};
	
	var PopularProjectItem = function(project) {
		var tpl = 
				'<div class="popular-projects-item">' +
				'	<div class="thumbnail">' + 
				'		<img src="res/images/portal/projects/' + project.get('img') + '">' + 
				'		<div class="caption">' + 
				'			<h3 title="' + project.get('title') + '">' + project.get('title') + '</h3>' + 
				'			<p class="project_abstract">' + project.get('content') + '</p>' + 
				'			<p><a href="index.html#projects?id='+ project.get('projectid') + '" target="_blank" class="btn btn-primary">' + i18n.portal.PortalBodyView.READ_MORE + ' >></a></p>' +
				'		</div>' +
				'	</div>' + 
				'</div>';
		return tpl;
	};
	
	return PortalBodyView;
});