package com.cityu.iw.api.user;

import java.io.InputStream;
import java.net.URLDecoder;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

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
	
	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getUserProjects(@PathParam("userid") String p_userid) throws Exception
	{
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
		
		return list;
	}
	
	@GET
	@Path("/{projectid}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject getUserProjectsById(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid) throws Exception
	{
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
		
		return project;
	}
	
	@POST
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject createUserProjects(
			@PathParam("userid") String p_userid,
			@FormParam("title") String p_title, 
			@FormParam("creator[userid]") String p_creator,
			@FormParam("advisor[userid]") String p_advisor ) throws Exception
	{
		//check param
		if((p_title == null || p_title.equals("")) && 
		   (p_creator == null || p_creator.equals("")) && 
		   (p_advisor == null || p_advisor.equals("")) ) {
			return null;
		}
		
		//1. create project
		String sql = "insert into " +
					 "	ideaworks.project (" + 
					 "		title, " + 
					 "		creator, " + 
					 "		advisor, " + 
					 "		abstract, " + 
					 "		security, " + 
					 "		logo, " + 
					 "		createtime, " + 
					 "		modifytime " + 
					 "	) values ( ?, ?, ?, ?, ?, ?, ?, ? )";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, 
									p_title, p_creator, p_advisor, "", 510, "default_prj_logo.jpg", new Date(), new Date());
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//2. 返回最新的project id
		int projectid = 0;
		sql = "select id from ideaworks.project order by id desc limit 1";
		stmt = DBUtil.getInstance().createSqlStatement(sql);
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
		String msg = p_title;
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(projectid, p_userid, msg,
				ProjectActivityService.Action.CREATE, 
				ProjectActivityService.Entity.PROJECT);
				
		return project;
	}
	
	@POST
	@Path("/{projectid}/logo")
	@Consumes(MediaType.MULTIPART_FORM_DATA)  
	public JSONObject updateUserProjectsLogo(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			FormDataMultiPart form ) throws Exception
	{
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
		if((p_projectid == 0) && (p_userid == null || p_userid.equals(""))) {
			return null;
		}
		
		/*
		 * Step 3. 将logo写入server,并删除之前的logo
		 * */
		filename = "prj_" + p_projectid + "_" + filename; //修改文件名使其更符合规范
	    String fileLocation = Config.WEBCONTENT_DIR + Config.PROJECT_IMG_BASE_DIR + URLDecoder.decode(filename, "utf-8");
		boolean writeLFlag = FileUtil.create(fileInputStream, fileLocation);
	    if(!writeLFlag) { //若写入磁盘失败，则直接返回空
			return null;
		}
	    
	    String sqlSelect = "select logo from ideaworks.project where id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sqlSelect, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			String preLogoPath = Config.WEBCONTENT_DIR + Config.PROJECT_IMG_BASE_DIR + rs_stmt.getString("logo");
			FileUtil.delete(preLogoPath); //删除之前的logo
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
		
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(p_projectid, p_userid, "",
				ProjectActivityService.Action.UPDATE,
				ProjectActivityService.Entity.LOGO);
		
		return logoObj;
	}
	
	@PUT
	@Path("/{projectid}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject updateUserProjects(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@FormParam("title") String p_title, 
			@FormParam("abstractContent") String p_abstract, 
			@FormParam("advisor[userid]") String p_advisor) throws Exception
	{
		//1. 更新project
		String sql = "update " +
					 "	ideaworks.project " + 
					 "set " + 
					 "	title = ?, " + 
					 "	abstract = ?, " + 
					 "	advisor = ? " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, 
									p_title, p_abstract, p_advisor, p_projectid);
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
		
		//record activity
		String msg = p_title;
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(p_projectid, p_userid, msg,
				ProjectActivityService.Action.UPDATE, 
				ProjectActivityService.Entity.ADVISOR_ABSTRACT);
				
		return project;
	}
	
	@DELETE
	@Path("/{projectid}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject deleteUserProjects(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid) throws Exception
	{
		//设置标志位, 删除project
		String sql = "update " +
					 "	ideaworks.project " + 
					 "set " + 
					 "	isDeleted = 1 " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return null;
	}
}