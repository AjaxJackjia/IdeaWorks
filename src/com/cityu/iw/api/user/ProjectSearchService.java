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

@Path("/users/{userid}/search")
public class ProjectSearchService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(ProjectSearchService.class);
	@Context HttpServletRequest request;
	
	@GET
	@Path("/projects")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSearchProjects(
			@PathParam("userid") String p_userid,
			@QueryParam("key") String p_search ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || 
		   (p_search == null || p_search.equals(""))) {
			return buildResponse(PARAMETER_INVALID, null);
		}
				
		String sql = "select " + 
					 "	DISTINCT T2.id, " + 
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
					 "	T1.projectid = T2.id and " + 
					 "	T3.id = T2.advisor and " + 
					 "	T4.id = T2.creator and " + 
					 "	T2.isDeleted = 0 and " + 
					 "	(T2.title like CONCAT('%', ? ,'%') or T2.abstract like CONCAT('%', ? ,'%')) " +  
					 "order by " + 
					 "	T2.createtime desc";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_search, p_search);
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
	@Path("/persons")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSearchPersons(
			@PathParam("userid") String p_userid,
			@QueryParam("key") String p_search ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || 
		   (p_search == null || p_search.equals(""))) {
			return buildResponse(PARAMETER_INVALID, null);
		}
				
		//get all relative users
		String sql = "select " + 
					 "	DISTINCT id, " +
					 "	nickname, " +
					 "	signature, " +
					 "	realname, " +
					 "	logo " +
					 "from " + 
					 "	ideaworks.user " +
					 "where " + 
					 "	id like CONCAT('%', ? ,'%') or " + 
					 "	nickname like CONCAT('%', ? ,'%') ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_search, p_search);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONArray members = new JSONArray();
		
		while(rs_stmt.next()) {
			JSONObject member = new JSONObject();
			member.put("userid", rs_stmt.getString("id"));
			member.put("nickname", rs_stmt.getString("nickname"));
			member.put("signature", rs_stmt.getString("signature"));
			member.put("realname", rs_stmt.getString("realname"));
			member.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("logo"));
			
			members.put(member);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return buildResponse(OK, members);
	}
}