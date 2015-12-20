package com.cityu.iw.api.user;

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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.api.BaseService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;

@Path("/users/{userid}/projects/{projectid}/activities")
public class ProjectActivityService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(ProjectActivityService.class);
	@Context HttpServletRequest request;
	
	/*
	 * 记录activity
	 * params:
	 * 	projectid是操作的project
	 * 	operator是产生这条activity的用户;
	 * 	title是操作对象的备注信息
	 * 	action是操作类型;
	 * 	entity是操作的对象;
	 * */
	public static void recordActivity(int projectid, String operator, String title, Config.Action action, Config.Entity entity) {
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
										projectid, operator, action.getValue(), entity.getValue(), title, new Date());
		try {
			stmt.execute();
		} catch (SQLException e) {
			LOGGER.info(e.toString());
		}
		
		DBUtil.getInstance().closeStatementResource(stmt);
	}
	
	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserProjectActivities(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_projectid == 0 ) {
			return buildResponse(PARAMETER_INVALID, null);
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
					 "	time asc";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
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

		return buildResponse(OK, activities);
	}
}