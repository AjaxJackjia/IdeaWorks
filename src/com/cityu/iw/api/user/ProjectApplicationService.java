package com.cityu.iw.api.user;

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

import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
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

@Path("/users/{userid}/projects/{projectid}/applications")
public class ProjectApplicationService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(ProjectApplicationService.class);
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
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_projectid == 0) {
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
					 "	T1.applicationid, " + 
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
					 "	T1.proposer = T2.id ";
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
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_projectid == 0 || p_applicationid == 0) {
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
			 "	T1.applicationid, " + 
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
		
		return buildResponse(OK, application);
	}
	
	@POST
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createApplications(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@FormParam("proposer") String p_proposer,
			@FormParam("projectid") int p_applyprojectid,
			@FormParam("msg") String p_msg ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_projectid == 0 || 
		   (p_proposer == null || p_proposer.equals("")) || p_applyprojectid == 0 ) {
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
					 "		status " + 
					 "	) values ( ?, ?, ?, ?)";
			stmt = DBUtil.getInstance().createSqlStatement(sql_search, p_applyprojectid, p_proposer, p_msg, 0);
			stmt.execute();
			
			//通知该project中的所有成员
			ProjectNotificationService.notifyProjectManagers(p_projectid, p_proposer, Config.Action.APPLY, Config.Entity.APPLICATION, p_msg);
			
			JSONObject normal = new JSONObject();
			normal.put("ret", "0");
			normal.put("msg", "ok");
			return buildResponse(OK, normal);
		}else{
			JSONObject alreadySend = new JSONObject();
			alreadySend.put("ret", "0");
			alreadySend.put("msg", "sent");
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
			@FormParam("proposer") String p_proposer,
			@FormParam("projectid") int p_applyprojectid,
			@FormParam("isagree") int p_isagree ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_projectid == 0 || 
		   (p_proposer == null || p_proposer.equals("")) || p_applyprojectid <= 0 || p_isagree > 2 || p_isagree <= 0 ) {
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
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_isagree, p_applicationid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		if(p_isagree == 1) {
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
		}
		
		//返回结果
		sql = "select " +
			 "	T1.applicationid, " + 
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
		
		return buildResponse(OK, application);
	}
}