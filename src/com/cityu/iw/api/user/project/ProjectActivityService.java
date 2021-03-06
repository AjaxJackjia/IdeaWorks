package com.cityu.iw.api.user.project;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
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
import javax.ws.rs.QueryParam;
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

@Path("/users/{userid}/projects/{projectid}/activities")
public class ProjectActivityService extends BaseService {
	private static final String CURRENT_SERVICE = "ProjectActivityService";
	private static final Log FLOW_LOGGER = LogFactory.getLog("FlowLog");
	private static final Log ERROR_LOGGER = LogFactory.getLog("ErrorLog");
	
	@Context HttpServletRequest request;
	
	/*
	 * 记录activity
	 * params:
	 * 	projectid是操作的project
	 * 	operator是产生这条activity的用户;
	 * 	action是操作类型;
	 * 	entity是操作的对象;
	 * 	title是操作对象的备注信息
	 * */
	public static void recordActivity(int projectid, String operator, Config.Action action, Config.Entity entity, JSONObject info) {
		String sql = "insert into " +
					 "	ideaworks.activity (" + 
					 "		projectid, " + 
					 "		operator, " + 
					 "		action, " + 
					 "		entity, " +
					 "		title, " + 
					 "		time " + 
					 "	) values ( ?, ?, ?, ?, ?, ? )";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, 
										projectid, operator, action.getValue(), entity.getValue(), info.toString(), new Date());
		try {
			stmt.execute();
		} catch (SQLException e) {
			//LOGGER.info(e.toString());
		}
		
		DBUtil.getInstance().closeStatementResource(stmt);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, "projectid:" + projectid, "operator:" + operator, 
				"action:" + action, "entity:" + entity, "info:" + info.toString(), "recordActivity success"));
	}
	
	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserProjectActivities(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid,
			@QueryParam("currentPage") int p_currentPage,
			@QueryParam("pageSize") int p_pageSize ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserProjectActivities token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_projectid == 0 ) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserProjectActivities parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//check pagination param
		if(p_currentPage < 0) {
			p_currentPage = 0;
		}
		if(p_pageSize <= 0 || p_pageSize > 30) {
			p_pageSize = 30; //max page size is 30
		}
				
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.projectid, " + 
					 "	T1.action, " + 
					 "	T1.entity, " + 
					 "	T1.title, " + 
					 "	T1.operator, " + 
					 "	T1.time, " + 
					 "	T2.nickname as operatorNickname, " + 
					 "	T2.logo as operatorLogo " + 
					 "from " +
					 "	ideaworks.activity T1, " + 
					 "	ideaworks.user T2 " + 
					 "where " + 
					 "	T1.projectid = ? and " + 
					 "	T1.operator = T2.id " + 
					 "order by " + 
					 "	time desc " + 
					 "limit ? , ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid, p_currentPage * p_pageSize, p_pageSize);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONObject result = new JSONObject();
		
		JSONArray activities = new JSONArray();
		while(rs_stmt.next()) {
			JSONObject activity = new JSONObject();
			activity.put("activityid", rs_stmt.getInt("id"));
			activity.put("projectid", rs_stmt.getInt("projectid"));
			activity.put("action", rs_stmt.getInt("action"));
			activity.put("entity", rs_stmt.getInt("entity"));
			activity.put("title", rs_stmt.getString("title"));
			JSONObject operator = new JSONObject();
			operator.put("userid", rs_stmt.getString("operator"));
			operator.put("nickname", rs_stmt.getString("operatorNickname"));
			operator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("operatorLogo"));
			activity.put("operator", operator);
			activity.put("time", rs_stmt.getTimestamp("time").getTime());

			activities.put(activity);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		result.put("currentPage", p_currentPage);
		result.put("pageSize", p_pageSize);
		result.put("activities", activities);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "projectid: " + p_projectid, "currentPage: " + p_currentPage, "pageSize: " + p_pageSize, "getUserProjectActivities success"));
		return buildResponse(OK, result);
	}
}