package com.cityu.iw.api.user.project;

import java.io.InputStream;
import java.net.URL;
import java.net.URLDecoder;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletContext;
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
import com.cityu.iw.util.FileUtil;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataBodyPart;
import com.sun.jersey.multipart.FormDataMultiPart;

/*
 * user center - projects view requests
 * */

@Path("/users/{userid}/projects")
public class ProjectService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(ProjectService.class);
	private static final String DEFAULT_PROJECT_LOGO = "default_prj_logo.png";
	private static final int STATUS_ONGOING_FLAG = 0;	//项目正在进行
	private static final int STATUS_COMPLETE_FLAG = 1;	//项目已经结束
	private static final int SECURITY_PUBLIC_FLAG = 0;	//项目对外公开
	private static final int SECURITY_PRIVATE_FLAG = 0;	//项目仅对组内公开
	@Context HttpServletRequest request;
	@Context ServletContext context;
	
	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserProjects(@PathParam("userid") String p_userid) throws Exception
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
				
		String sql = "select " + 
					 "	T2.id, " + 
					 "	T2.title, " + 
					 "	T2.creator, " + 
					 "	T4.nickname as creatorNickname, " +
					 "	T4.logo as creatorLogo, " +
					 "	T2.advisor, " + 
					 "	T3.nickname as advisorNickname, " +
					 "	T3.logo as advisorLogo, " +
					 "	T2.abstract, " + 
					 "	T2.status, " + 
					 "	T2.security, " + 
					 "	T2.logo, " + 
					 "	T2.createtime, " +
					 "	T2.modifytime " +
					 "from " + 
					 "	ideaworks.project_member T1, " + 
					 "	ideaworks.project T2, " + 
					 "	ideaworks.user T3, " + 
					 "	ideaworks.user T4 " + 
					 "where " + 
					 "	T1.userid = ? and " +
					 "	T1.projectid = T2.id and " + 
					 "	T3.id = T2.advisor and " + 
					 "	T4.id = T2.creator and " + 
					 "	T2.isDeleted = 0 " + 
					 "order by " + 
					 "	T2.createtime asc";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		JSONArray list = new JSONArray();
		
		while(rs_stmt.next()) {
			JSONObject project = new JSONObject();
			
			project.put("projectid", rs_stmt.getInt("id"));
			project.put("title", rs_stmt.getString("title"));
			
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator"));
			creator.put("nickname", rs_stmt.getString("creatorNickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
			project.put("creator", creator);
			
			JSONObject advisor = new JSONObject();
			advisor.put("userid", rs_stmt.getString("advisor"));
			advisor.put("nickname", rs_stmt.getString("advisorNickname"));
			advisor.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("advisorLogo"));
			project.put("advisor", advisor);
			
			project.put("abstractContent", rs_stmt.getString("abstract"));
			project.put("status", rs_stmt.getInt("status"));
			project.put("security", rs_stmt.getInt("security"));
			project.put("logo", Config.PROJECT_IMG_BASE_DIR + rs_stmt.getString("logo"));
			project.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			project.put("modifytime", rs_stmt.getTimestamp("modifytime").getTime());
			project.put("isDeleted", 0);
			
			list.put(project);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return buildResponse(OK, list);
	}
	
	@GET
	@Path("/{projectid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserProjectsById(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid) throws Exception
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
				
		String sql = "select " + 
					 "	T2.id, " + 
					 "	T2.title, " + 
					 "	T2.creator, " + 
					 "	T4.nickname as creatorNickname, " +
					 "	T4.logo as creatorLogo, " +
					 "	T2.advisor, " + 
					 "	T3.nickname as advisorNickname, " +
					 "	T3.logo as advisorLogo, " +
					 "	T2.abstract, " + 
					 "	T2.status, " + 
					 "	T2.security, " + 
					 "	T2.logo, " + 
					 "	T2.createtime, " +
					 "	T2.modifytime " +
					 "from " + 
					 "	ideaworks.project_member T1, " + 
					 "	ideaworks.project T2, " + 
					 "	ideaworks.user T3, " + 
					 "	ideaworks.user T4 " + 
					 "where " + 
					 "	T1.userid = ? and " +
					 "	T2.id = ? and " + 
					 "	T1.projectid = T2.id and " + 
					 "	T3.id = T2.advisor and " + 
					 "	T4.id = T2.creator and " + 
					 "	T2.isDeleted = 0 ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		JSONObject project = new JSONObject();
		
		while(rs_stmt.next()) {
			project.put("projectid", rs_stmt.getInt("id"));
			project.put("title", rs_stmt.getString("title"));
			
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator"));
			creator.put("nickname", rs_stmt.getString("creatorNickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
			project.put("creator", creator);
			
			JSONObject advisor = new JSONObject();
			advisor.put("userid", rs_stmt.getString("advisor"));
			advisor.put("nickname", rs_stmt.getString("advisorNickname"));
			advisor.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("advisorLogo"));
			project.put("advisor", advisor);
			
			project.put("abstractContent", rs_stmt.getString("abstract"));
			project.put("status", rs_stmt.getInt("status"));
			project.put("security", rs_stmt.getInt("security"));
			project.put("logo", Config.PROJECT_IMG_BASE_DIR + rs_stmt.getString("logo"));
			project.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			project.put("modifytime", rs_stmt.getTimestamp("modifytime").getTime());
			project.put("isDeleted", 0);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return buildResponse(OK, project);
	}
	
	@POST
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createUserProjects(
			@PathParam("userid") String p_userid,
			@FormParam("title") String p_title, 
			@FormParam("creator[userid]") String p_creator,
			@FormParam("advisor[userid]") String p_advisor ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || 
		   (p_title == null || p_title.equals("")) || 
		   (p_creator == null || p_creator.equals("")) || 
		   (p_advisor == null || p_advisor.equals(""))) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//1. create project
		String sql = "insert into " +
					 "	ideaworks.project (" + 
					 "		title, " + 
					 "		creator, " + 
					 "		advisor, " + 
					 "		abstract, " + 
					 "		status, " + 
					 "		security, " + 
					 "		logo, " + 
					 "		createtime, " + 
					 "		modifytime " + 
					 "	) values ( ?, ?, ?, ?, ?, ?, ?, ?, ? )";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, 
									p_title, p_creator, p_advisor, "", 
									STATUS_ONGOING_FLAG, SECURITY_PUBLIC_FLAG, 
									DEFAULT_PROJECT_LOGO, new Date(), new Date());
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//2. 返回最新的project id
		int projectid = 0;
		sql = "select id from ideaworks.project where title = ? order by id desc limit 1";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_title);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			projectid = rs_stmt.getInt("id");
		}
		DBUtil.getInstance().closeStatementResource(stmt);

		//2. add related members
		sql = "insert into " +
				 "	ideaworks.project_member (" + 
				 "		projectid, " + 
				 "		userid, " + 
				 "		jointime " + 
				 "	) values ( ?, ?, ?)";
		stmt = DBUtil.getInstance().createSqlStatement(sql, projectid, p_creator, new Date());
		stmt.execute();
		
		//若advisor与creator不同，则再插入advisor
		if(!p_advisor.equals(p_creator)) {
			stmt = DBUtil.getInstance().createSqlStatement(sql, projectid, p_advisor, new Date());
			stmt.execute();
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//3. 返回创建的project
		sql = "select " + 
				 "	T2.id, " + 
				 "	T2.title, " + 
				 "	T2.creator, " + 
				 "	T4.nickname as creatorNickname, " +
				 "	T4.logo as creatorLogo, " +
				 "	T2.advisor, " + 
				 "	T3.nickname as advisorNickname, " +
				 "	T3.logo as advisorLogo, " +
				 "	T2.abstract, " + 
				 "	T2.status, " + 
				 "	T2.security, " + 
				 "	T2.logo, " + 
				 "	T2.createtime, " +
				 "	T2.modifytime " +
				 "from " + 
				 "	ideaworks.project_member T1, " + 
				 "	ideaworks.project T2, " + 
				 "	ideaworks.user T3, " + 
				 "	ideaworks.user T4 " + 
				 "where " + 
				 "	T1.projectid = ? and " +
				 "	T1.projectid = T2.id and " + 
				 "	T3.id = T2.advisor and " + 
				 "	T4.id = T2.creator and " + 
				 "	T2.isDeleted = 0";
		
		stmt = DBUtil.getInstance().createSqlStatement(sql, projectid);
		rs_stmt = stmt.executeQuery();
		
		JSONObject project = new JSONObject();
		while(rs_stmt.next()) {
			project.put("projectid", rs_stmt.getInt("id"));
			project.put("title", rs_stmt.getString("title"));
			
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator"));
			creator.put("nickname", rs_stmt.getString("creatorNickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
			project.put("creator", creator);
			
			JSONObject advisor = new JSONObject();
			advisor.put("userid", rs_stmt.getString("advisor"));
			advisor.put("nickname", rs_stmt.getString("advisorNickname"));
			advisor.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("advisorLogo"));
			project.put("advisor", advisor);
			
			project.put("abstractContent", rs_stmt.getString("abstract"));
			project.put("status", rs_stmt.getInt("status"));
			project.put("security", rs_stmt.getInt("security"));
			project.put("logo", Config.PROJECT_IMG_BASE_DIR + rs_stmt.getString("logo"));
			project.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			project.put("modifytime", rs_stmt.getTimestamp("modifytime").getTime());
			project.put("isDeleted", 0);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//record activity
		JSONObject info = new JSONObject();
		info.put("title", p_title);
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(projectid, p_userid, Config.Action.CREATE, Config.Entity.PROJECT, info);
		
		//通知该project中的所有成员
		ProjectNotificationService.notifyProjectAllMembers(projectid, p_userid, Config.Action.CREATE, Config.Entity.PROJECT, info);
				
		return buildResponse(OK, project);
	}
	
	@POST
	@Path("/{projectid}/logo")
	@Consumes(MediaType.MULTIPART_FORM_DATA)  
	public Response updateUserProjectsLogo(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			FormDataMultiPart form ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
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
		if((p_projectid == 0) || (p_userid == null || p_userid.equals(""))) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		/*
		 * Step 3. 将logo写入server,并删除之前的logo
		 * */
		String currentTime = String.valueOf(System.currentTimeMillis());
		String suffix = filename.substring(filename.lastIndexOf("."));
		filename = "prj_" + p_projectid + "_" + "logo_" + currentTime + suffix; //修改文件名使其更符合规范
	    String fileLocation = getWebAppAbsolutePath() + Config.PROJECT_IMG_BASE_DIR + URLDecoder.decode(filename, "utf-8");
		boolean writeLFlag = FileUtil.create(fileInputStream, fileLocation);
	    if(!writeLFlag) { //若写入磁盘失败，则直接返回空
			return null;
		}
	    
	    String sqlSelect = "select logo from ideaworks.project where id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sqlSelect, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			String logo = rs_stmt.getString("logo");
			String preLogoPath = getWebAppAbsolutePath() + Config.PROJECT_IMG_BASE_DIR + logo;
			//头像跟之前不同,并且头像不为默认头像的时候删除之前的logo
			if(!logo.equals(filename) && !logo.equals(DEFAULT_PROJECT_LOGO)) {
				FileUtil.delete(preLogoPath);
			}
		}
		DBUtil.getInstance().closeStatementResource(stmt);
	    
		/*
		 * Step 4. 将logo更新到DB
		 * */
		String sqlUpdate = "update " +
							 "	ideaworks.project " + 
							 "set " + 
							 "	logo = ? " + 
							 "where " + 
							 "	id = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sqlUpdate, filename, p_projectid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//返回修改的project logo
		JSONObject logoObj = new JSONObject();
		logoObj.put("logo", Config.PROJECT_IMG_BASE_DIR + filename);
		
		//记录activity
		JSONObject info = new JSONObject();
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.PROJECT_LOGO, info);
		
		//通知该project中的所有成员
		ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.PROJECT_LOGO, info);
		
		return buildResponse(OK, logoObj);
	}
	
	@PUT
	@Path("/{projectid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateUserProjects(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@FormParam("title") String p_title, 
			@FormParam("abstractContent") String p_abstract, 
			@FormParam("advisor[userid]") String p_advisor, 
			@FormParam("status") int p_status, 
			@FormParam("security") int p_security ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || p_projectid == 0 || 
		   (p_status < 0 || p_status > 1) || (p_security < 0 || p_security > 1) || 
		   (p_title == null || p_title.equals("")) || (p_advisor == null || p_advisor.equals(""))) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//0. 拉取project,用以对比属性是否发生变化
		boolean isTitleChanged = false,
				isAdvisorChanged = false,
				isAbstractChanged = false,
				isStatusChanged = false,
				isSecurityChanged = false;
		String originalTitle = "", originalAdvisor = "";
		int	originalStatus = 0, originalSecurity = 0;
		
		String sql = "select " + 
					 "	title, " + 
					 "	advisor, " + 
					 "	abstract, " + 
					 "	status, " + 
					 "	security " + 
					 "from " + 
					 "	ideaworks.project " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			isTitleChanged = !rs_stmt.getString("title").equals(p_title);
			isAdvisorChanged = !rs_stmt.getString("advisor").equals(p_advisor);
			isAbstractChanged = !rs_stmt.getString("abstract").equals(p_abstract);
			isStatusChanged = rs_stmt.getInt("status") != p_status;
			isSecurityChanged = rs_stmt.getInt("security") != p_security;
			
			originalTitle = rs_stmt.getString("title");
		    originalAdvisor = rs_stmt.getString("advisor");
		    originalStatus = rs_stmt.getInt("status");
		    originalSecurity = rs_stmt.getInt("security");
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//1. 更新project
		sql = "update " +
					 "	ideaworks.project " + 
					 "set " + 
					 "	title = ?, " + 
					 "	abstract = ?, " + 
					 "	advisor = ?, " +
					 "	status = ?, " + 
					 "	security = ? " + 
					 "where " + 
					 "	id = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, 
									p_title, p_abstract, p_advisor, p_status, p_security, p_projectid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//2. 返回创建的project
		sql = "select " + 
				 "	T2.id, " + 
				 "	T2.title, " + 
				 "	T2.creator, " + 
				 "	T4.nickname as creatorNickname, " +
				 "	T4.logo as creatorLogo, " +
				 "	T2.advisor, " + 
				 "	T3.nickname as advisorNickname, " +
				 "	T3.logo as advisorLogo, " +
				 "	T2.abstract, " + 
				 "	T2.status, " + 
				 "	T2.security, " + 
				 "	T2.logo, " + 
				 "	T2.createtime, " +
				 "	T2.modifytime " +
				 "from " + 
				 "	ideaworks.project_member T1, " + 
				 "	ideaworks.project T2, " + 
				 "	ideaworks.user T3, " + 
				 "	ideaworks.user T4 " + 
				 "where " + 
				 "	T1.projectid = ? and " +
				 "	T1.projectid = T2.id and " + 
				 "	T3.id = T2.advisor and " + 
				 "	T4.id = T2.creator and " + 
				 "	T2.isDeleted = 0";
		
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		rs_stmt = stmt.executeQuery();
		
		JSONObject project = new JSONObject();
		while(rs_stmt.next()) {
			project.put("projectid", rs_stmt.getInt("id"));
			project.put("title", rs_stmt.getString("title"));
			
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator"));
			creator.put("nickname", rs_stmt.getString("creatorNickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
			project.put("creator", creator);
			
			JSONObject advisor = new JSONObject();
			advisor.put("userid", rs_stmt.getString("advisor"));
			advisor.put("nickname", rs_stmt.getString("advisorNickname"));
			advisor.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("advisorLogo"));
			project.put("advisor", advisor);
			
			project.put("abstractContent", rs_stmt.getString("abstract"));
			project.put("status", rs_stmt.getInt("status"));
			project.put("security", rs_stmt.getInt("security"));
			project.put("logo", Config.PROJECT_IMG_BASE_DIR + rs_stmt.getString("logo"));
			project.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			project.put("modifytime", rs_stmt.getTimestamp("modifytime").getTime());
			project.put("isDeleted", 0);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//record activity
		//需要区分哪些属性是变化的;
		String msg = "";
		if(isTitleChanged) {
			JSONObject info = new JSONObject();
			info.put("original", originalTitle);
			info.put("current", project.getString("title"));
			
			//param: projectid, operator, action, entity, title
			ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.PROJECT_TITLE, info);
			
			//通知该project中的所有成员
			ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.PROJECT_TITLE, info);
		}
		if(isAdvisorChanged) {
			JSONObject info = new JSONObject();
			info.put("original", originalAdvisor);
			info.put("current", project.getJSONObject("advisor").getString("userid"));
			
			//param: projectid, operator, action, entity, title
			ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.PROJECT_ADVISOR, info);
			
			//通知该project中的所有成员
			ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.PROJECT_ADVISOR, info);
		}
		if(isAbstractChanged) {
			JSONObject info = new JSONObject();
			//param: projectid, operator, action, entity, title
			ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.PROJECT_ABSTRACT, info);
			
			//通知该project中的所有成员
			ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.PROJECT_ABSTRACT, info);
		}
		if(isStatusChanged) {
			JSONObject info = new JSONObject();
			info.put("original", originalStatus);
			info.put("current", project.getInt("status"));
			
			//param: projectid, operator, action, entity, title
			ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.PROJECT_STATUS, info);
			
			//通知该project中的所有成员
			ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.PROJECT_STATUS, info);
		}
		if(isSecurityChanged) {
			JSONObject info = new JSONObject();
			info.put("original", originalSecurity);
			info.put("current", project.getInt("security"));
			
			//param: projectid, operator, action, entity, title
			ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.PROJECT_SECURITY, info);
			
			//通知该project中的所有成员
			ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.PROJECT_SECURITY, info);
		}
		
		return buildResponse(OK, project);
	}
	
	@DELETE
	@Path("/{projectid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUserProjects(
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
		
		//获取project基本信息
		String sql = "select " + 
					 "	title " + 
					 "from " + 
					 "	ideaworks.project " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		String project_title = "";
		while(rs_stmt.next()) {
			project_title = rs_stmt.getString("title");
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//设置标志位, 删除project
		sql = "update " +
			 "	ideaworks.project " + 
			 "set " + 
			 "	isDeleted = 1 " + 
			 "where " + 
			 "	id = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//record activity
		JSONObject info = new JSONObject();
		info.put("title", project_title);
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.DELETE, Config.Entity.PROJECT_TITLE, info);
		
		//通知该project中的所有成员
		ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.DELETE, Config.Entity.PROJECT_TITLE, info);
		
		return buildResponse(OK, null);
	}
	
	@DELETE
	@Path("/{projectid}/exit")
	@Produces(MediaType.APPLICATION_JSON)
	public Response exitUserProject(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid) throws Exception
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
		
		//获取user基本信息
		String sql = "select " + 
					 "	id, nickname " + 
					 "from " + 
					 "	ideaworks.user " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		ResultSet rs_stmt = stmt.executeQuery();
		String nickname = "";
		while(rs_stmt.next()) {
			nickname = rs_stmt.getString("nickname");
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//删除project member
		sql = "delete from " +
			 "	ideaworks.project_member " + 
			 "where " + 
			 "	projectid = ? and " + 
			 "	userid = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid, p_userid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//record activity
		JSONObject info = new JSONObject();
		info.put("title", nickname + " (" + p_userid + ")");
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.LEAVE, Config.Entity.PROJECT, info);
		
		//通知该project中的所有成员
		ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.LEAVE, Config.Entity.PROJECT, info);
		
		return buildResponse(OK, null);
	}
}