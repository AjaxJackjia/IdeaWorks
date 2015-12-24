package com.cityu.iw.api.user;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

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
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.api.BaseService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;
import com.sun.jersey.api.representation.Form;


@Path("/users/{userid}/projects/{projectid}/members")
public class ProjectMemberService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(ProjectMemberService.class);
	@Context HttpServletRequest request;
	
	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserProjectMembers(
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
				
		//get creator and advisor
		String sql = "select creator, advisor from ideaworks.project where id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		String creator = "", advisor = "";
		while(rs_stmt.next()) {
			creator = rs_stmt.getString("creator");
			advisor = rs_stmt.getString("advisor");
		}
		
		//get all relative users
		sql = "select " + 
				 "	T2.id, " +
				 "	T2.nickname, " +
				 "	T2.signature, " +
				 "	T2.realname, " +
				 "	T2.logo, " +
				 "	T1.jointime " +
				 "from " + 
				 "	ideaworks.project_member T1, " +
				 "	ideaworks.user T2 " +
				 "where " + 
				 "	T1.projectid = ? and " + 
				 "	T1.userid = T2.id ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		rs_stmt = stmt.executeQuery();
		
		//result
		JSONArray members = new JSONArray();
		
		while(rs_stmt.next()) {
			JSONObject member = new JSONObject();
			member.put("userid", rs_stmt.getString("id"));
			member.put("nickname", rs_stmt.getString("nickname"));
			member.put("signature", rs_stmt.getString("signature"));
			member.put("realname", rs_stmt.getString("realname"));
			member.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("logo"));
			member.put("jointime", rs_stmt.getTimestamp("jointime").getTime());
			member.put("advisor", false);
			member.put("creator", false);
			if(creator.equals(rs_stmt.getString("id"))) {
				member.put("creator", true);
			}
			if(advisor.equals(rs_stmt.getString("id"))) {
				member.put("advisor", true);
			}
			
			members.put(member);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return buildResponse(OK, members);
	}
	
	@POST
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response addUserProjectMembers(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			Form form) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//返回结果
		JSONArray members = new JSONArray();
		
		//检查参数
		if(form.isEmpty() || p_projectid <= 0 || p_userid == null || p_userid.equals("")) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//更新project_member表
		String sql = "insert into " +
					 "	ideaworks.project_member (" + 
					 "		projectid, " + 
					 "		userid, " + 
					 "		jointime " + 
					 "	) values ( ?, ?, ?)";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql);
		
		Iterator<String> ite = form.keySet().iterator();
		ArrayList<String> newMembers = new ArrayList<String>();
		while(ite.hasNext()) {
			String wrapper = "'";
			String key = (String) ite.next();
			String userid = form.getFirst(key);
			newMembers.add(wrapper + userid + wrapper);
			
			stmt.setObject(1, p_projectid);
			stmt.setObject(2, userid);
			stmt.setObject(3, new Date());
			stmt.execute();
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//返回结果
		sql = "select " + 
			 "	T2.id, " +
			 "	T2.nickname, " +
			 "	T2.signature, " +
			 "	T2.realname, " +
			 "	T2.logo, " +
			 "	T1.jointime " +
			 "from " + 
			 "	ideaworks.project_member T1, " +
			 "	ideaworks.user T2 " +
			 "where " + 
			 "	T1.projectid = ? and " + 
			 "	T1.userid = T2.id and " + 
			 "	T1.userid in (" + StringUtils.join(newMembers, ",") + ") ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			JSONObject member = new JSONObject();
			member.put("userid", rs_stmt.getString("id"));
			member.put("nickname", rs_stmt.getString("nickname"));
			member.put("signature", rs_stmt.getString("signature"));
			member.put("realname", rs_stmt.getString("realname"));
			member.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("logo"));
			member.put("jointime", rs_stmt.getTimestamp("jointime").getTime());
			member.put("advisor", false);
			member.put("creator", false);
			
			members.put(member);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//record activity
		ArrayList<String> users = new ArrayList<String>();
		for(int index = 0;index<members.length();index++) {
			JSONObject member = (JSONObject) members.get(index);
			users.add((String) member.get("nickname") + "(" + (String) member.get("userid") + ")");
		}
		JSONObject info = new JSONObject();
		info.put("title", StringUtils.join(users, ", "));
		
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.ADD, Config.Entity.MEMEBER, info);
		
		//通知该project中的所有成员
		ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.ADD, Config.Entity.MEMEBER, info);
		
		return buildResponse(OK, members);
	}
}