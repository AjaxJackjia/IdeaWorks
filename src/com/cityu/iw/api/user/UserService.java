package com.cityu.iw.api.user;

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

import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.api.BaseService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;


@Path("/users")
public class UserService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(UserService.class);
	@Context HttpServletRequest request;
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUsers() throws Exception
	{
		String sql = "select * from ideaworks.user";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql);
		ResultSet rs_stmt = stmt.executeQuery();
		
		JSONArray list = new JSONArray();
		
		while(rs_stmt.next()) {
			JSONObject user = new JSONObject();
			
			user.put("userid", rs_stmt.getString("id"));
			user.put("nickname", rs_stmt.getString("nickname"));
			user.put("signature", rs_stmt.getString("signature"));
			user.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("logo"));
			user.put("usertype", getUserType( rs_stmt.getInt("usertype") ));
			
			list.put(user);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return buildResponse(OK, list);
	}
	
	@GET
	@Path("/{userid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUsersById(@PathParam("userid") String p_userid) throws Exception
	{
		String sql = "select * from ideaworks.user where id = ?";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		JSONObject user = new JSONObject();
		
		while(rs_stmt.next()) {
			user.put("userid", rs_stmt.getString("id"));
			user.put("nickname", rs_stmt.getString("nickname"));
			user.put("signature", rs_stmt.getString("signature"));
			user.put("realname", rs_stmt.getString("realname"));
			user.put("phone", rs_stmt.getString("phone"));
			user.put("email", rs_stmt.getString("email"));
			user.put("skype", rs_stmt.getString("skypeid"));
			user.put("wechat", rs_stmt.getString("wechatid"));
			user.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("logo"));
			user.put("usertype", getUserType( rs_stmt.getInt("usertype") ));
			user.put("major", rs_stmt.getString("major"));
			user.put("department", rs_stmt.getString("department"));
			user.put("college", rs_stmt.getString("college"));
			user.put("address", rs_stmt.getString("address"));
			user.put("introduction", rs_stmt.getString("introduction"));
			user.put("interests", rs_stmt.getString("interests"));
			user.put("notifications", new JSONObject(rs_stmt.getString("notifications")));
			user.put("privacy", rs_stmt.getInt("privacy"));
			user.put("sync", rs_stmt.getInt("sync"));
			user.put("language", rs_stmt.getString("language"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return buildResponse(OK, user);
	}
	
	@PUT
	@Path("/{userid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateUser(
			@PathParam("userid") String p_userid,
			@FormParam("nickname") String p_nickname, 
			@FormParam("signature") String p_signature, 
			@FormParam("realname") String p_realname, 
			@FormParam("phone") String p_phone, 
			@FormParam("email") String p_email, 
			@FormParam("skype") String p_skype, 
			@FormParam("wechat") String p_wechat, 
			@FormParam("major") String p_major, 
			@FormParam("department") String p_department, 
			@FormParam("college") String p_college, 
			@FormParam("address") String p_address, 
			@FormParam("introduction") String p_introduction, 
			@FormParam("interests") String p_interests) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//Step 1. check param
		if((p_userid == null || p_userid.equals("")) || 
		   (p_nickname == null || p_nickname.equals("")) ) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//Step 2. update user profile 
		String sql = "update " +
					 "	ideaworks.user " + 
					 "set " + 
					 "	nickname = ?, " + 
					 "	signature = ?, " + 
					 "	realname = ?, " + 
					 "	phone = ?, " + 
					 "	email = ?, " + 
					 "	skypeid = ?, " + 
					 "	wechatid = ?, " + 
					 "	major = ?, " + 
					 "	department = ?, " + 
					 "	college = ?, " + 
					 "	address = ?, " + 
					 "	introduction = ?, " + 
					 "	interests = ? " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, 
				p_nickname, p_signature, p_realname, p_phone, p_email, 
				p_skype, p_wechat, p_major, p_department, p_college, 
				p_address, p_introduction, p_interests, p_userid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//Step 3. return update result
		sql = "select * from ideaworks.user where id = ?";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		ResultSet rs_stmt = stmt.executeQuery();
		JSONObject user = new JSONObject();
		while(rs_stmt.next()) {
			user.put("userid", rs_stmt.getString("id"));
			user.put("nickname", rs_stmt.getString("nickname"));
			user.put("signature", rs_stmt.getString("signature"));
			user.put("realname", rs_stmt.getString("realname"));
			user.put("phone", rs_stmt.getString("phone"));
			user.put("email", rs_stmt.getString("email"));
			user.put("skype", rs_stmt.getString("skypeid"));
			user.put("wechat", rs_stmt.getString("wechatid"));
			user.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("logo"));
			user.put("usertype", getUserType( rs_stmt.getInt("usertype") ));
			user.put("major", rs_stmt.getString("major"));
			user.put("department", rs_stmt.getString("department"));
			user.put("college", rs_stmt.getString("college"));
			user.put("address", rs_stmt.getString("address"));
			user.put("introduction", rs_stmt.getString("introduction"));
			user.put("interests", rs_stmt.getString("interests"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);

		return buildResponse(OK, user);
	}
	
	@POST
	@Path("/{userid}/notifications")
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateUserNotifications(
			@PathParam("userid") String p_userid,
			@FormParam("project") String p_project,
			@FormParam("member") String p_member,
			@FormParam("milestone") String p_milestone,
			@FormParam("forum") String p_forum,
			@FormParam("discussion") String p_discussion,
			@FormParam("file") String p_file ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		JSONObject result = new JSONObject();
		//Step 1. check param
		if((p_userid == null || p_userid.equals("")) ||
		   (p_member == null || p_member.equals("")) || 
		   (p_milestone == null || p_milestone.equals("")) || 
		   (p_forum == null || p_forum.equals("")) ||
		   (p_discussion == null || p_discussion.equals("")) ||
		   (p_file == null || p_file.equals(""))) {
			result.put("ret", "-1");
			result.put("msg", "parameter invalid");
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		JSONObject notifications = new JSONObject();
		notifications.put("project", (p_project.equals("true")?true:false));		//project的相关提醒
		notifications.put("member", (p_member.equals("true")?true:false));			//member成员活动的相关提醒
		notifications.put("milestone", (p_milestone.equals("true")?true:false));	//milestone相关提醒
		notifications.put("forum", (p_forum.equals("true")?true:false));			//forum相关提醒
		notifications.put("discussion", (p_discussion.equals("true")?true:false));	//discussion相关提醒
		notifications.put("file", (p_file.equals("true")?true:false));				//file相关提醒
		
		//Step 2. update user notification 
		String sql = "update " +
					 "	ideaworks.user " + 
					 "set " + 
					 "	notifications = ? " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, notifications.toString(), p_userid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		result.put("ret", "0");
		result.put("msg", "ok");
		return buildResponse(OK, result);
	}
	
	@POST
	@Path("/{userid}/privacy")
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateUserPrivacy(
			@PathParam("userid") String p_userid,
			@FormParam("privacy") int p_privacy ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		JSONObject result = new JSONObject();
		//Step 1. check param
		if((p_userid == null || p_userid.equals(""))) {
			result.put("ret", "-1");
			result.put("msg", "parameter invalid");
			return buildResponse(PARAMETER_INVALID, result);
		}
		
		//规则：
		//	是否只对自己可见 -> 0
		//	是否只对project advisor可见 -> 1
		//	是否只对project member可见 -> 2
		//	是否公开所有人可见 -> 3
		//Step 2. update user privacy 
		String sql = "update " +
					 "	ideaworks.user " + 
					 "set " + 
					 "	privacy = ? " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_privacy, p_userid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		result.put("ret", "0");
		result.put("msg", "ok");
		return buildResponse(OK, result);
	}
	
	@POST
	@Path("/{userid}/advancedsetting")
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateUserAdvancedSetting(
			@PathParam("userid") String p_userid,
			@FormParam("sync") int p_sync,
			@FormParam("language") String p_language ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		JSONObject result = new JSONObject();
		//Step 1. check param
		if((p_userid == null || p_userid.equals("")) || 
		   (p_language == null || p_language.equals(""))) {
			result.put("ret", "-1");
			result.put("msg", "parameter invalid");
			return buildResponse(PARAMETER_INVALID, result);
		}
		
		//Step 2. update user advanced setting 
		String sql = "update " +
					 "	ideaworks.user " + 
					 "set " + 
					 "	sync = ?, " + 
					 "	language = ? " +
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_sync, p_language, p_userid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		result.put("ret", "0");
		result.put("msg", "ok");
		return buildResponse(OK, result);
	}
	
	@DELETE
	@Path("/{userid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUser(@PathParam("userid") String p_userid) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if(p_userid == null || p_userid.equals("")) {
			return buildResponse(PARAMETER_INVALID, null);
		}

		//设置标志位, 删除topic
		String sql = "update " +
					 "	ideaworks.user " + 
					 "set " + 
					 "	isDeleted = 1 " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
				
		return null;
	}
	
	private String getUserType(int type) {
		switch(type) {
		case 1: return "Student"; 
		case 2: return "Professor"; 
		default: return "Social";
		}
	}
}