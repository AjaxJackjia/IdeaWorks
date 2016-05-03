package com.cityu.iw.api.user.dashboard;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.api.BaseService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;
import com.cityu.iw.util.Util;


@Path("/users/{userid}/dashboard/")
public class DashboardService extends BaseService {
	private static final String CURRENT_SERVICE = "DashboardService";
	private static final Log FLOW_LOGGER = LogFactory.getLog("FlowLog");
	private static final Log ERROR_LOGGER = LogFactory.getLog("ErrorLog");
	
	@Context HttpServletRequest request;
	
	@GET
	@Path("brief")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserDashboardBrief(@PathParam("userid") String p_userid) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserDashboardBrief token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}

		//check param
		if((p_userid == null || p_userid.equals(""))) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserDashboardBrief parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//retrieve result
		JSONObject brief = new JSONObject();
		
		String sql = "";
		PreparedStatement stmt = null;
		ResultSet rs_stmt = null;
		
		//Step 1. get user project number
		int projectNo = 0;
		sql = "select " + 
			 "	count(T1.id) as no " + 
			 "from " +
			 "	ideaworks.project T1, " + 
			 "	ideaworks.project_member T2 " + 
			 "where " + 
			 "	T2.userid = ? and " +
			 "	T1.id = T2.projectid and " + 
			 "	T1.isDeleted = 0 ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			projectNo = rs_stmt.getInt("no");
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//Step 2. get user activity number
		int activityNo = 0;
		sql = "select " + 
			 "	count(id) as no " + 
			 "from " +
			 "	ideaworks.activity " + 
			 "where " + 
			 "	operator = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			activityNo = rs_stmt.getInt("no");
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//Step 3. get user activity number
		int relatedMemberNo = 0;
		sql = "select " + 
			 "	count(distinct T3.userid) as no " + 
			 "from " +
			 "	ideaworks.project T1, " + 
			 "	ideaworks.project_member T2, " +
			 "	ideaworks.project_member T3 " + 
			 "where " + 
			 "	T2.userid = ? and " +
			 "	T1.id = T2.projectid and " + 
			 "	T3.projectid = T2.projectid and " + 
			 "	T1.isDeleted = 0 ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			relatedMemberNo = rs_stmt.getInt("no");
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//Step 4. get user forum participation number (create forum topic or send message)
		int forumParticipationNo = 0;
		sql = "select " + 
			 "	count(*) as no " + 
			 "from " +
			 "	ideaworks.topic T1, " + 
			 "	ideaworks.topic_discussion T2 " +
			 "where " + 
			 "	T1.creator = ? or " +
			 "	T2.fromuser = ? and " + 
			 "	T1.isDeleted = 0 ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid, p_userid);
		rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			forumParticipationNo = rs_stmt.getInt("no");
		}
		DBUtil.getInstance().closeStatementResource(stmt);
				
		//set result
		brief.put("projectNo", projectNo);
		brief.put("activityNo", activityNo);
		brief.put("relatedMemberNo", relatedMemberNo);
		brief.put("forumParticipationNo", forumParticipationNo);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserDashboardBrief success"));
		return buildResponse(OK, brief);
	}
	
	@GET
	@Path("populartopics")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getPopularTopics(@PathParam("userid") String p_userid) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getPopularTopics token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
				
		//check param
		if((p_userid == null || p_userid.equals("")) ) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getPopularTopics parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//popular topics指标主要是discussion message的数量
		String sql = 
				"select " + 
				"	T3.title as project_title, " + 
				"	T4.title as topic_title, " + 
				"	T4.createtime, " + 
				"	T5.topic_id, " + 
				"	T5.msg_count " + 
				"from " + 
				"	ideaworks.project T3, " + 
				"	ideaworks.topic T4, " + 
				"	(select " + 
				"		T1.id as topic_id, " + 
				"		count(T2.id) as msg_count " + 
				"	from " +
				"		ideaworks.project_member T0, " + 
				"		ideaworks.topic_discussion T2 " +
				"			left join " + 
				"		ideaworks.topic T1 " + 
				"			on T2.topicid = T1.id  " + 
				"	where " + 
				"		T0.projectid = T1.projectid and " + 
				"		T0.userid = ? " + 
				"	group by " + 
				"		T1.id " + 
				"	order by " +
				"		msg_count desc " +
				"	limit 5 ) T5 " +
				"where " + 
				"	T3.id = T4.projectid and " + 
				"	T4.id = T5.topic_id " + 
				"limit 30 ";
				
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		ResultSet rs_stmt = stmt.executeQuery();
		//result
		JSONArray topics = new JSONArray();
		while(rs_stmt.next()) {
			JSONObject topic = new JSONObject();
			topic.put("topicid", rs_stmt.getInt("topic_id"));
			topic.put("topic_title", rs_stmt.getString("topic_title"));
			topic.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			topic.put("project_title", rs_stmt.getString("project_title"));
			topic.put("msg_count", rs_stmt.getInt("msg_count"));

			topics.put(topic);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getPopularTopics success"));
		return buildResponse(OK, topics);
	}
	
	@GET
	@Path("recentactivities")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getRecentActivities(@PathParam("userid") String p_userid) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getRecentActivities token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
				
		//check param
		if((p_userid == null || p_userid.equals("")) ) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getRecentActivities parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
				
		JSONArray list = new JSONArray();
		
		/*
		 * 找出p_userid参与项目的所有最近活动
		 * */
		String sql = 
				"select " + 
				"	T2.id as activityid, " + 
				"	T2.action as activity_action, " + 
				"	T2.entity as activity_entity, " + 
				"	T2.title as activity_title, " + 
				"	T2.time as activity_time, " + 
				"	T1.title as porject_title, " + 
				"	T2.operator as userid, " + 
				"	T3.logo as logo, " + 
				"	T3.nickname as nickname " + 
				"from " + 
				"	ideaworks.project T1, " + 
				"	ideaworks.activity T2, " + 
				"	ideaworks.user T3 " + 
				"where " + 
				"	T1.id = T2.projectid and " + 
				"	T1.isDeleted = 0 and " + 
				"	T2.operator = T3.id and " + 
				"	T2.projectid in (select distinct projectid from ideaworks.project_member where userid = ?) " + 
				"order by " + 
				"	T2.time desc " + 
				"limit 30 ";
				
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		ResultSet rs_stmt = stmt.executeQuery();
		//result
		while(rs_stmt.next()) {
			JSONObject activity = new JSONObject();
			activity.put("activityid", rs_stmt.getInt("activityid"));
			activity.put("action", rs_stmt.getInt("activity_action"));
			activity.put("entity", rs_stmt.getInt("activity_entity"));
			activity.put("title", rs_stmt.getString("activity_title"));
			activity.put("porject_title", rs_stmt.getString("porject_title"));
			JSONObject operator = new JSONObject();
			operator.put("userid", rs_stmt.getString("userid"));
			operator.put("nickname", rs_stmt.getString("nickname"));
			operator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("logo"));
			activity.put("operator", operator);
			activity.put("time", rs_stmt.getTimestamp("activity_time").getTime());

			list.put(activity);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getRecentActivities success"));
		return buildResponse(OK, list);
	}
}