define([ 'backbone', 'util' ], function(Backbone, util) {
	var ContactView = Backbone.View.extend({
		
		className: 'contact-container',
		
		initialize: function(){
			
		},
		
		render: function(){
			var $viewTitle = $('<div class="col-md-12 title">');
			$viewTitle.append('<h1>Contact Us</h1>');
	        
			var $locationTitle = $('<div class="col-md-12 sub-title">');
			$locationTitle.append('<h2 class="line"> <span> <i class="fa fa-location-arrow"></i> Our Location </span> </h2>');
			
			var $locationContent = $('<div class="col-md-12 content">');
			$locationContent.append('<p>Enterprise Process Innovation and Computing (EPIC) is located in City University of Hong Kong SRI. <br/> Postal Address: Department of IS, City University of Hong Kong, Kowloon, Hong Kong, China.</p>');
			
			var $workingTimeTitle = $('<div class="col-md-12 sub-title">');
			$workingTimeTitle.append('<h2 class="line"> <span> <i class="fa fa-clock-o"></i> Working Time </span> </h2>');
			
			var $workintTimeContent = $('<div class="col-md-12 content working-time">');
			$workintTimeContent.append('<p>9:00am to 17:00pm, Monday to Friday.</p>');
			
			var $contactPersonTitle = $('<div class="col-md-12 sub-title">');
			$contactPersonTitle.append('<h2 class="line"> <span> <i class="fa fa-user"></i> Contact Person </span> </h2>');
			
			var $contactPersonContent = $('<div class="col-md-12 content contact-person">');
			$contactPersonContent.append('<p>Dr. J. Leon Zhao, Director of EPIC Lab <br/>' + 
					'Head and Chair Professor,Department of Information Systems<br/>' +
					'City University of Hong Kong<br/>' +
					'Kowloon, Hong Kong SAR, China <br/>' +
					'Email: jlzhao [at] cityu [dot] edu [dot] hk</p>');
			
			$(this.el).append($viewTitle);
			$(this.el).append($locationTitle);
			$(this.el).append($locationContent);
			$(this.el).append($workingTimeTitle);
			$(this.el).append($workintTimeContent);
			$(this.el).append($contactPersonTitle);
			$(this.el).append($contactPersonContent);
			
			return this;
		}
	});
	
	return ContactView;
});