package com.cityu.iw.api.user;

import java.io.InputStream;
import java.net.URLDecoder;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
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
		//检索p_userid参与的项目
		String sql_join = "select projectid from ideaworks.project_member where userid = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql_join, p_userid);
		ResultSet rs_stmt = stmt.executeQuery();
		HashSet<Integer> userJoinedProjects = new HashSet<Integer>();
		while(rs_stmt.next()) {
			userJoinedProjects.add(rs_stmt.getInt("projectid"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//检索包含关键字的项目
		String sql_search = 
					 "select " + 
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
					 "	ideaworks.project T2, " + 
					 "	ideaworks.user T3, " + 
					 "	ideaworks.user T4 " + 
					 "where " + 
					 "	T3.id = T2.advisor and " + 
					 "	T4.id = T2.creator and " + 
					 "	T2.isDeleted = 0 and " + 
					 "	(T2.title like CONCAT('%', ? ,'%') or T2.abstract like CONCAT('%', ? ,'%')) " +  
					 "order by " + 
					 "	T2.createtime desc "; 
		stmt = DBUtil.getInstance().createSqlStatement(sql_search, p_search, p_search);
		rs_stmt = stmt.executeQuery();
		JSONArray list = new JSONArray();
		while(rs_stmt.next()) {
			JSONObject project = new JSONObject();
			
			//当project对外公开时,可以被检索发现,但是不能查看具体内容
			project.put("projectid", rs_stmt.getInt("id"));
			project.put("title", rs_stmt.getString("title"));
			project.put("status", rs_stmt.getInt("status"));
			project.put("security", rs_stmt.getInt("security"));
			project.put("logo", Config.PROJECT_IMG_BASE_DIR + rs_stmt.getString("logo"));
			project.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			project.put("modifytime", rs_stmt.getTimestamp("modifytime").getTime());
			project.put("userJoinStatus", userJoinedProjects.contains(rs_stmt.getInt("id")));
			
			list.put(project);
			
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return buildResponse(OK, list);
	}
	
	@GET
	@Path("/projects/{projectid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSearchProjectsById(
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
		
		/*
		 * 当project为公开或者该用户已参与时,detailed info才会返回
		 * */
		//检索p_userid是否参与项目p_projectid
		String sql_join = "select projectid from ideaworks.project_member where userid = ? and projectid = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql_join, p_userid, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		boolean isUserJoined = false;
		while(rs_stmt.next()) {
			isUserJoined = true;
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//检索项目p_projectid信息
		String sql_search = 
					 "select " + 
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
					 "	ideaworks.project T2, " + 
					 "	ideaworks.user T3, " + 
					 "	ideaworks.user T4 " + 
					 "where " + 
					 "	T2.id = ? and " + 
					 "	T3.id = T2.advisor and " + 
					 "	T4.id = T2.creator and " + 
					 "	T2.isDeleted = 0 " + 
					 "order by " + 
					 "	T2.createtime desc "; 
		stmt = DBUtil.getInstance().createSqlStatement(sql_search, p_projectid);
		rs_stmt = stmt.executeQuery();
		JSONObject project = new JSONObject();
		while(rs_stmt.next()) {
			project.put("projectid", rs_stmt.getInt("id"));
			project.put("title", rs_stmt.getString("title"));
			project.put("status", rs_stmt.getInt("status"));
			project.put("security", rs_stmt.getInt("security"));
			project.put("logo", Config.PROJECT_IMG_BASE_DIR + rs_stmt.getString("logo"));
			project.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			project.put("modifytime", rs_stmt.getTimestamp("modifytime").getTime());

			int security = rs_stmt.getInt("security");
			if(security == 0 || isUserJoined) { //0为project公开
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
			}
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return buildResponse(OK, project);
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
	
	@GET
	@Path("/persons/{personid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSearchPersonsById(
			@PathParam("userid") String p_userid,
			@PathParam("personid") String p_personid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) || 
		   (p_personid == null || p_personid.equals(""))) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//确定检索者与person之间是何种身份
		//privacy 规则：
		//	是否只对自己可见 -> 0
		//	是否只对project advisor可见 -> 1
		//	是否只对project member可见 -> 2
		//	是否公开所有人可见 -> 3
		String sql_previous = 
				"SELECT " + 
				"	T1.userid as current_userid, " + 
				"	T2.userid as search_userid, " + 
				"	T3.advisor as advisor " + 
				"FROM  " + 
				"	ideaworks.project_member T1, " + 
				"	ideaworks.project_member T2, " + 
				"	ideaworks.project T3 " + 
				"WHERE  " + 
				"	T1.projectid = T2.projectid and " + 
				"	T3.id = T1.projectid and " + 
				"	T1.userid = ? and " + 
				"	T2.userid = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql_previous, p_userid, p_personid);
		ResultSet rs_stmt = stmt.executeQuery();
		int certification = 0;
		while(rs_stmt.next()) {
			certification = 2;
			String current_userid = rs_stmt.getString("current_userid");
			String advisor = rs_stmt.getString("advisor");
			if(current_userid.equals(advisor)) {
				certification = 1;
				break;
			}
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//获取person的所有信息
		String sql = "select * from ideaworks.user where id = ?";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_personid);
		rs_stmt = stmt.executeQuery();
		JSONObject user = new JSONObject();
		while(rs_stmt.next()) {
			user.put("userid", rs_stmt.getString("id"));
			user.put("nickname", rs_stmt.getString("nickname"));
			user.put("signature", rs_stmt.getString("signature"));
			user.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("logo"));
			user.put("usertype", UserService.getUserType( rs_stmt.getInt("usertype") ));
			
			int privacy = rs_stmt.getInt("privacy");
			boolean own_privacy = (p_personid.equals(p_userid) && privacy == 0);	// ==> 自己对自己可见
			boolean advisor_privacy = (certification == 1 && privacy == 1); 		// ==> 只对project advisor可见
			boolean member_privacy = ((certification == 1 || certification == 2) && privacy == 2); 	// ==> 只对project member(advisor也属于member)可见
			boolean public_privacy = (privacy == 3);								// ==> 公开信息,所有人可见
			if( own_privacy || advisor_privacy || member_privacy || public_privacy ) { 
				user.put("realname", rs_stmt.getString("realname"));
				user.put("phone", rs_stmt.getString("phone"));
				user.put("email", rs_stmt.getString("email"));
				user.put("skype", rs_stmt.getString("skypeid"));
				user.put("wechat", rs_stmt.getString("wechatid"));
				user.put("major", rs_stmt.getString("major"));
				user.put("department", rs_stmt.getString("department"));
				user.put("college", rs_stmt.getString("college"));
				user.put("address", rs_stmt.getString("address"));
				user.put("introduction", rs_stmt.getString("introduction"));
				user.put("interests", rs_stmt.getString("interests"));
			}
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return buildResponse(OK, user);
	}
}