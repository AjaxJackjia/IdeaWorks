package com.cityu.iw.api.user.project;

import java.io.InputStream;
import java.net.URLDecoder;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
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

import org.apache.commons.lang.StringUtils;
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
import com.sun.jersey.multipart.FormDataParam;

/*
 * user center - search view requests
 * */

@Path("/users/{userid}/projects/{projectid}/applications")
public class ProjectApplicationService extends BaseService {
	private static final String CURRENT_SERVICE = "ProjectApplicationService";
	private static final Log FLOW_LOGGER = LogFactory.getLog("FlowLog");
	private static final Log ERROR_LOGGER = LogFactory.getLog("ErrorLog");
	
	@Context HttpServletRequest request;
	
	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getApplications(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getApplications token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_projectid == 0) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getApplications parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//检查userid是否合法 (是否为该project的creator或者advisor)
		boolean isUserValid = false;
		String sql = "select " + 
					 "	creator, " +
					 "	advisor " +
					 "from " + 
					 "	ideaworks.project " +
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			isUserValid = p_userid.equals(rs_stmt.getString("creator")) || p_userid.equals(rs_stmt.getString("advisor"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		if(!isUserValid) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//查询结果
		sql = "select " +
					 "	T1.id, " + 
					 "	T1.projectid, " + 
					 "	T1.proposer, " + 
					 "	T2.nickname as proposerNickname, " +
					 "	T2.logo as proposerLogo, " +
					 "	T1.msg, " + 
					 "	T1.status, " + 
					 "	T1.createtime, " + 
					 "	T1.modifytime " + 
					 "from " + 
					 "	ideaworks.project_application T1, " +
					 "	ideaworks.user T2 " +
					 "where " +
					 "	T1.projectid = ? and " + 
					 "	T1.proposer = T2.id " + 
					 "order by " + 
					 "	T1.id desc ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		rs_stmt = stmt.executeQuery();
		JSONArray applications = new JSONArray();
		while(rs_stmt.next()) {
			JSONObject application = new JSONObject();
			application.put("applicationid", rs_stmt.getInt("id"));
			application.put("projectid", rs_stmt.getInt("projectid"));
			
			JSONObject proposer = new JSONObject();
			proposer.put("userid", rs_stmt.getString("proposer"));
			proposer.put("nickname", rs_stmt.getString("proposerNickname"));
			proposer.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("proposerLogo"));
			application.put("proposer", proposer);
			
			application.put("msg", rs_stmt.getString("msg"));
			application.put("status", rs_stmt.getInt("status"));
			application.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			application.put("modifytime", rs_stmt.getTimestamp("modifytime").getTime());

			applications.put(application);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "projectid: " + p_projectid, "getApplications success"));
		return buildResponse(OK, applications);
	}
	
	@GET
	@Path("/{applicationid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getApplicationsById(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@PathParam("applicationid") int p_applicationid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getApplicationsById token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_projectid == 0 || p_applicationid == 0) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getApplicationsById parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//检查userid是否合法 (是否为该project的creator或者advisor)
		boolean isUserValid = false;
		String sql = "select " + 
					 "	creator, " +
					 "	advisor " +
					 "from " + 
					 "	ideaworks.project " +
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			isUserValid = p_userid.equals(rs_stmt.getString("creator")) || p_userid.equals(rs_stmt.getString("advisor"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		if(!isUserValid) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getApplicationsById - current user is illegal"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//查询结果
		sql = "select " +
			 "	T1.id, " + 
			 "	T1.projectid, " + 
			 "	T1.proposer, " + 
			 "	T2.nickname as proposerNickname, " +
			 "	T2.logo as proposerLogo, " +
			 "	T1.msg, " + 
			 "	T1.status, " + 
			 "	T1.createtime, " + 
			 "	T1.modifytime " + 
			 "from " + 
			 "	ideaworks.project_application T1, " +
			 "	ideaworks.user T2 " +
			 "where " +
			 "	T1.id = ? and " + 
			 "	T1.proposer = T2.id ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_applicationid);
		rs_stmt = stmt.executeQuery();
		JSONObject application = new JSONObject();
		while(rs_stmt.next()) {
			application.put("applicationid", rs_stmt.getInt("id"));
			application.put("projectid", rs_stmt.getInt("projectid"));
			
			JSONObject proposer = new JSONObject();
			proposer.put("userid", rs_stmt.getString("proposer"));
			proposer.put("nickname", rs_stmt.getString("proposerNickname"));
			proposer.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("proposerLogo"));
			application.put("proposer", proposer);
			
			application.put("msg", rs_stmt.getString("msg"));
			application.put("status", rs_stmt.getInt("status"));
			application.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			application.put("modifytime", rs_stmt.getTimestamp("modifytime").getTime());
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "projectid: " + p_projectid, "applicationid: " + p_applicationid, "getApplicationsById success"));
		return buildResponse(OK, application);
	}
	
	@POST
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createApplications(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@FormParam("proposer[userid]") String p_proposer,
			@FormParam("projectid") int p_applyprojectid,
			@FormParam("msg") String p_msg ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "createApplications token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_projectid == 0 || 
		   (p_proposer == null || p_proposer.equals("")) || p_applyprojectid == 0 ) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "createApplications parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		if(p_msg == null) {
			p_msg = "";
		}
		
		//检查该用户是否已经参与该项目
		String sql_join = "select * from ideaworks.project_member where userid = ? and projectid = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql_join, p_proposer, p_applyprojectid);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			JSONObject alreadyJoin = new JSONObject();
			alreadyJoin.put("ret", "0");
			alreadyJoin.put("msg", "joined");
			
			FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "proposer: " + p_proposer, "apply_project: " + p_applyprojectid, "createApplications - current user already join this project"));
			return buildResponse(OK, alreadyJoin);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//检查该用户是否已经发送请求
		String sql_send = "select * from ideaworks.project_application where proposer = ? and projectid = ? and status = 0 ";
		stmt = DBUtil.getInstance().createSqlStatement(sql_send, p_proposer, p_applyprojectid);
		rs_stmt = stmt.executeQuery();
		boolean isSend = false;
		while(rs_stmt.next()) {
			isSend = true;
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//创建加入project请求
		if(!isSend) {
			String sql_search = 
					 "insert into " +
					 "	ideaworks.project_application (" + 
					 "		projectid, " + 
					 "		proposer, " + 
					 "		msg, " + 
					 "		createtime " + 
					 "	) values ( ?, ?, ?, ? )";
			stmt = DBUtil.getInstance().createSqlStatement(sql_search, p_applyprojectid, p_proposer, p_msg, new Date());
			stmt.execute();
			
			//通知该project中的所有成员
			JSONObject info = new JSONObject();
			info.put("msg", p_msg);
			ProjectNotificationService.notifyProjectManagers(p_projectid, p_proposer, Config.Action.APPLY, Config.Entity.APPLICATION, info);
			
			JSONObject normal = new JSONObject();
			normal.put("ret", "0");
			normal.put("msg", "ok");
			
			FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, p_userid, "proposer: " + p_proposer, "apply_project: " + p_applyprojectid, "createApplications success"));
			return buildResponse(OK, normal);
		}else{
			JSONObject alreadySend = new JSONObject();
			alreadySend.put("ret", "0");
			alreadySend.put("msg", "sent");
			
			FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, p_userid, "proposer: " + p_proposer, "apply_project: " + p_applyprojectid, "createApplications - already send request"));
			return buildResponse(OK, alreadySend);
		}
	}
	
	@PUT
	@Path("/{applicationid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateApplications(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@PathParam("applicationid") int p_applicationid,
			@FormParam("proposer[userid]") String p_proposer,
			@FormParam("projectid") int p_applyprojectid,
			@FormParam("status") int p_status ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateApplications token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_projectid == 0 || 
		   (p_proposer == null || p_proposer.equals("")) || p_applyprojectid <= 0 || p_status > 2 || p_status < 0 ) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateApplications parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//创建加入project请求
		//status: 0为已发送;1为已同意;2为已拒绝;
		String sql = 
				 "update " +
				 "	ideaworks.project_application " + 
				 "set " + 
				 "	status = ? " + 
				 "where " + 
				 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_status, p_applicationid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		if(p_status == 1) {//同意加入
			//更新project_member表
			sql = "insert into " +
				 "	ideaworks.project_member (" + 
				 "		projectid, " + 
				 "		userid, " + 
				 "		jointime " + 
				 "	) values ( ?, ?, ?)";
			stmt = DBUtil.getInstance().createSqlStatement(sql, p_applyprojectid, p_proposer, new Date());
			stmt.execute();
			DBUtil.getInstance().closeStatementResource(stmt);
			
			//获取member的基本信息
			JSONObject info = new JSONObject();
			sql = "select * from ideaworks.user where id = ? ";
			stmt = DBUtil.getInstance().createSqlStatement(sql, p_proposer);
			ResultSet rs_stmt = stmt.executeQuery();
			while(rs_stmt.next()) {
				info.put("title", rs_stmt.getString("nickname") + "(" + rs_stmt.getString("id") + ")");
			}
			DBUtil.getInstance().closeStatementResource(stmt);
			
			//param: projectid, operator, action, entity, title
			ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.ADD, Config.Entity.MEMEBER, info);
			
			//通知该project中的所有成员
			ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.ADD, Config.Entity.MEMEBER, info);
		}
		
		//返回结果
		sql = "select " +
			 "	T1.id, " + 
			 "	T1.projectid, " + 
			 "	T1.proposer, " + 
			 "	T2.nickname as proposerNickname, " +
			 "	T2.logo as proposerLogo, " +
			 "	T1.msg, " + 
			 "	T1.status, " + 
			 "	T1.createtime, " + 
			 "	T1.modifytime " + 
			 "from " + 
			 "	ideaworks.project_application T1, " +
			 "	ideaworks.user T2 " +
			 "where " +
			 "	T1.id = ? and " + 
			 "	T1.proposer = T2.id ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_applicationid);
		ResultSet rs_stmt = stmt.executeQuery();
		JSONObject application = new JSONObject();
		while(rs_stmt.next()) {
			application.put("applicationid", rs_stmt.getInt("id"));
			application.put("projectid", rs_stmt.getInt("projectid"));
			
			JSONObject proposer = new JSONObject();
			proposer.put("userid", rs_stmt.getString("proposer"));
			proposer.put("nickname", rs_stmt.getString("proposerNickname"));
			proposer.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("proposerLogo"));
			application.put("proposer", proposer);
			
			application.put("msg", rs_stmt.getString("msg"));
			application.put("status", rs_stmt.getInt("status"));
			application.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			application.put("modifytime", rs_stmt.getTimestamp("modifytime").getTime());
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//通知该proposer申请结果
		JSONObject info = new JSONObject();
		info.put("touser", p_proposer);
		if(p_status == 1) //告知proposer已同意请求
		{
			ProjectNotificationService.notifyProjectCertainMember(p_projectid, p_userid, Config.Action.AGREE, Config.Entity.APPLICATION, info);
		}else if(p_status == 2) //告知proposer已拒绝请求
		{
			ProjectNotificationService.notifyProjectCertainMember(p_projectid, p_userid, Config.Action.REJECT, Config.Entity.APPLICATION, info);
		}
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "proposer: " + p_proposer, "apply_project: " + p_applyprojectid, "updateApplications success"));
		return buildResponse(OK, application);
	}
}