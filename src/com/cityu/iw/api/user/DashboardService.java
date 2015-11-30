package com.cityu.iw.api.user;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.api.BaseService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;


@Path("/users/{userid}/dashboard/")
public class DashboardService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(DashboardService.class);

	@GET
	@Path("brief")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject getUserDashboardBrief(@PathParam("userid") String p_userid) throws Exception
	{
		JSONObject brief = new JSONObject();
		
		brief.put("projectNo", 22);
		brief.put("activityNo", 102);
		brief.put("relatedMemberNo", 234);
		brief.put("forumParticipationNo", 500);
		
		return brief;
	}
	
	@GET
	@Path("populartopics")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getPopularTopics(@PathParam("userid") String p_userid) throws Exception
	{
		JSONArray list = new JSONArray();
		
		for(int i = 0;i<10;i++) {
			JSONObject topic = new JSONObject();
			
			topic.put("topicid", i);
			topic.put("projectid", i);
			topic.put("title", "test title " + i);
			topic.put("creator", "jackjia");
			topic.put("participantNo", Math.ceil(Math.random() * 100.0));
			topic.put("messageNo", Math.ceil(Math.random() * 100.0));
			
			list.put(topic);
		}
		
		return list;
	}
	
	@GET
	@Path("recentactivities")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getRecentActivities(@PathParam("userid") String p_userid) throws Exception
	{
		JSONArray list = new JSONArray();
		
		for(int i = 0;i<10;i++) {
			JSONObject activity = new JSONObject();
			
			activity.put("activityid", i);
			activity.put("title", "Test activity " + i);
			activity.put("operator", "jackjia");
			
			list.put(activity);
		}
		
		return list;
	}
}