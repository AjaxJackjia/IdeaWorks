define([ 'backbone', 'util', 'model/ProjectModel' ], function(Backbone, util, ProjectModel) {
	var ProjectList = Backbone.Collection.extend({
		
		model: ProjectModel
	});
	
	var list = new ProjectList();
	list.add(new ProjectModel({
		projectid: '1',
		time: '2012-12-08',
		img: "ipad_1.jpg",
		title: "An broadcasting app for the iPhone and iPad",
		content: "Mok won a Gold Award in the 2012 Pan-Pearl River Delta University Student IT Project Competition. By creatively using advanced technology, he has developed an app for the iPhone and iPad that enables users to shoot interesting events and then broadcast them live for others to see on their smart phones.",
		directUrl: 'http://wikisites.cityu.edu.hk/sites/newscentre/en/Pages/201208141123.aspx'
	}));
	
	list.add(new ProjectModel({
		projectid: '2',
		time: '2012-06-11',
		img: "carbon_1.jpg",
		title: "Low-carbon Home-Green Residential Development Design",
		content: "These five students won the Platinum Award of the Business Environment Council (BEC) Low-carbon Home-Green Residential Development Design Competition. They outperformed around 30 teams from nine local tertiary institutions with their innovative design for a green housing estate in Zhongshan City, Guangdong Province.",
		directUrl: 'http://wikisites.cityu.edu.hk/sites/newscentre/en/Pages/201206041305.aspx'
	}));
	
	list.add(new ProjectModel({
		time: '2012-03-19',
		projectid: '3',
		img: "creating_3.jpg",
		title: "Creating art from desert readings",
		content: "Fifteen students from the School of Creative Media (SCM) embarked on an unforgettable study tour of the Mojave Desert in California in March 2012. The data collected were used to create multimedia artworks that were exhibited at the Run Run Shaw Creative Media Centre in May 2012.",
		directUrl: 'http://wikisites.cityu.edu.hk/sites/newscentre/en/Pages/201205211645.aspx'
	}));
	
	return list;
});