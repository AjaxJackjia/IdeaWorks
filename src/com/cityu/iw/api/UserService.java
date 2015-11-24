package com.cityu.iw.api;

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

import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;


@Path("/users")
public class UserService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(UserService.class);
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getUsers() throws Exception
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
			user.put("realname", rs_stmt.getString("realname"));
			user.put("phone", rs_stmt.getString("phone"));
			user.put("email", rs_stmt.getString("email"));
			user.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("logo"));
			user.put("usertype", rs_stmt.getInt("usertype"));
			user.put("major", rs_stmt.getString("major"));
			user.put("department", rs_stmt.getString("department"));
			user.put("college", rs_stmt.getString("college"));
			user.put("address", rs_stmt.getString("address"));
			user.put("introduction", rs_stmt.getString("introduction"));
			user.put("interests", rs_stmt.getString("interests"));
			user.put("interests", rs_stmt.getString("isDeleted"));
			
			list.put(user);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return list;
	}
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject getUsersById(@PathParam("id") String p_id) throws Exception
	{
		String sql = "select * from ideaworks.user where id = ?";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_id);
		ResultSet rs_stmt = stmt.executeQuery();
		
		JSONObject user = new JSONObject();
		
		while(rs_stmt.next()) {
			user.put("userid", rs_stmt.getString("id"));
			user.put("nickname", rs_stmt.getString("nickname"));
			user.put("signature", rs_stmt.getString("signature"));
			user.put("realname", rs_stmt.getString("realname"));
			user.put("phone", rs_stmt.getString("phone"));
			user.put("email", rs_stmt.getString("email"));
			user.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("logo"));
			user.put("usertype", rs_stmt.getInt("usertype"));
			user.put("major", rs_stmt.getString("major"));
			user.put("department", rs_stmt.getString("department"));
			user.put("college", rs_stmt.getString("college"));
			user.put("address", rs_stmt.getString("address"));
			user.put("introduction", rs_stmt.getString("introduction"));
			user.put("interests", rs_stmt.getString("interests"));
			user.put("interests", rs_stmt.getString("isDeleted"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return user;
	}
	
	/*
	 * user center - dashboard view requests
	 * */
	@GET
	@Path("/{userid}/dashboardbrief")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject getUserDashboardBrief(@PathParam("userid") String p_userid) throws Exception
	{
		JSONObject brief = new JSONObject();
		
		brief.put("projectNo", 22);
		brief.put("activityNo", 102);
		brief.put("relatedMemberNo", 234);
		brief.put("forumParticipationNo", 500);
		
		return brief;
	}
	
	@GET
	@Path("/{userid}/populartopics")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getPopularTopics(@PathParam("userid") String p_userid) throws Exception
	{
		JSONArray list = new JSONArray();
		
		for(int i = 0;i<10;i++) {
			JSONObject topic = new JSONObject();
			
			topic.put("topicid", i);
			topic.put("projectid", i);
			topic.put("title", "test title " + i);
			topic.put("creator", "jackjia");
			topic.put("participantNo", Math.ceil(Math.random() * 100.0));
			topic.put("messageNo", Math.ceil(Math.random() * 100.0));
			
			list.put(topic);
		}
		
		return list;
	}
	
	@GET
	@Path("/{userid}/recentactivities")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getRecentActivities(@PathParam("userid") String p_userid) throws Exception
	{
		JSONArray list = new JSONArray();
		
		for(int i = 0;i<10;i++) {
			JSONObject activity = new JSONObject();
			
			activity.put("activityid", i);
			activity.put("title", "Test activity " + i);
			activity.put("operator", "jackjia");
			
			list.put(activity);
		}
		
		return list;
	}
	
	/*
	 * user center - projects view requests
	 * */
	@GET
	@Path("/{userid}/projects")
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
	
	@POST
	@Path("/{userid}/projects")
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
					 "	) values ( ?, ?, ?, ?, ?, ?, ? )";
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
		
		return project;
	}
	
	@PUT
	@Path("/{userid}/projects")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject updateUserProjects(
			@PathParam("userid") String p_userid,
			@FormParam("projectid") int p_projectid,
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
		
		return project;
	}
	
	@DELETE
	@Path("/{userid}/projects/{projectid}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject deleteUserProjects(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid) throws Exception
	{
		System.out.println(p_projectid);
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
	
	@GET
	@Path("/{userid}/projects/{projectid}/members")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getUserProjectMembers(@PathParam("userid") String p_userid, @PathParam("projectid") int p_projectid) throws Exception
	{
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
		
		return members;
	}
	
	@GET
	@Path("/{userid}/projects/{projectid}/milestones")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getUserProjectMilestones(@PathParam("userid") String p_userid, @PathParam("projectid") int p_projectid) throws Exception
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
					 "	time desc";
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
	@Path("/{userid}/projects/{projectid}/topics")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getUserProjectTopics(@PathParam("userid") String p_userid, @PathParam("projectid") int p_projectid) throws Exception
	{
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.projectid, " + 
					 "	T1.title, " + 
					 "	T1.creator, " + 
					 "	T1.createtime, " + 
					 "	T1.description, " + 
					 "	T2.nickname as creatorNickname, " + 
					 "	T2.logo as creatorLogo " + 
					 "from " +
					 "	ideaworks.topic T1, " + 
					 "	ideaworks.user T2 " + 
					 "where " + 
					 "	T1.projectid = ? and " + 
					 "	T1.creator = T2.id " + 
					 "order by " + 
					 "	createtime desc";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONArray topics = new JSONArray();
	
		while(rs_stmt.next()) {
			JSONObject topic = new JSONObject();
			topic.put("topicid", rs_stmt.getInt("id"));
			topic.put("projectid", rs_stmt.getInt("projectid"));
			topic.put("title", rs_stmt.getString("title"));
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator"));
			creator.put("nickname", rs_stmt.getString("creatorNickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
			topic.put("creator", creator);
			topic.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			topic.put("description", rs_stmt.getString("description"));

			topics.put(topic);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return topics;
	}
	
	@GET
	@Path("/{userid}/projects/{projectid}/topics/{topicid}/messages")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getUserProjectTopicsMessages(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid) throws Exception
	{
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.pid, " + 
					 "	T1.topicid, " + 
					 "	T1.msg, " + 
					 "	T1.fromuser, " + 
					 "	T1.touser, " + 
					 "	T1.time, " + 
					 "	T2.nickname as fromuserNickname, " + 
					 "	T2.logo as fromuserLogo, " + 
					 "	T3.nickname as touserNickname, " + 
					 "	T3.logo as touserLogo " + 
					 "from " +
					 "	( " + 
					 "		ideaworks.user as T2 " +
					 "	 		right join " + 
					 "		ideaworks.topic_discussion T1 " + 
					 "			on T1.fromuser = T2.id" + 
					 "	) left join " + 
					 "		ideaworks.user T3 " + 
					 "	  on T1.touser = T3.id " + 
					 "where " + 
					 "	T1.topicid = ? " + 
					 "order by " + 
					 "	T1.time asc";
		
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_topicid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONArray messages = new JSONArray();
	
		while(rs_stmt.next()) {
			JSONObject message = new JSONObject();
			message.put("messageid", rs_stmt.getInt("id"));
			message.put("pmessageid", rs_stmt.getInt("pid"));
			message.put("topicid", rs_stmt.getInt("topicid"));
			message.put("projectid", p_projectid);
			message.put("msg", rs_stmt.getString("msg"));
			message.put("time", rs_stmt.getTimestamp("time").getTime());
			
			JSONObject fromuser = new JSONObject();
			fromuser.put("userid", rs_stmt.getString("fromuser"));
			fromuser.put("nickname", rs_stmt.getString("fromuserNickname"));
			fromuser.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("fromuserLogo"));
			message.put("from", fromuser);
			
			JSONObject touser = new JSONObject();
			touser.put("userid", rs_stmt.getString("touser"));
			if(rs_stmt.getString("touser").length() > 0) {
				touser.put("nickname", rs_stmt.getString("touserNickname"));
				touser.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("touserLogo"));
			}
			message.put("to", touser);
			
			messages.put(message);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return messages;
	}
	
	@GET
	@Path("/{userid}/projects/{projectid}/files")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getUserProjectFiles(@PathParam("userid") String p_userid, @PathParam("projectid") int p_projectid) throws Exception
	{
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.projectid, " + 
					 "	T1.filename, " + 
					 "	T1.creator, " + 
					 "	T1.createtime, " + 
					 "	T1.description, " + 
					 "	T2.nickname as creatorNickname, " + 
					 "	T2.logo as creatorLogo " + 
					 "from " +
					 "	ideaworks.file T1, " + 
					 "	ideaworks.user T2 " + 
					 "where " + 
					 "	T1.projectid = ? and " + 
					 "	T1.creator = T2.id " + 
					 "order by " + 
					 "	createtime desc";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONArray files = new JSONArray();
	
		while(rs_stmt.next()) {
			JSONObject file = new JSONObject();
			file.put("fileid", rs_stmt.getInt("id"));
			file.put("projectid", rs_stmt.getInt("projectid"));
			file.put("filename", rs_stmt.getString("filename"));
			file.put("url", Config.PROJECT_FILE_BASE_DIR + rs_stmt.getString("filename"));
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator"));
			creator.put("nickname", rs_stmt.getString("creatorNickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
			file.put("creator", creator);
			file.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			file.put("description", rs_stmt.getString("description"));

			files.put(file);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return files;
	}
	
	@GET
	@Path("/{userid}/projects/{projectid}/activities")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getUserProjectActivities(@PathParam("userid") String p_userid, @PathParam("projectid") int p_projectid) throws Exception
	{
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.projectid, " + 
					 "	T1.title, " + 
					 "	T1.operator, " + 
					 "	T1.time, " + 
					 "	T2.nickname as operatorNickname, " + 
					 "	T2.logo as operatorLogo " + 
					 "from " +
					 "	ideaworks.activity T1, " + 
					 "	ideaworks.user T2 " + 
					 "where " + 
					 "	T1.projectid = ? and " + 
					 "	T1.operator = T2.id " + 
					 "order by " + 
					 "	time desc";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONArray activities = new JSONArray();
	
		while(rs_stmt.next()) {
			JSONObject activity = new JSONObject();
			activity.put("activityid", rs_stmt.getInt("id"));
			activity.put("projectid", rs_stmt.getInt("projectid"));
			activity.put("title", rs_stmt.getString("title"));
			JSONObject operator = new JSONObject();
			operator.put("userid", rs_stmt.getString("operator"));
			operator.put("nickname", rs_stmt.getString("operatorNickname"));
			operator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("operatorLogo"));
			activity.put("operator", operator);
			activity.put("time", rs_stmt.getTimestamp("time").getTime());

			activities.put(activity);
		}
		DBUtil.getInstance().closeStatementResource(stmt);

		return activities;
	}
}