package com.cityu.iw.api.user.project;

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

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.api.BaseService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;
import com.cityu.iw.util.Util;


@Path("/users/{userid}/projects/{projectid}/milestones")
public class ProjectMilestoneService extends BaseService {
	private static final String CURRENT_SERVICE = "ProjectMilestoneService";
	private static final Log FLOW_LOGGER = LogFactory.getLog("FlowLog");
	private static final Log ERROR_LOGGER = LogFactory.getLog("ErrorLog");
	
	@Context HttpServletRequest request;
	
	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserProjectMilestones(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserProjectMilestones token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_projectid == 0) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserProjectMilestones parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.projectid, " + 
					 "	T1.title, " + 
					 "	T1.creator, " + 
					 "	T1.time, " + 
					 "	T1.description, " + 
					 "	T2.nickname as creatorNickname, " + 
					 "	T2.logo as creatorLogo " + 
					 "from " +
					 "	ideaworks.milestone T1, " + 
					 "	ideaworks.user T2 " + 
					 "where " + 
					 "	T1.projectid = ? and " + 
					 "	T1.creator = T2.id " + 
					 "order by " + 
					 "	time asc";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONArray milestones = new JSONArray();
	
		while(rs_stmt.next()) {
			JSONObject milestone = new JSONObject();
			milestone.put("milestoneid", rs_stmt.getInt("id"));
			milestone.put("projectid", rs_stmt.getInt("projectid"));
			milestone.put("title", rs_stmt.getString("title"));
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator"));
			creator.put("nickname", rs_stmt.getString("creatorNickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
			milestone.put("creator", creator);
			milestone.put("time", rs_stmt.getTimestamp("time").getTime());
			milestone.put("description", rs_stmt.getString("description"));

			milestones.put(milestone);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "projectid: " + p_projectid, "getUserProjectMilestones success"));
		return buildResponse(OK, milestones);
	}
	
	@GET
	@Path("/{milestoneid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserProjectMilestoneById(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid,
			@PathParam("milestoneid") int p_milestoneid) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserProjectMilestoneById token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_projectid == 0 || p_milestoneid == 0) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserProjectMilestoneById parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.projectid, " + 
					 "	T1.title, " + 
					 "	T1.creator, " + 
					 "	T1.time, " + 
					 "	T1.description, " + 
					 "	T2.nickname as creatorNickname, " + 
					 "	T2.logo as creatorLogo " + 
					 "from " +
					 "	ideaworks.milestone T1, " + 
					 "	ideaworks.user T2 " + 
					 "where " + 
					 "	T1.id = ? and " + 
					 "	T1.creator = T2.id ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_milestoneid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		JSONObject milestone = new JSONObject();
		
		while(rs_stmt.next()) {
			milestone.put("milestoneid", rs_stmt.getInt("id"));
			milestone.put("projectid", rs_stmt.getInt("projectid"));
			milestone.put("title", rs_stmt.getString("title"));
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator"));
			creator.put("nickname", rs_stmt.getString("creatorNickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
			milestone.put("creator", creator);
			milestone.put("time", rs_stmt.getTimestamp("time").getTime());
			milestone.put("description", rs_stmt.getString("description"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "projectid: " + p_projectid, "getUserProjectMilestoneById success"));
		return buildResponse(OK, milestone);
	}
	
	@POST
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createUserProjectMilestones(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@FormParam("title") String p_title, 
			@FormParam("creator[userid]") String p_creator,
			@FormParam("description") String p_description ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "createUserProjectMilestones token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_projectid == 0) ||
		   (p_title == null || p_title.equals("")) ||
		   (p_creator == null || p_creator.equals("")) ||
		   (p_description == null || p_description.equals("")) ) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "createUserProjectMilestones parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//1. create milestone
		String sql = "insert into " +
					 "	ideaworks.milestone (" + 
					 "		projectid, " + 
					 "		title, " + 
					 "		creator, " + 
					 "		time, " + 
					 "		description " + 
					 "	) values ( ?, ?, ?, ?, ? )";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, 
									p_projectid, p_title, p_creator, new Date(), p_description);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//2. 返回最新的milestone
		sql =
			 "select " + 
			 "	T1.id, " + 
			 "	T1.projectid, " + 
			 "	T1.title, " + 
			 "	T1.creator, " + 
			 "	T1.time, " + 
			 "	T1.description, " + 
			 "	T2.nickname as creatorNickname, " + 
			 "	T2.logo as creatorLogo " + 
			 "from " +
			 "	ideaworks.milestone T1, " + 
			 "	ideaworks.user T2 " + 
			 "where " + 
			 "	T1.projectid = ? and " + 
			 "	T1.creator = ? and " + 
			 "	T1.creator = T2.id " + 
			 "order by id desc limit 1 ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid, p_creator);
		ResultSet rs_stmt = stmt.executeQuery();
		
		JSONObject milestone = new JSONObject();
		
		while(rs_stmt.next()) {
			milestone.put("milestoneid", rs_stmt.getInt("id"));
			milestone.put("projectid", rs_stmt.getInt("projectid"));
			milestone.put("title", rs_stmt.getString("title"));
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator"));
			creator.put("nickname", rs_stmt.getString("creatorNickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
			milestone.put("creator", creator);
			milestone.put("time", rs_stmt.getTimestamp("time").getTime());
			milestone.put("description", rs_stmt.getString("description"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);

		//record activity
		JSONObject info = new JSONObject();
		info.put("title", p_title);
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.CREATE, Config.Entity.MILESTONE, info);
		
		//通知该project中的所有成员
		ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.CREATE, Config.Entity.MILESTONE, info);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "projectid: " + p_projectid, "createUserProjectMilestones success"));
		return buildResponse(OK, milestone);
	}
	
	@PUT
	@Path("/{mielstoneid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateUserProjectMiletones(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@PathParam("mielstoneid") int p_mielstoneid,
			@FormParam("title") String p_title, 
			@FormParam("description") String p_description ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUserProjectMiletones token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_projectid == 0) || 
		   (p_title == null || p_title.equals("")) ||
		   (p_description == null || p_description.equals("")) ) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "updateUserProjectMiletones parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//0. 拉取project,用以对比属性是否发生变化
		boolean isTitleChanged = false,
				isdescriptionChanged = false;
		String originalTitle = ""; //milestone原主题
		String sql = "select " + 
					 "	title, " + 
					 "	description " + 
					 "from " + 
					 "	ideaworks.milestone " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_mielstoneid);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			originalTitle = rs_stmt.getString("title");
			isTitleChanged = !rs_stmt.getString("title").equals(p_title);
			isdescriptionChanged = !rs_stmt.getString("description").equals(p_description);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//1. update milestone
		sql = "update " +
					 "	ideaworks.milestone " + 
					 "set " + 
					 "	title = ?, " + 
					 "	description = ? " + 
					 "where " + 
					 "	id = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_title, p_description, p_mielstoneid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//2. 返回修改的milestone
		sql = 
		     "select " + 
			 "	T1.id, " + 
			 "	T1.projectid, " + 
			 "	T1.title, " + 
			 "	T1.creator, " + 
			 "	T1.time, " + 
			 "	T1.description, " + 
			 "	T2.nickname as creatorNickname, " + 
			 "	T2.logo as creatorLogo " + 
			 "from " +
			 "	ideaworks.milestone T1, " + 
			 "	ideaworks.user T2 " + 
			 "where " + 
			 "	T1.creator = T2.id and " + 
			 "	T1.id = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_mielstoneid);
		rs_stmt = stmt.executeQuery();
		
		JSONObject milestone = new JSONObject();
		
		while(rs_stmt.next()) {
			milestone.put("milestoneid", rs_stmt.getInt("id"));
			milestone.put("projectid", rs_stmt.getInt("projectid"));
			milestone.put("title", rs_stmt.getString("title"));
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator"));
			creator.put("nickname", rs_stmt.getString("creatorNickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
			milestone.put("creator", creator);
			milestone.put("time", rs_stmt.getTimestamp("time").getTime());
			milestone.put("description", rs_stmt.getString("description"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//record activity
		//需要区分哪些属性是变化的;
		JSONObject info = new JSONObject();
		if(isTitleChanged) {
			info.put("original", originalTitle);
			info.put("current", milestone.getString("title"));
			info.put("title", milestone.getString("title"));
			//param: projectid, operator, action, entity, title
			ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.MILESTONE_TITLE, info);
			
			//通知该project中的所有成员
			ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.MILESTONE_TITLE, info);
		}
		if(isdescriptionChanged) {
			info.put("title", milestone.getString("title"));
			//param: projectid, operator, action, entity, title
			ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.MILESTONE_DESCRIPTION, info);
			
			//通知该project中的所有成员
			ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.MILESTONE_DESCRIPTION, info);
		}
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "projectid: " + p_projectid, "updateUserProjectMiletones success"));
		return buildResponse(OK, milestone);
	}
	
	@DELETE
	@Path("/{milestoneid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUserProjectMilestones(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@PathParam("milestoneid") int p_milestoneid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "deleteUserProjectMilestones token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_projectid == 0) || (p_milestoneid == 0) ||
		   (p_userid == null || p_userid.equals("")) ) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "deleteUserProjectMilestones parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}

		//查询要删除的milestone信息
		String msg = "";
		String sql = 
			     "select " + 
				 "	* " + 
				 "from " +
				 "	ideaworks.milestone " + 
				 "where " + 
				 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_milestoneid);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			msg = rs_stmt.getString("title");
		}
		
		//删除milestone
		sql = "delete from " +
					 "	ideaworks.milestone " + 
					 "where " + 
					 "	id = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_milestoneid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//record activity
		JSONObject info = new JSONObject();
		info.put("title", msg);
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.DELETE, Config.Entity.MILESTONE, info);
		
		//通知该project中的所有成员
		ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.DELETE, Config.Entity.MILESTONE, info);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "projectid: " + p_projectid, "milestone: " + msg, "deleteUserProjectMilestones success"));
		return null;
	}
}