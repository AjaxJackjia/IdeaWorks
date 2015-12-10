define([ 'backbone', 'util', 'model/NewsModel' ], function(Backbone, util, NewsModel) {
	var NewsList = Backbone.Collection.extend({
		model: NewsModel
	});
	
	var list = new NewsList();
	list.add(new NewsModel({
		newsid: '1',
		time: '2012-10-21',
		img: "dec_fair3.png",
		title: "The First CB DEC Fair",
		abstractContent: "As part of the inaugural CityU Discovery Festival, the College of Business organized the first CB DEC Fair. This fair showcased 6 exemplar teams of students, each of the 6 CB departments, on their journey of discovery projects. Visitors had the opportunity to interact with the teams and cast their votes for the project they liked best. ",
		content: 'As part of the inaugural CityU Discovery Festival, the College of Business organized the first CB DEC Fair. This fair showcased 6 exemplar teams of students, each of the 6 CB departments, on their journey of discovery projects. Visitors had the opportunity to interact with the teams and cast their votes for the project they liked best. ',
		directUrl: 'http://www.cityu.edu.hk/edge/dec/mini_fair/cb.htm'
	}));
	
	list.add(new NewsModel({
		newsid: '2',
		time: '2012-5-12',
		img: "gateway_1.png",
		title: "Gateway Education@CityU",
		abstractContent: "Gateway Education (GE) enables student to make a more informed choice of major and augments and rounds out the specialised training students will receive in their majors by providing exposure to cutting-edge knowledge and ideas that cross multiple disciplines.",
		content: 'Gateway Education (GE) enables student to make a more informed choice of major and augments and rounds out the specialised training students will receive in their majors by providing exposure to cutting-edge knowledge and ideas that cross multiple disciplines. GE courses comprise roughly 25% of the total credit units in the 4-year degree structure starting in 2012. GE provides students with multi-disciplinary learning experiences. It helps them acquire a wide range of skills and knowledge necessary for completing University studies and prepares them to be life-long learners and active, informed citizens who can thrive in a complex and continuously changing world.   ',
		directUrl: 'http://www6.cityu.edu.hk/ge_info/'
	}));
	
	list.add(new NewsModel({
		newsid: '3',
		time: '2012-1-18',
		img: "social_science.png",
		title: "D&I Mini Fair",
		abstractContent: "D&I Mini Fair in the Discovery Festival portraits a variety of discovery activities and creative solutions generated by our students and diligently supervised by our colleagues. The 1-minute video capturing of the 25 cases demonstrate a collective effort from colleagues in colleges and departments when we celebrate the accomplishments in the vitalized discovery-enriched curriculum. ",
		content: 'D&I Mini Fair in the Discovery Festival portraits a variety of discovery activities and creative solutions generated by our students and diligently supervised by our colleagues. The 1-minute video capturing of the 25 cases demonstrate a collective effort from colleagues in colleges and departments when we celebrate the accomplishments in the vitalized discovery-enriched curriculum.  ',
		directUrl: 'http://www.cityu.edu.hk/edge/dec/dec_workshop.htm'
	}));
	
	return list;
});