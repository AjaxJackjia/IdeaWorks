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

@Path("/users/{userid}/projects/{projectid}/topics")
public class ProjectTopicService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(ProjectTopicService.class);

	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getUserProjectTopics(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid) throws Exception
	{
		//check param
		if((p_projectid == 0) && 
		   (p_userid == null || p_userid.equals("")) ) {
			return null;
		}
		
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
					 "	createtime asc";
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
	@Path("/{topicid}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject getUserProjectTopicById(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid) throws Exception
	{
		//check param
		if((p_projectid == 0) && 
		   (p_topicid == 0) && 
		   (p_userid == null || p_userid.equals("")) ) {
			return null;
		}
		
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
					 "	T1.id = ? and " + 
					 "	T1.creator = T2.id ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_topicid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONObject topic = new JSONObject();
	
		while(rs_stmt.next()) {
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
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return topic;
	}
	
	@POST
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject createUserProjectTopics(
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
		
		//1. create topic
		String sql = "insert into " +
					 "	ideaworks.topic (" + 
					 "		projectid, " + 
					 "		title, " + 
					 "		creator, " + 
					 "		createtime, " + 
					 "		modifytime, " + 
					 "		description " + 
					 "	) values ( ?, ?, ?, ?, ?, ? )";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, 
									p_projectid, p_title, p_creator, new Date(), new Date(), p_description);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//2. 返回最新的topic
		sql =
			 "select " + 
			 "	T1.id, " + 
			 "	T1.projectid, " + 
			 "	T1.title, " + 
			 "	T1.creator, " + 
			 "	T1.createtime, " + 
			 "	T1.modifytime, " + 
			 "	T1.description, " + 
			 "	T2.nickname as creatorNickname, " + 
			 "	T2.logo as creatorLogo " + 
			 "from " +
			 "	ideaworks.topic T1, " + 
			 "	ideaworks.user T2 " + 
			 "where " + 
			 "	T1.projectid = ? and " + 
			 "	T1.creator = ? and " + 
			 "	T1.creator = T2.id " + 
			 "order by id desc limit 1 ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid, p_creator);
		ResultSet rs_stmt = stmt.executeQuery();
		
		JSONObject topic = new JSONObject();
		
		while(rs_stmt.next()) {
			topic.put("topicid", rs_stmt.getInt("id"));
			topic.put("projectid", rs_stmt.getInt("projectid"));
			topic.put("title", rs_stmt.getString("title"));
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator"));
			creator.put("nickname", rs_stmt.getString("creatorNickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
			topic.put("creator", creator);
			topic.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			topic.put("modifytime", rs_stmt.getTimestamp("modifytime").getTime());
			topic.put("description", rs_stmt.getString("description"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);

		return topic;
	}
	
	@PUT
	@Path("/{topicid}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject updateUserProjectTopics(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid,
			@FormParam("title") String p_title, 
			@FormParam("creator[userid]") String p_creator,
			@FormParam("description") String p_description ) throws Exception
	{
		//check param
		if((p_projectid == 0) && (p_topicid == 0) && 
		   (p_userid == null || p_userid.equals("")) && 
		   (p_title == null || p_title.equals("")) && 
		   (p_creator == null || p_creator.equals("")) && 
		   (p_description == null || p_description.equals("")) ) {
			return null;
		}
		
		//1. update topic
		String sql = "update " +
					 "	ideaworks.topic " + 
					 "set " + 
					 "	title = ?, " + 
					 "	description = ? " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_title, p_description, p_topicid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//2. 返回修改的topic
		sql = 
			 "select " + 
			 "	T1.id, " + 
			 "	T1.projectid, " + 
			 "	T1.title, " + 
			 "	T1.creator, " + 
			 "	T1.createtime, " + 
			 "	T1.modifytime, " + 
			 "	T1.description, " + 
			 "	T2.nickname as creatorNickname, " + 
			 "	T2.logo as creatorLogo " + 
			 "from " +
			 "	ideaworks.topic T1, " + 
			 "	ideaworks.user T2 " + 
			 "where " + 
			 "	T1.creator = T2.id and " + 
			 "	T1.id = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_topicid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		JSONObject topic = new JSONObject();
		
		while(rs_stmt.next()) {
			topic.put("topicid", rs_stmt.getInt("id"));
			topic.put("projectid", rs_stmt.getInt("projectid"));
			topic.put("title", rs_stmt.getString("title"));
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator"));
			creator.put("nickname", rs_stmt.getString("creatorNickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
			topic.put("creator", creator);
			topic.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			topic.put("modifytime", rs_stmt.getTimestamp("modifytime").getTime());
			topic.put("description", rs_stmt.getString("description"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);

		return topic;
	}
	
	@DELETE
	@Path("/{topicid}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject deleteUserProjectTopics(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid ) throws Exception
	{
		//check param
		if((p_projectid == 0) && 
		   (p_topicid == 0) && 
		   (p_userid == null || p_userid.equals("")) ) {
			return null;
		}
				
		//设置标志位, 删除topic
		String sql = "delete from " +
					 "	ideaworks.topic " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_topicid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return null;
	}
	
	@GET
	@Path("/{topicid}/messages")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getUserProjectTopicsMessages(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid) throws Exception
	{
		//check param
		if((p_projectid == 0) && 
		   (p_topicid == 0) && 
		   (p_userid == null || p_userid.equals("")) ) {
			return null;
		}
				
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
			if(rs_stmt.getString("touser") != null && rs_stmt.getString("touser").length() > 0) {
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
	@Path("/{topicid}/messages/{messageid}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject getUserProjectTopicsMessagesById(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid,
			@PathParam("messageid") int p_messageid ) throws Exception
	{
		//check param
		if((p_projectid == 0) && 
		   (p_topicid == 0) && 
		   (p_messageid == 0) && 
		   (p_userid == null || p_userid.equals("")) ) {
			return null;
		}
		
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
					 "	T1.id = ? and " + 
					 "	T1.topicid = ? ";
		
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_messageid, p_topicid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONObject message = new JSONObject();
		
		while(rs_stmt.next()) {
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
			if(rs_stmt.getString("touser") != null && rs_stmt.getString("touser").length() > 0) {
				touser.put("nickname", rs_stmt.getString("touserNickname"));
				touser.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("touserLogo"));
			}
			message.put("to", touser);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return message;
	}
	
	@POST
	@Path("/{topicid}/messages")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject createUserProjectTopicsMessages(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid,
			@PathParam("messageid") int p_messageid,
			@FormParam("pmessageid") int p_pmessageid, 
			@FormParam("from[userid]") String p_from,
			@FormParam("to[userid]") String p_to,
			@FormParam("msg") String p_msg ) throws Exception
	{
		//check param
		if((p_projectid == 0) && 
		   (p_topicid == 0) && 
		   (p_messageid == 0) && 
		   (p_userid == null || p_userid.equals("")) && 
		   (p_from == null || p_from.equals("")) &&
		   (p_msg == null || p_msg.equals("")) ) {
			return null;
		}
		
		//1. create message
		String sql = "insert into " +
					 "	ideaworks.topic_discussion (" + 
					 "		pid, " + 
					 "		topicid, " + 
					 "		fromuser, " + 
					 "		touser, " + 
					 "		time, " + 
					 "		msg " + 
					 "	) values ( ?, ?, ?, ?, ?, ? )";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, 
									p_pmessageid, p_topicid, p_from, p_to, new Date(), p_msg);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//2. 返回最新的message
		sql = "select " + 
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
			 "	T1.fromuser = ? " + 
			 "order by id desc limit 1 ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_from);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONObject message = new JSONObject();
		
		while(rs_stmt.next()) {
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
			if(rs_stmt.getString("touser") != null && rs_stmt.getString("touser").length() > 0) {
				touser.put("nickname", rs_stmt.getString("touserNickname"));
				touser.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("touserLogo"));
			}
			message.put("to", touser);
		}
		DBUtil.getInstance().closeStatementResource(stmt);

		return message;
	}
	
	@DELETE
	@Path("/{topicid}/messages/{messageid}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject deleteUserProjectTopicsMessages(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid,
			@PathParam("messageid") int p_messageid ) throws Exception
	{
		//check param
		if((p_projectid == 0) && 
		   (p_topicid == 0) && 
		   (p_messageid == 0) && 
		   (p_userid == null || p_userid.equals("")) ) {
			return null;
		}
		
		//删除消息的同时，将满足条件的父信息也删除
		String sql = "delete from " +
					 "	ideaworks.topic_discussion " + 
					 "where " + 
					 "	id = ? or pid = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_messageid, p_messageid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return null;
	}
}