package com.cityu.iw.api.user;

import java.io.InputStream;
import java.net.URLDecoder;
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
import com.cityu.iw.util.FileUtil;
import com.cityu.iw.util.Util;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataBodyPart;
import com.sun.jersey.multipart.FormDataMultiPart;


@Path("/users")
public class UserService extends BaseService {
	private static final String CURRENT_SERVICE = "UserService";
	private static final Log FLOW_LOGGER = LogFactory.getLog("FlowLog");
	private static final Log ERROR_LOGGER = LogFactory.getLog("ErrorLog");
	
	private static final String DEFAULT_USER_LOGO = "default_user_logo.jpg";
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
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUser token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//Step 1. check param
		if((p_userid == null || p_userid.equals("")) || 
		   (p_nickname == null || p_nickname.equals("")) ) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUser parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		JSONObject user = null;
		try{
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
			user = new JSONObject();
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
			
			FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUser success"));
		}catch(Exception ex) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUser failed", ex.getMessage()));
			return buildResponse(INTERNAL_ERROR, null);
		}

		return buildResponse(OK, user);
	}
	
	@POST
	@Path("/{userid}/logo")
	@Consumes(MediaType.MULTIPART_FORM_DATA)  
	public Response updateUserLogo(
			@PathParam("userid") String p_userid,
			FormDataMultiPart form ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUserLogo token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
				
		/*
		 * Step 1. 获取参数
		 * */
		//获取文件流  
	    FormDataBodyPart filePart = form.getField("logo");
	    InputStream fileInputStream = filePart.getValueAs(InputStream.class);
	    FormDataContentDisposition formDataContentDisposition = filePart.getFormDataContentDisposition();
	    String filename = formDataContentDisposition.getFileName();
	    
	    /*
		 * Step 2. 校验参数
		 * */
		if(p_userid == null || p_userid.equals("")) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUserLogo parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		/*
		 * Step 3. 将logo写入server,并删除之前的logo
		 * */
		String currentTime = String.valueOf(System.currentTimeMillis());
		String suffix = filename.substring(filename.lastIndexOf("."));
		filename = p_userid + "_" + currentTime + suffix; //修改文件名使其更符合规范(命名规范为userid.xxx)
	    String fileLocation = getWebAppAbsolutePath() + Config.USER_IMG_BASE_DIR + URLDecoder.decode(filename, "utf-8");
		boolean writeLFlag = FileUtil.create(fileInputStream, fileLocation);
	    if(!writeLFlag) { //若写入磁盘失败，则直接返回空
	    	ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUserLogo write log error"));
	    	
			return null;
		}
	    
	    String sqlSelect = "select logo from ideaworks.user where id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sqlSelect, p_userid);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			String logo = rs_stmt.getString("logo");
			String preLogoPath = getWebAppAbsolutePath() + Config.USER_IMG_BASE_DIR + logo;
			if(!logo.equals(filename) && !logo.equals(DEFAULT_USER_LOGO)) {
				FileUtil.delete(preLogoPath); //删除之前的logo
			}
		}
		DBUtil.getInstance().closeStatementResource(stmt);
	    
		/*
		 * Step 4. 将logo更新到DB
		 * */
		String sqlUpdate = "update " +
							 "	ideaworks.user " + 
							 "set " + 
							 "	logo = ? " + 
							 "where " + 
							 "	id = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sqlUpdate, filename, p_userid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//返回修改的project logo
		JSONObject logoObj = new JSONObject();
		logoObj.put("logo", Config.USER_IMG_BASE_DIR + filename);
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUserLogo success"));
		
		return buildResponse(OK, logoObj);
	}
	
	@POST
	@Path("/{userid}/notification")
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateUserNotification(
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
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUserNotification token invalid!"));
			
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
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUserNotification parameter invalid!"));
			
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
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUserNotification success"));
		
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
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUserPrivacy token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		JSONObject result = new JSONObject();
		//Step 1. check param
		if((p_userid == null || p_userid.equals(""))) {
			result.put("ret", "-1");
			result.put("msg", "parameter invalid");
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUserPrivacy parameter invalid!"));
			
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
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUserPrivacy success"));
		
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
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUserAdvancedSetting token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		JSONObject result = new JSONObject();
		//Step 1. check param
		if((p_userid == null || p_userid.equals("")) || 
		   (p_language == null || p_language.equals(""))) {
			result.put("ret", "-1");
			result.put("msg", "parameter invalid");
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUserAdvancedSetting parameter invalid!"));
			
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
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUserAdvancedSetting success"));
		
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
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "deleteUser token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if(p_userid == null || p_userid.equals("")) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "deleteUser parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}

		//设置标志位, 删除user
		String sql = "update " +
					 "	ideaworks.user " + 
					 "set " + 
					 "	isDeleted = 1 " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "deleteUser success"));
				
		return null;
	}
	
	public static String getUserType(int type) {
		switch(type) {
			case 0: return "Student"; 
			case 1: return "Faculty"; 
			case 2: return "Industrical Participant"; 
			case 3: return "Government"; 
			case 4: return "Others"; 
			default: return "Unknown";
		}
	}
}