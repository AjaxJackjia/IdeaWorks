package com.cityu.iw.api.user;

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


@Path("/users/{userid}/projects/{projectid}/milestones")
public class ProjectMilestoneService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(ProjectMilestoneService.class);
	
	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getUserProjectMilestones(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid) throws Exception
	{
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
		
		return milestones;
	}
	
	@GET
	@Path("/{milestoneid}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject getUserProjectMilestoneById(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid,
			@PathParam("milestoneid") int p_milestoneid) throws Exception
	{
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
		
		return milestone;
	}
	
	@POST
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject createUserProjectMilestones(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@FormParam("title") String p_title, 
			@FormParam("creator[userid]") String p_creator,
			@FormParam("description") String p_description ) throws Exception
	{
		//check param
		if((p_projectid == 0) && 
		   (p_title == null || p_title.equals("")) && 
		   (p_creator == null || p_creator.equals("")) && 
		   (p_description == null || p_description.equals("")) ) {
			return null;
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

		return milestone;
	}
	
	@PUT
	@Path("/{mielstoneid}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject updateUserProjectMiletones(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@PathParam("mielstoneid") int p_mielstoneid,
			@FormParam("title") String p_title, 
			@FormParam("creator[userid]") String p_creator,
			@FormParam("description") String p_description ) throws Exception
	{
		//check param
		if((p_projectid == 0) && 
		   (p_title == null || p_title.equals("")) && 
		   (p_creator == null || p_creator.equals("")) && 
		   (p_description == null || p_description.equals("")) ) {
			return null;
		}
		
		//1. update milestone
		String sql = "update " +
					 "	ideaworks.milestone " + 
					 "set " + 
					 "	title = ?, " + 
					 "	description = ? " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_title, p_description, p_mielstoneid);
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

		return milestone;
	}
	
	@DELETE
	@Path("/{milestoneid}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject deleteUserProjectMilestones(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@PathParam("milestoneid") int p_milestoneid ) throws Exception
	{
		//设置标志位, 删除milestone
		String sql = "delete from " +
					 "	ideaworks.milestone " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_milestoneid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return null;
	}
}