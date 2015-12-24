package com.cityu.iw.api.user;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
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
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.api.BaseService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;

@Path("/users/{userid}/projects/{projectid}/topics")
public class ProjectTopicService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(ProjectTopicService.class);
	@Context HttpServletRequest request;
	
	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserProjectTopics(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_projectid == 0) || (p_userid == null || p_userid.equals("")) ) {
			return buildResponse(PARAMETER_INVALID, null);
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
		
		return buildResponse(OK, topics);
	}
	
	@GET
	@Path("/{topicid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserProjectTopicById(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_projectid == 0) || (p_topicid == 0) ||
		   (p_userid == null || p_userid.equals("")) ) {
			return buildResponse(PARAMETER_INVALID, null);
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
		
		return buildResponse(OK, topic);
	}
	
	@POST
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createUserProjectTopics(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@FormParam("title") String p_title, 
			@FormParam("creator[userid]") String p_creator,
			@FormParam("description") String p_description ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_projectid == 0) || 
		   (p_userid == null || p_userid.equals("")) ||
		   (p_title == null || p_title.equals("")) || 
		   (p_creator == null || p_creator.equals("")) ) {
			return buildResponse(PARAMETER_INVALID, null);
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

		//record activity
		JSONObject info = new JSONObject();
		info.put("title", p_title);
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.CREATE, Config.Entity.TOPIC, info);
		
		//通知该project中的所有成员
		ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.CREATE, Config.Entity.TOPIC, info);
		
		return buildResponse(OK, topic);
	}
	
	@PUT
	@Path("/{topicid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateUserProjectTopics(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid,
			@FormParam("title") String p_title, 
			@FormParam("creator[userid]") String p_creator,
			@FormParam("description") String p_description ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_projectid == 0) || 
		   (p_userid == null || p_userid.equals("")) ||
		   (p_title == null || p_title.equals("")) || 
		   (p_creator == null || p_creator.equals("")) ) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//0. 拉取topic,用以对比属性是否发生变化
		boolean isTitleChanged = false, isDescriptionChanged = false;
		String originalTitle = "";
		
		String sql = "select * from ideaworks.topic where id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_topicid);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			isTitleChanged = !rs_stmt.getString("title").equals(p_title);
			isDescriptionChanged = !rs_stmt.getString("description").equals(p_description);
			
			originalTitle = rs_stmt.getString("title");
		}
		DBUtil.getInstance().closeStatementResource(stmt);
				
		//1. update topic
		sql = "update " +
			 "	ideaworks.topic " + 
			 "set " + 
			 "	title = ?, " + 
			 "	description = ? " + 
			 "where " + 
			 "	id = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_title, p_description, p_topicid);
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
		rs_stmt = stmt.executeQuery();
		
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

		//record activity
		if(isTitleChanged) {
			JSONObject info = new JSONObject();
			info.put("original", originalTitle);
			info.put("current", p_title);
			info.put("title", p_title);
			
			//param: projectid, operator, action, entity, title
			ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.TOPIC_TITLE, info);
			
			//通知该project中的所有成员
			ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.TOPIC_TITLE, info);
		}
		if(isDescriptionChanged) {
			JSONObject info = new JSONObject();
			info.put("title", p_title);
			
			//param: projectid, operator, action, entity, title
			ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.TOPIC_DESCRIPTION, info);
			
			//通知该project中的所有成员
			ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.UPDATE, Config.Entity.TOPIC_DESCRIPTION, info);
		}
		
		return buildResponse(OK, topic);
	}
	
	@DELETE
	@Path("/{topicid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUserProjectTopics(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_projectid == 0) || (p_topicid == 0) ||
		   (p_userid == null || p_userid.equals("")) ) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//查询topic
		String msg = "";
		String sql = 
				 "select " + 
				 " * " + 
				 "from " +
				 "	ideaworks.topic " + 
				 "where " + 
				 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_topicid);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			msg = rs_stmt.getString("title");
		}
		
		//设置标志位, 删除topic
		sql = "delete from " +
			 "	ideaworks.topic " + 
			 "where " + 
			 "	id = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_topicid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//record activity
		JSONObject info = new JSONObject();
		info.put("title", msg);
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.DELETE, Config.Entity.TOPIC, info);
		
		//通知该project中的所有成员
		ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.DELETE, Config.Entity.TOPIC, info);
		
		return null;
	}
	
	@GET
	@Path("/{topicid}/messages")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserProjectTopicsMessages(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_projectid == 0) || (p_topicid == 0) ||
		   (p_userid == null || p_userid.equals("")) ) {
			return buildResponse(PARAMETER_INVALID, null);
		}
				
		//Step 1. get all topic first level message
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
					 "	T1.topicid = ? and " +
					 "	T1.pid = 0 " + //只过滤一级消息
					 "order by " + 
					 "	T1.time asc";
		
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_topicid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//filter messages
		ArrayList<Integer> filterMsgs = new ArrayList<Integer>();
		
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
			
			//add filtered message
			filterMsgs.add(rs_stmt.getInt("id"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//Step 2. collect first level message replies number
		sql = "select " + 
			 "	pid, " + 
			 "	count(pid) as count " + 
			 "from " +
			 "	ideaworks.topic_discussion " + 
			 "where " + 
			 "	topicid = ? and " +
			 "	pid in (select id from ideaworks.topic_discussion where topicid = ? and pid = 0) " + //过滤二级消息（父消息以一级消息为基准）
			 "group by " + 
			 "	pid ";
	
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_topicid, p_topicid);
		rs_stmt = stmt.executeQuery();
		HashMap<Integer, Integer> pid_sub_msg_count = new HashMap<Integer, Integer>();
		while(rs_stmt.next()) {
			pid_sub_msg_count.put(rs_stmt.getInt("pid"), rs_stmt.getInt("count"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//Step 3. manage return result
		for(int index = 0;index<messages.length();index++) {
			JSONObject message = messages.getJSONObject(index);
			int messageid = Integer.parseInt(message.get("messageid").toString());
			message.put("replyCount", (pid_sub_msg_count.get(messageid)==null) ? 0 : pid_sub_msg_count.get(messageid));
		}
		
		return buildResponse(OK, messages);
	}
	
	@GET
	@Path("/{topicid}/messages/{messageid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserProjectTopicsMessagesById(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid,
			@PathParam("messageid") int p_messageid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_projectid == 0) || (p_topicid == 0) ||
		   (p_messageid == 0) || (p_userid == null || p_userid.equals("")) ) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		// Step 1. retrieve message detail info
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
		
		// Step 2. get message reply list
		sql = "select " + 
			 "	count(id) as count " + 
			 "from " +
			 "	ideaworks.topic_discussion " + 
			 "where " + 
			 "	pid = ? and " + 
			 "	topicid = ? " +
			 "group by pid";
	
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_messageid, p_topicid);
		rs_stmt = stmt.executeQuery();
		
		//result
		while(rs_stmt.next()) {
			message.put("replyCount", rs_stmt.getInt("count"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		if(!message.has("replyCount")) {
			message.put("replyCount", 0);
		}
		
		return buildResponse(OK, message);
	}
	
	@GET
	@Path("/{topicid}/messages/{messageid}/replylist")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserProjectTopicsMessagesReplyListById(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid,
			@PathParam("messageid") int p_messageid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_projectid == 0) || (p_topicid == 0) ||
		   (p_messageid == 0) || (p_userid == null || p_userid.equals("")) ) {
			return buildResponse(PARAMETER_INVALID, null);
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
					 "	T1.pid = ? and " + 
					 "	T1.topicid = ? " + 
					 "order by " + 
					 "	T1.time asc ";
	
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_messageid, p_topicid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONArray replyList = new JSONArray();
		
		while(rs_stmt.next()) {
			JSONObject reply = new JSONObject();
			reply.put("messageid", rs_stmt.getInt("id"));
			reply.put("pmessageid", rs_stmt.getInt("pid"));
			reply.put("topicid", rs_stmt.getInt("topicid"));
			reply.put("projectid", p_projectid);
			reply.put("msg", rs_stmt.getString("msg"));
			reply.put("time", rs_stmt.getTimestamp("time").getTime());
			
			JSONObject fromuser = new JSONObject();
			fromuser.put("userid", rs_stmt.getString("fromuser"));
			fromuser.put("nickname", rs_stmt.getString("fromuserNickname"));
			fromuser.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("fromuserLogo"));
			reply.put("from", fromuser);
			
			JSONObject touser = new JSONObject();
			touser.put("userid", rs_stmt.getString("touser"));
			if(rs_stmt.getString("touser") != null && rs_stmt.getString("touser").length() > 0) {
				touser.put("nickname", rs_stmt.getString("touserNickname"));
				touser.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("touserLogo"));
			}
			reply.put("to", touser);
			
			replyList.put(reply);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return buildResponse(OK, replyList);
	}
	
	@POST
	@Path("/{topicid}/messages")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createUserProjectTopicsMessages(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid,
			@FormParam("pmessageid") int p_pmessageid, 
			@FormParam("from[userid]") String p_from,
			@FormParam("to[userid]") String p_to,
			@FormParam("msg") String p_msg ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_projectid == 0) || (p_topicid == 0) ||
		   (p_userid == null || p_userid.equals("")) || 
		   (p_from == null || p_from.equals("")) ||
		   (p_msg == null || p_msg.equals("")) ) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		if(p_to == null) {
			p_to = "";
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

		//通知被回复的用户
		JSONObject info = new JSONObject();
		sql = "select * from ideaworks.topic where id = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_topicid);
		rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			info.put("topicid", rs_stmt.getString("id"));
			info.put("topic_title", rs_stmt.getString("title"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		String operator = p_from;
		if(p_to.equals("")) { //p_to为空说明为父消息,需要通知该topic下的所有一级消息发送者
			info.put("msg", message.getString("msg"));
			ProjectNotificationService.notifyProjectTopicAllMembers(
					p_projectid, operator, Config.Action.REPLY, Config.Entity.MESSAGE, info);
		}else{ //p_to不为空说明为子消息,需要通知该topic下的特定消息发送者
			//获取回复的父消息msg
			sql = "select msg from ideaworks.topic_discussion where id = ? ";
			stmt = DBUtil.getInstance().createSqlStatement(sql, message.getInt("pmessageid"));
			rs_stmt = stmt.executeQuery();
			while(rs_stmt.next()) {
				info.put("pmessageid", message.getInt("pmessageid"));
				info.put("pmsg", rs_stmt.getString("msg")); //查询的父消息内容
				info.put("msg", message.getString("msg"));
			}
			DBUtil.getInstance().closeStatementResource(stmt);
			
			ProjectNotificationService.notifyProjectTopicCertainMember(
					p_projectid, operator, Config.Action.REPLY, Config.Entity.MESSAGE, info);
		}
		
		return buildResponse(OK, message);
	}
	
	@DELETE
	@Path("/{topicid}/messages/{messageid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUserProjectTopicsMessages(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid,
			@PathParam("topicid") int p_topicid,
			@PathParam("messageid") int p_messageid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_projectid == 0) || (p_topicid == 0) || (p_messageid == 0) ||
		   (p_userid == null || p_userid.equals("")) ) {
			return buildResponse(PARAMETER_INVALID, null);
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