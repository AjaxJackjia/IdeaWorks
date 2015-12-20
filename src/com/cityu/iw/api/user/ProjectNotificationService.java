package com.cityu.iw.api.user;

import java.io.InputStream;
import java.net.URLDecoder;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
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

import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.api.BaseService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;
import com.cityu.iw.util.FileUtil;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataBodyPart;
import com.sun.jersey.multipart.FormDataMultiPart;
import com.sun.jersey.multipart.FormDataParam;

/*
 * user center - search view requests
 * */

@Path("/users/{userid}/notifications")
public class ProjectNotificationService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(ProjectNotificationService.class);
	@Context HttpServletRequest request;
	
	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getNotifications( @PathParam("userid") String p_userid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals(""))) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		String sql = "select * from ideaworks.notification where userid = ? limit 200 ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		ResultSet rs_stmt = stmt.executeQuery();
		JSONArray notifications = new JSONArray();
		while(rs_stmt.next()) {
			JSONObject notification = new JSONObject();
			notification.put("notificationid", rs_stmt.getInt("id"));
			notification.put("userid", rs_stmt.getString("userid"));
			notification.put("projectid", rs_stmt.getInt("projectid"));
			notification.put("operator", rs_stmt.getString("operator"));
			notification.put("action", rs_stmt.getInt("action"));
			notification.put("entity", rs_stmt.getInt("entity"));
			notification.put("title", rs_stmt.getString("title"));
			notification.put("time", rs_stmt.getTimestamp("time").getTime());
			notification.put("isRead", rs_stmt.getInt("isRead"));

			notifications.put(notification);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return buildResponse(OK, notifications);
	}
	
	@GET
	@Path("/{notificationid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getNotificationsById(
			@PathParam("userid") String p_userid,
			@PathParam("notificationid") int p_notificationid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_notificationid == 0) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		String sql = "select * from ideaworks.notification where id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_notificationid);
		ResultSet rs_stmt = stmt.executeQuery();
		JSONObject notification = new JSONObject();
		while(rs_stmt.next()) {
			notification.put("notificationid", rs_stmt.getInt("id"));
			notification.put("userid", rs_stmt.getString("userid"));
			notification.put("projectid", rs_stmt.getInt("projectid"));
			notification.put("operator", rs_stmt.getString("operator"));
			notification.put("action", rs_stmt.getInt("action"));
			notification.put("entity", rs_stmt.getInt("entity"));
			notification.put("title", rs_stmt.getString("title"));
			notification.put("time", rs_stmt.getTimestamp("time").getTime());
			notification.put("isRead", rs_stmt.getInt("isRead"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return buildResponse(OK, notification);
	}
	
	//create notifications
	/*
	 * params:
	 * 	userids是要发送给消息的用户;
	 * 	projectid是操作的project
	 * 	operator是产生这条信息的用户;
	 * 	action是操作类型;
	 * 	entity是操作的对象;
	 * 	title是操作对象的备注信息
	 * */
	public static void createNotifications(
			List<String> userids, int projectid, String operator, 
			Config.Action action, Config.Entity entity, String title) throws SQLException, JSONException
	{
		String sql_insert = 
			 "insert into " +
			 "	ideaworks.notification (" + 
			 "		userid, " + 
			 "		projectid, " + 
			 "		operator, " + 
			 "		action, " + 
			 "		entity, " + 
			 "		title " + 
			 "	) values ( ?, ?, ?, ?, ?, ? )";
		String sql_search = "select * from ideaworks.user where id = ?";
		
		PreparedStatement stmt_insert = DBUtil.getInstance().createSqlStatement(sql_insert);
		PreparedStatement stmt_search = DBUtil.getInstance().createSqlStatement(sql_search);
		
		ResultSet rs_stmt = null;
		JSONObject notifications = null;
		for(String userid : userids) {
			//不给自己发送通知
			if(userid.equals(operator)) continue;
			
			//1. 获取该用户的notification settings
			stmt_search.setObject(1, userid);
			rs_stmt = stmt_search.executeQuery();
			while(rs_stmt.next()) {
				notifications = new JSONObject(rs_stmt.getString("notifications"));
				
				boolean isCurrentActionNotify = false;
				//project选项为true
				if(notifications.getBoolean("project") && (entity.getValue() / 100) * 100 == Config.Entity.PROJECT.getValue()) {
					isCurrentActionNotify = true;
				}
				else 
				//member选项为true
				if(notifications.getBoolean("member") && (entity.getValue() / 100) * 100 == Config.Entity.MEMEBER.getValue()) {
					isCurrentActionNotify = true;
				}
				else 
				//milestone选项为true
				if(notifications.getBoolean("milestone") && (entity.getValue() / 100) * 100 == Config.Entity.MILESTONE.getValue()) {
					isCurrentActionNotify = true;
				}
				else 
				//forum选项为true
				if(notifications.getBoolean("forum") && (entity.getValue() / 100) * 100 == Config.Entity.TOPIC.getValue()) {
					isCurrentActionNotify = true;
				}
				else 
				//discussion选项为true
				if(notifications.getBoolean("discussion") && (entity.getValue() / 100) * 100 == Config.Entity.MESSAGE.getValue()) {
					isCurrentActionNotify = true;
				}
				else 
				//file选项为true
				if(notifications.getBoolean("file") && (entity.getValue() / 100) * 100 == Config.Entity.FILE.getValue()) {
					isCurrentActionNotify = true;
				}
				else 
				//application action默认为发送
				if((entity.getValue() / 100) * 100 == Config.Entity.APPLICATION.getValue()) {
					isCurrentActionNotify = true;
				}
				
				//2. 按照用户的setting进行提示
				if(isCurrentActionNotify) {
					stmt_insert.setObject(1, userid);
					stmt_insert.setObject(2, projectid);
					stmt_insert.setObject(3, operator);
					stmt_insert.setObject(4, action.getValue());
					stmt_insert.setObject(5, entity.getValue());
					stmt_insert.setObject(6, title);
					stmt_insert.execute();
				}
			}
		}
		DBUtil.getInstance().closeStatementResource(stmt_search);
		DBUtil.getInstance().closeStatementResource(stmt_insert);
	}
	
	//通知project组内的所有成员
	public static void notifyProjectAllMembers(int projectid, String operator, Config.Action action, Config.Entity entity, String title) throws SQLException, JSONException {
		//获取该project中所有成员
		String sql = "select " + 
					 "	distinct userid " +
					 "from " + 
					 "	ideaworks.project_member " +
					 "where " + 
					 "	projectid = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		List<String> userids = new ArrayList<String>();
		while(rs_stmt.next()) {
			userids.add(rs_stmt.getString("userid"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//对每个成员创建notification
		createNotifications(userids, projectid, operator, action, entity, title);
	}
	
	//通知project组内的所有成员
	public static void notifyProjectManagers(int projectid, String operator, Config.Action action, Config.Entity entity, String title) throws SQLException, JSONException {
		//获取该project中管理员: 默认creator和advisor为管理员
		String sql = "select " + 
					 "	creator, " +
					 "	advisor " +
					 "from " + 
					 "	ideaworks.project " +
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		List<String> userids = new ArrayList<String>();
		while(rs_stmt.next()) {
			userids.add(rs_stmt.getString("creator"));
			userids.add(rs_stmt.getString("advisor"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//对每个成员创建notification
		createNotifications(userids, projectid, operator, action, entity, title);
	}
	
	//通知project组内的所有成员
	public static void notifyProjectTopicAllMembers(int projectid, String operator, Config.Action action, Config.Entity entity, JSONObject topicInfo) throws SQLException, JSONException {
		//获取该话题下的所有成员
		String sql = "select " + 
					 "	distinct fromuser " +
					 "from " + 
					 "	ideaworks.topic_discussion " +
					 "where " + 
					 "	topicid = ? and " + 
					 "	touser = null ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, topicInfo.getInt("topicid"));
		ResultSet rs_stmt = stmt.executeQuery();
		List<String> userids = new ArrayList<String>();
		while(rs_stmt.next()) {
			userids.add(rs_stmt.getString("fromuser"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//对每个成员创建notification
		createNotifications(userids, projectid, operator, action, entity, topicInfo.toString());
	}
	
	//通知project组内的特定成员
	public static void notifyProjectTopicCertainMember(int projectid, String operator, Config.Action action, Config.Entity entity, JSONObject topicInfo) throws SQLException, JSONException {
		List<String> userids = new ArrayList<String>();
		userids.add(topicInfo.getString("touser"));
		//对每个成员创建notification
		createNotifications(userids, projectid, operator, action, entity, topicInfo.toString());
	}
	
	@PUT
	@Path("/{notificationid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSearchPersonsById(
			@PathParam("userid") String p_userid,
			@PathParam("notificationid") int p_notificationid,
			@FormParam("isRead") int p_isRead ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_notificationid == 0 || p_isRead > 1 || p_isRead < 0) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//创建加入project请求
		//status: 0为未读;1为已读;
		String sql = 
				 "update " +
				 "	ideaworks.notification " + 
				 "set " + 
				 "	isRead = ? " + 
				 "where " + 
				 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_isRead, p_notificationid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//返回结果
		sql = "select * from ideaworks.notification where id = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_notificationid);
		ResultSet rs_stmt = stmt.executeQuery();
		JSONObject notification = new JSONObject();
		while(rs_stmt.next()) {
			notification.put("notificationid", rs_stmt.getInt("id"));
			notification.put("userid", rs_stmt.getString("userid"));
			notification.put("projectid", rs_stmt.getInt("projectid"));
			notification.put("operator", rs_stmt.getString("operator"));
			notification.put("action", rs_stmt.getInt("action"));
			notification.put("entity", rs_stmt.getInt("entity"));
			notification.put("title", rs_stmt.getString("title"));
			notification.put("time", rs_stmt.getTimestamp("time").getTime());
			notification.put("isRead", rs_stmt.getInt("isRead"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return buildResponse(OK, notification);
	}
}