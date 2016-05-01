package com.cityu.iw.api.user.project;

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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.api.BaseService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;
import com.cityu.iw.util.FileUtil;
import com.cityu.iw.util.Util;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataBodyPart;
import com.sun.jersey.multipart.FormDataMultiPart;
import com.sun.jersey.multipart.FormDataParam;

/*
 * user center - search view requests
 * */

@Path("/users/{userid}/notifications")
public class ProjectNotificationService extends BaseService {
	private static final String CURRENT_SERVICE = "ProjectNotificationService";
	private static final Log FLOW_LOGGER = LogFactory.getLog("FlowLog");
	private static final Log ERROR_LOGGER = LogFactory.getLog("ErrorLog");
	
	@Context HttpServletRequest request;
	
	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getNotifications( @PathParam("userid") String p_userid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getNotifications token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals(""))) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getNotifications parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.userid as userid, " + 
					 "	T2.nickname as userNickname, " + 
					 "	T2.logo as userLogo, " + 
					 "	T1.projectid, " + 
					 "	T4.title as projectTitle, " + 
					 "	T1.operator as operatorid, " +
					 "	T3.nickname as operatorNickname, " + 
					 "	T3.logo as operatorLogo, " +
					 "	T1.action, " + 
					 "	T1.entity, " + 
					 "	T1.title, " + 
					 "	T1.time, " + 
					 "	T1.isRead " + 
					 "from " +
					 "	ideaworks.notification T1, " + 
					 "	ideaworks.user T2, " + 
					 "	ideaworks.user T3, " +
					 "	ideaworks.project T4 " +
					 "where " + 
					 "	T1.userid = ? and " + 
					 "	T1.userid = T2.id and " + 
					 "	T1.operator = T3.id and " +
					 "	T1.projectid = T4.id " +
					 "order by " + 
					 "	T1.time desc " + 
					 "limit 200 ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		ResultSet rs_stmt = stmt.executeQuery();
		JSONArray notifications = new JSONArray();
		while(rs_stmt.next()) {
			JSONObject notification = new JSONObject();
			notification.put("notificationid", rs_stmt.getInt("id"));
			
			JSONObject user = new JSONObject();
			user.put("userid", rs_stmt.getString("userid"));
			user.put("nickname", rs_stmt.getString("userNickname"));
			user.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("userLogo"));
			notification.put("user", user);
			
			JSONObject operator = new JSONObject();
			operator.put("userid", rs_stmt.getString("operatorid"));
			operator.put("nickname", rs_stmt.getString("operatorNickname"));
			operator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("operatorLogo"));
			notification.put("operator", operator);
			
			notification.put("projectid", rs_stmt.getInt("projectid"));
			notification.put("projectTitle", rs_stmt.getString("projectTitle"));
			notification.put("action", rs_stmt.getInt("action"));
			notification.put("entity", rs_stmt.getInt("entity"));
			notification.put("title", rs_stmt.getString("title"));
			notification.put("time", rs_stmt.getTimestamp("time").getTime());
			notification.put("isRead", rs_stmt.getInt("isRead"));
			
			notifications.put(notification);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getNotifications success"));
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
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getNotificationsById token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_notificationid == 0) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getNotificationsById parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.userid as userid, " + 
					 "	T2.nickname as userNickname, " + 
					 "	T2.logo as userLogo, " + 
					 "	T1.projectid, " + 
					 "	T4.title as projectTitle, " + 
					 "	T1.operator as operatorid, " +
					 "	T3.nickname as operatorNickname, " + 
					 "	T3.logo as operatorLogo, " + 
					 "	T1.action, " + 
					 "	T1.entity, " + 
					 "	T1.title, " + 
					 "	T1.time, " + 
					 "	T1.isRead " + 
					 "from " +
					 "	ideaworks.notification T1, " + 
					 "	ideaworks.user T2, " + 
					 "	ideaworks.user T3, " +
					 "	ideaworks.project T4 " +
					 "where " + 
					 "	T1.id = ? and " + 
					 "	T1.userid = T2.id and " + 
					 "	T1.operator = T3.id and " + 
					 "	T1.projectid = T4.id ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_notificationid);
		ResultSet rs_stmt = stmt.executeQuery();
		JSONObject notification = new JSONObject();
		while(rs_stmt.next()) {
			notification.put("notificationid", rs_stmt.getInt("id"));
			
			JSONObject user = new JSONObject();
			user.put("userid", rs_stmt.getString("userid"));
			user.put("nickname", rs_stmt.getString("userNickname"));
			user.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("userLogo"));
			notification.put("user", user);
			
			JSONObject operator = new JSONObject();
			operator.put("userid", rs_stmt.getString("operatorid"));
			operator.put("nickname", rs_stmt.getString("operatorNickname"));
			operator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("operatorLogo"));
			notification.put("operator", operator);
			
			notification.put("projectid", rs_stmt.getInt("projectid"));
			notification.put("projectTitle", rs_stmt.getString("projectTitle"));
			notification.put("action", rs_stmt.getInt("action"));
			notification.put("entity", rs_stmt.getInt("entity"));
			notification.put("title", rs_stmt.getString("title"));
			notification.put("time", rs_stmt.getTimestamp("time").getTime());
			notification.put("isRead", rs_stmt.getInt("isRead"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "notificationid: " + p_notificationid, "getNotificationsById success"));
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
	public static void notifyProjectAllMembers(int projectid, String operator, Config.Action action, Config.Entity entity, JSONObject info) throws SQLException, JSONException {
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
		createNotifications(userids, projectid, operator, action, entity, info.toString());
	}
	
	//通知project组内的特定成员
	public static void notifyProjectCertainMember(int projectid, String operator, Config.Action action, Config.Entity entity, JSONObject info) throws SQLException, JSONException {
		List<String> userids = new ArrayList<String>();
		userids.add(info.getString("touser"));
		
		//对每个成员创建notification
		createNotifications(userids, projectid, operator, action, entity, info.toString());
	}
	
	//通知project组内的所有成员
	public static void notifyProjectManagers(int projectid, String operator, Config.Action action, Config.Entity entity, JSONObject info) throws SQLException, JSONException {
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
			//需要检测creator与advisor是否为同一个人,防止发送相同的两条notification
			String creator = rs_stmt.getString("creator");
			String advisor = rs_stmt.getString("advisor");
			if(creator.equals(advisor)) {
				userids.add(creator);
			}else{
				userids.add(creator);
				userids.add(advisor);
			}
			
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//对每个成员创建notification
		createNotifications(userids, projectid, operator, action, entity, info.toString());
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
					 "	pid = 0 "; //直接参与topic讨论的一级消息发送者
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
	
	//通知project组内topic下的特定成员
	public static void notifyProjectTopicCertainMember(int projectid, String operator, Config.Action action, Config.Entity entity, JSONObject topicInfo) throws SQLException, JSONException {
		//获取该话题下该条评论的所有成员
		String sql = "select " + 
					 "	distinct fromuser " +
					 "from " + 
					 "	ideaworks.topic_discussion " +
					 "where " + 
					 "	id = ? or pid = ? "; //发送一级消息的作者, 以及参与topic讨论的二级消息发送者
		
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, topicInfo.getInt("pmessageid"), topicInfo.getInt("pmessageid"));
		ResultSet rs_stmt = stmt.executeQuery();
		List<String> userids = new ArrayList<String>();
		while(rs_stmt.next()) {
			userids.add(rs_stmt.getString("fromuser"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//对每个成员创建notification
		createNotifications(userids, projectid, operator, action, entity, topicInfo.toString());
	}
	
	@PUT
	@Path("/{notificationid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateNotificationById(
			@PathParam("userid") String p_userid,
			@PathParam("notificationid") int p_notificationid,
			@FormParam("isRead") int p_isRead ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateNotificationById token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_notificationid == 0 || p_isRead > 1 || p_isRead < 0) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateNotificationById parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//更新用户通知状态
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
		sql = "select " + 
			 "	T1.id, " + 
			 "	T1.userid as userid, " + 
			 "	T2.nickname as userNickname, " + 
			 "	T2.logo as userLogo, " + 
			 "	T1.projectid, " + 
			 "	T1.operator as operatorid, " +
			 "	T3.nickname as operatorNickname, " + 
			 "	T3.logo as operatorLogo, " + 
			 "	T1.action, " + 
			 "	T1.entity, " + 
			 "	T1.title, " + 
			 "	T1.time, " + 
			 "	T1.isRead " + 
			 "from " +
			 "	ideaworks.notification T1, " + 
			 "	ideaworks.user T2, " + 
			 "	ideaworks.user T3 " + 
			 "where " + 
			 "	T1.id = ? and " + 
			 "	T1.userid = T2.id and " + 
			 "	T1.operator = T3.id ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_notificationid);
		ResultSet rs_stmt = stmt.executeQuery();
		JSONObject notification = new JSONObject();
		while(rs_stmt.next()) {
			notification.put("notificationid", rs_stmt.getInt("id"));
			
			JSONObject user = new JSONObject();
			user.put("userid", rs_stmt.getString("userid"));
			user.put("nickname", rs_stmt.getString("userNickname"));
			user.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("userLogo"));
			notification.put("user", user);
			
			JSONObject operator = new JSONObject();
			operator.put("userid", rs_stmt.getString("operatorid"));
			operator.put("nickname", rs_stmt.getString("operatorNickname"));
			operator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("operatorLogo"));
			notification.put("operator", operator);
			
			notification.put("projectid", rs_stmt.getInt("projectid"));
			notification.put("action", rs_stmt.getInt("action"));
			notification.put("entity", rs_stmt.getInt("entity"));
			notification.put("title", rs_stmt.getString("title"));
			notification.put("time", rs_stmt.getTimestamp("time").getTime());
			notification.put("isRead", rs_stmt.getInt("isRead"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "notificationid: " + p_notificationid, "isRead: " + p_isRead, "updateNotificationById success"));
		return buildResponse(OK, notification);
	}
}