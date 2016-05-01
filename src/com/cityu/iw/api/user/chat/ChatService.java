package com.cityu.iw.api.user.chat;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
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
import javax.ws.rs.core.UriInfo;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.api.BaseService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;
import com.cityu.iw.util.RequestUtil;
import com.cityu.iw.util.Util;


@Path("/users/{userid}/chats")
public class ChatService extends BaseService {
	private static final String CURRENT_SERVICE = "ChatService";
	private static final Log FLOW_LOGGER = LogFactory.getLog("FlowLog");
	private static final Log ERROR_LOGGER = LogFactory.getLog("ErrorLog");
	
	private static final int BULK_INSERTER_NO = 50;
	private static final String DEFAULT_CREATE_CHAT_MSG = "DEFAULT_CREATE_CHAT_MSG";
	private static final String DEFAULT_EXIT_CHAT_MSG = "DEFAULT_EXIT_CHAT_MSG";
	
	private static final String CHATTYPE_GROUP = "group";
	private static final String CHATTYPE_ANNOUNCEMENT = "announcement";
	
	private static final int USERTYPE_ALL = 666;
	private static final int USERTYPE_STUDENT = 0;
	private static final int USERTYPE_FACULTY = 1;
	private static final int USERTYPE_INDUSTRICAL_PARTITIPANT = 2;
	private static final int USERTYPE_GOVERNMENT = 3;
	private static final int USERTYPE_OTHER = 4;
	
	@Context HttpServletRequest request;
	@Context UriInfo uriInfo;
	
	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserChatlist(@PathParam("userid") String p_userid) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserChatlist token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals(""))) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserChatlist parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.type, " + 
					 "	T1.title, " + 
					 "	T1.creator as creator_id, " +
					 "	T3.nickname as creator_nickname, " +
					 "	T3.logo as creator_logo, " +
					 "	T1.createtime, " + 
					 "	T1.lastmodifytime, " + 
					 "	T1.tousertype " + 
					 "from " +
					 "	ideaworks.im_chat T1, " + 
					 "	ideaworks.im_chat_user T2, " +
					 "	ideaworks.user T3 " +
					 "where " + 
					 "	T1.id = T2.chatid and " + 
					 "	T2.userid = ? and " +
					 "	T1.isDeleted = 0 and " +
					 "	T1.creator = T3.id " +
					 "order by " + 
					 "	lastmodifytime asc";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONArray list = new JSONArray();
		ArrayList<String> chatids = new ArrayList<String>();
	
		while(rs_stmt.next()) {
			//chat id
			chatids.add(rs_stmt.getString("id"));
			
			//chat info
			JSONObject chat = new JSONObject();
			
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator_id"));
			creator.put("nickname", rs_stmt.getString("creator_nickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creator_logo"));
			
			chat.put("chatid", rs_stmt.getInt("id"));
			chat.put("type", rs_stmt.getString("type"));
			chat.put("title", rs_stmt.getString("title"));
			chat.put("creator", creator);
			chat.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			chat.put("lastmodifytime", rs_stmt.getTimestamp("lastmodifytime").getTime());
			chat.put("tousertype", rs_stmt.getInt("tousertype"));
	
			list.put(chat);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//获取每个chat的未读信息数量
		ArrayList<String> sql_placeholder = new ArrayList<String>(chatids);
		for(int i = 0;i<sql_placeholder.size();i++) {
			sql_placeholder.set(i, "?");
		}
		String joined_sql_placeholder = StringUtils.join(sql_placeholder, ",");
		sql ="select " + 
			 "	T1.chatid, " + 
			 "	count(T1.chatid) as unread " + 
			 "from " +
			 "	ideaworks.im_msg T1, " + 
			 "	ideaworks.im_msg_user T2 " +
			 "where " + 
			 "	T1.id = T2.msgid and " + 
			 "	T2.userid = ? and " +
			 "	T2.isread = 0 and " + 
			 "	T1.chatid in ( " + joined_sql_placeholder + " ) " + 
			 "group by " +
			 "	T1.chatid ";
			 
		stmt = DBUtil.getInstance().createSqlStatement(sql);
		stmt.setObject(1, p_userid);
		for(int i = 0;i<sql_placeholder.size();i++) {
			stmt.setObject(2 + i, chatids.get(i));
		}
		rs_stmt = stmt.executeQuery();
	
		HashMap<Integer, Integer> chatUnreadCount = new HashMap<Integer, Integer>();
		while(rs_stmt.next()) {
			chatUnreadCount.put(rs_stmt.getInt("chatid"), rs_stmt.getInt("unread"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		for(int index = 0;index<list.length();index++) {
			int currentChatid = list.getJSONObject(index).getInt("chatid");
			if(chatUnreadCount.containsKey(currentChatid)) {
				list.getJSONObject(index).put("unread", chatUnreadCount.get(currentChatid));
			}else{
				list.getJSONObject(index).put("unread", 0);
			}
		}
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserChatlist success"));
		return buildResponse(OK, list);
	}
	
	@GET
	@Path("/{chatid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserChatById(
			@PathParam("userid") String p_userid,
			@PathParam("chatid") int p_chatid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserChatById token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals(""))) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserChatById parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.type, " + 
					 "	T1.title, " + 
					 "	T1.creator as creator_id, " +
					 "	T3.nickname as creator_nickname, " +
					 "	T3.logo as creator_logo, " +
					 "	T1.createtime, " + 
					 "	T1.lastmodifytime, " + 
					 "	T1.tousertype " + 
					 "from " +
					 "	ideaworks.im_chat T1, " + 
					 "	ideaworks.im_chat_user T2, " + 
					 "	ideaworks.user T3 " +
					 "where " + 
					 "	T1.id = T2.chatid and " + 
					 "	T2.userid = ? and " +
					 "	T2.chatid = ? and " + 
					 "	T1.isDeleted = 0 and " + 
					 "	T1.creator = T3.id ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid, p_chatid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONObject chat = new JSONObject();
	
		while(rs_stmt.next()) {
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator_id"));
			creator.put("nickname", rs_stmt.getString("creator_nickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creator_logo"));
			
			chat.put("chatid", rs_stmt.getInt("id"));
			chat.put("type", rs_stmt.getString("type"));
			chat.put("title", rs_stmt.getString("title"));
			chat.put("creator", creator);
			chat.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			chat.put("lastmodifytime", rs_stmt.getTimestamp("lastmodifytime").getTime());
			chat.put("tousertype", rs_stmt.getInt("tousertype"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "chatid: " + p_chatid, "getUserChatById success"));
		return buildResponse(OK, chat);
	}
	
	@POST
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createChat(
			@PathParam("userid") String p_userid,
			@FormParam("type") String p_type, 
			@FormParam("title") String p_title, 
			@FormParam("members") String p_members,
			@FormParam("isViaEmail") boolean p_isViaEmail,
			@FormParam("tousertype") int p_tousertype,
			@FormParam("content") String p_content ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "createChat token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) ||
		   (p_type == null || p_type.equals("") || (!p_type.equals("group") && !p_type.equals("announcement"))) || 
		   (p_title == null || p_title.equals("")) ) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "createChat parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//check specific param
		if(p_type.equals(CHATTYPE_GROUP) && (p_members == null || p_members.equals(""))) //群聊 chat
		{ 
			return buildResponse(PARAMETER_INVALID, null);
		}
		else 
		if(p_type.equals(CHATTYPE_ANNOUNCEMENT) && (p_content == null || p_content.equals(""))) //公告 chat
		{
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//创建对应类型的chat
		JSONObject chat = null;
		if(p_type.equals(CHATTYPE_GROUP)) {
			chat = createGroup(p_userid, p_title, p_members);
			
			//send email to user
			if(p_isViaEmail && chat.getInt("chatid") > 0) {
				HashMap<String, String> params = new HashMap<String, String>();
				params.put("creator", p_userid);
				params.put("title", p_title);
				params.put("members", p_members);
				RequestUtil.postWithoutResult(uriInfo.getBaseUri().toURL() + "users/" + p_userid + "/mail/im-create-group", params);
			}
		}
		else if(p_type.equals(CHATTYPE_ANNOUNCEMENT))
		{
			chat = createAnnouncement(p_userid, p_title, p_tousertype, p_content);
			//send email to user
			if(p_isViaEmail && chat.getInt("chatid") > 0) {
				HashMap<String, String> params = new HashMap<String, String>();
				params.put("creator", p_userid);
				params.put("title", p_title);
				params.put("tousertype", String.valueOf(p_tousertype));
				params.put("content", p_content);
				RequestUtil.postWithoutResult(uriInfo.getBaseUri().toURL() + "users/" + p_userid + "/mail/im-create-announcement", params);
			}
		}
	
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "chatid: " + chat.getInt("chatid"), "createChat success"));
		return buildResponse(OK, chat);
	}
	
	//创建group
	private JSONObject createGroup(String currentUserid, String title, String members) throws Exception {
		//1. 创建chat
		String sql = "insert into " +
					 "	ideaworks.im_chat (" + 
					 "		type, " + 
					 "		title, " + 
					 "		creator " + 
					 "	) values ( ?, ?, ? )";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, CHATTYPE_GROUP, title, currentUserid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//2. 最新的chat
		JSONObject chat = new JSONObject();
		sql ="select " + 
			 "	T1.id, " + 
			 "	T1.type, " + 
			 "	T1.title, " + 
			 "	T1.creator as creator_id, " +
			 "	T2.nickname as creator_nickname, " +
			 "	T2.logo as creator_logo, " +
			 "	T1.createtime, " + 
			 "	T1.lastmodifytime, " + 
			 "	T1.tousertype " + 
			 "from " +
			 "	ideaworks.im_chat T1, " + 
			 "	ideaworks.user T2 " +
			 "where " + 
			 "	T1.type = ? and " + 
			 "	T1.title = ? and " +
			 "	T1.isDeleted = 0 and " + 
			 "	T1.creator = T2.id " + 
			 "order by " + 
			 "	createtime desc " + 
			 "limit 1";
		stmt = DBUtil.getInstance().createSqlStatement(sql, CHATTYPE_GROUP, title);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator_id"));
			creator.put("nickname", rs_stmt.getString("creator_nickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creator_logo"));
			
			chat.put("chatid", rs_stmt.getInt("id"));
			chat.put("type", rs_stmt.getString("type"));
			chat.put("title", rs_stmt.getString("title"));
			chat.put("creator", creator);
			chat.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			chat.put("lastmodifytime", rs_stmt.getTimestamp("lastmodifytime").getTime());
			chat.put("tousertype", rs_stmt.getInt("tousertype"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);

		//3. 添加chat成员
		String[] userids = members.split(",");
		sql = "insert into " +
			  "	ideaworks.im_chat_user (" + 
			  "		chatid, " + 
			  "		userid " + 
			  "	) values ( ?, ? )";
		stmt = DBUtil.getInstance().createSqlStatement(sql);
		for(int i = 0;i<userids.length;i++) {
			stmt.setObject(1, chat.getInt("chatid"));
			stmt.setObject(2, userids[i]);
			stmt.addBatch();
			
			if(i%BULK_INSERTER_NO == 0 || i == userids.length - 1) {
				stmt.executeBatch();
			}
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//4. “创建chat”消息
		createMessage(chat.getInt("chatid"), currentUserid, DEFAULT_CREATE_CHAT_MSG);
		
		//5. 返回最新的chat
		return chat;
	}
	
	//创建announcement
	private JSONObject createAnnouncement(String currentUserid, String title, int tousertype, String content) throws Exception {
		//1. 创建chat
		String sql = "insert into " +
					 "	ideaworks.im_chat (" + 
					 "		type, " + 
					 "		title, " + 
					 "		creator, " +
					 "		tousertype " +
					 "	) values ( ?, ?, ?, ? )";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, CHATTYPE_ANNOUNCEMENT, title, currentUserid, tousertype);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//2. 最新的chat
		JSONObject chat = new JSONObject();
		sql ="select " + 
			 "	T1.id, " + 
			 "	T1.type, " + 
			 "	T1.title, " + 
			 "	T1.creator as creator_id, " +
			 "	T2.nickname as creator_nickname, " +
			 "	T2.logo as creator_logo, " +
			 "	T1.createtime, " + 
			 "	T1.lastmodifytime, " + 
			 "	T1.tousertype " + 
			 "from " +
			 "	ideaworks.im_chat T1, " + 
			 "	ideaworks.user T2 " +
			 "where " + 
			 "	T1.type = ? and " + 
			 "	T1.title = ? and " +
			 "	T1.tousertype = ? and " +
			 "	T1.isDeleted = 0 and " + 
			 "	T1.creator = T2.id " + 
			 "order by " + 
			 "	createtime desc " + 
			 "limit 1";
		stmt = DBUtil.getInstance().createSqlStatement(sql, CHATTYPE_ANNOUNCEMENT, title, tousertype);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator_id"));
			creator.put("nickname", rs_stmt.getString("creator_nickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creator_logo"));
			
			chat.put("chatid", rs_stmt.getInt("id"));
			chat.put("type", rs_stmt.getString("type"));
			chat.put("title", rs_stmt.getString("title"));
			chat.put("creator", creator);
			chat.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			chat.put("lastmodifytime", rs_stmt.getTimestamp("lastmodifytime").getTime());
			chat.put("tousertype", rs_stmt.getInt("tousertype"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);

		//3. 获取对应类型的chat成员
		switch(tousertype) {
		case USERTYPE_ALL: 
			sql = "select distinct id from ideaworks.user";
			break;
		case USERTYPE_STUDENT:
			sql = "select distinct id from ideaworks.user where usertype = " + USERTYPE_STUDENT;
			break;
		case USERTYPE_FACULTY:
			sql = "select distinct id from ideaworks.user where usertype = " + USERTYPE_FACULTY;
			break;
		case USERTYPE_INDUSTRICAL_PARTITIPANT:
			sql = "select distinct id from ideaworks.user where usertype = " + USERTYPE_INDUSTRICAL_PARTITIPANT;
			break;
		case USERTYPE_GOVERNMENT:
			sql = "select distinct id from ideaworks.user where usertype = " + USERTYPE_GOVERNMENT;
			break;
		case USERTYPE_OTHER:
			sql = "select distinct id from ideaworks.user where usertype = " + USERTYPE_OTHER;
			break;
		default: 
			sql = "select distinct id from ideaworks.user";
			break;
		}
		stmt = DBUtil.getInstance().createSqlStatement(sql);
		rs_stmt = stmt.executeQuery();
		ArrayList<String> userids = new ArrayList<String>();
		while(rs_stmt.next()) {
			userids.add(rs_stmt.getString("id"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		//将当前发送者也加入到通知队列 (若已存在，则不添加)
		if(!userids.contains(currentUserid)) {
			userids.add(currentUserid);
		}
		
		//4. 添加chat成员
		sql = "insert into " +
			  "	ideaworks.im_chat_user (" + 
			  "		chatid, " + 
			  "		userid " + 
			  "	) values ( ?, ? )";
		stmt = DBUtil.getInstance().createSqlStatement(sql);
		for(int i = 0;i<userids.size();i++) {
			stmt.setObject(1, chat.getInt("chatid"));
			stmt.setObject(2, userids.get(i));
			stmt.addBatch();
			
			if(i%BULK_INSERTER_NO == 0 || i == userids.size() - 1) {
				stmt.executeBatch();
			}
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//5. “创建chat”消息 - announcement
		createMessage(chat.getInt("chatid"), currentUserid, content);
		
		//6. 返回最新的chat
		return chat;
	}
	
	@DELETE
	@Path("/{chatid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUserChat(
			@PathParam("userid") String p_userid,
			@PathParam("chatid") int p_chatid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "deleteUserChat token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if(p_userid == null || p_userid.equals("")) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "deleteUserChat parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}

		//在im_chat_user表中删除user与chat对应关系其实就是用户删除chat
		String sql = "delete from " +
					 "	ideaworks.im_chat_user " + 
					 "where " + 
					 "	chatid = ? and userid = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_chatid, p_userid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//统计chat人数
		int count = 0;
		sql = 	 "select " +
				 "	count(*) as num " + 
				 "from " + 
				 "	ideaworks.im_chat_user " + 
				 "where " + 
				 "	chatid = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_chatid);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			count = rs_stmt.getInt("num");
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//当im_chat_user中没有im_chat的chat对应的user时，设置im_chat的chat deleted为1
		if(count == 0) {
			sql = 	 "update " +
					 "	ideaworks.im_chat " + 
					 "set " + 
					 "	isDeleted = 1 " + 
					 "where " + 
					 "	id = ? ";
			stmt = DBUtil.getInstance().createSqlStatement(sql, p_chatid);
			stmt.execute();
			DBUtil.getInstance().closeStatementResource(stmt);
		}
		
		//4.“退出chat”消息
		createMessage(p_chatid, p_userid, DEFAULT_EXIT_CHAT_MSG);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "chatid: " + p_chatid, "deleteUserChat success"));
		return null;
	}
	
	@GET
	@Path("/{chatid}/messages")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserChatMessages(
			@PathParam("userid") String p_userid,
			@PathParam("chatid") int p_chatid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserChatMessages token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals(""))) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserChatMessages parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//1. 标记chat信息为已读
		markChatMessageRead(p_userid, p_chatid);
		
		//2. 获取chat信息
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.chatid, " + 
					 "	T1.creator as creator_id, " + 
					 "	T2.nickname as creator_nickname, " + 
					 "	T2.logo as creator_logo, " + 
					 "	T1.msg, " + 
					 "	T1.time " + 
					 "from " +
					 "	ideaworks.im_msg T1, " + 
					 "	ideaworks.user T2 " + 
					 "where " + 
					 "	T1.chatid = ? and " +
					 "	T1.creator = T2.id and " + 
					 "	T1.isDeleted = 0 " +
					 "order by " + 
					 "	time asc";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_chatid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONArray messages = new JSONArray();
	
		while(rs_stmt.next()) {
			JSONObject message = new JSONObject();
			
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator_id"));
			creator.put("nickname", rs_stmt.getString("creator_nickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creator_logo"));
			
			message.put("msgid", rs_stmt.getInt("id"));
			message.put("chatid", rs_stmt.getInt("chatid"));
			message.put("creator", creator);
			message.put("msg", rs_stmt.getString("msg"));
			message.put("time", rs_stmt.getTimestamp("time").getTime());
	
			messages.put(message);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "chatid: " + p_chatid, "getUserChatMessages success"));
		return buildResponse(OK, messages);
	}
	
	@POST
	@Path("/{chatid}/messages")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createChatMessage(
			@PathParam("userid") String p_userid,
			@PathParam("chatid") int p_chatid,
			@FormParam("msg") String p_msg ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "createChatMessage token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) ||
		   (p_msg == null || p_msg.equals("")) ) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "createChatMessage parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//创建消息
		JSONObject msg = createMessage(p_chatid, p_userid, p_msg);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "chatid: " + p_chatid, "createChatMessage success"));
		return buildResponse(OK, msg);
	}
	
	@DELETE
	@Path("/{chatid}/messages/{messageid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUserChatMessageById(
			@PathParam("userid") String p_userid,
			@PathParam("chatid") int p_chatid,
			@PathParam("messageid") int p_messageid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "deleteUserChatMessageById token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if(p_userid == null || p_userid.equals("")) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "deleteUserChatMessageById parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}

		//删除chat message, 标记messsage已删除标识为1
		String sql = "update " +
					 "	ideaworks.im_msg " + 
					 "set " + 
					 "	isDeleted = 1 " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_messageid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "chatid: " + p_chatid, "deleteUserChatMessageById success"));
		return null;
	}
	
	@GET
	@Path("/{chatid}/members")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserChatMembers(
			@PathParam("userid") String p_userid,
			@PathParam("chatid") int p_chatid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserChatMembers token invalid!"));
			
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals(""))) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "getUserChatMembers parameter invalid!"));
			
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//获取chat members
		String sql = "select " + 
					 "	T2.userid, " + 
					 "	T3.nickname, " + 
					 "	T3.logo " + 
					 "from " +
					 "	ideaworks.im_chat T1, " + 
					 "	ideaworks.im_chat_user T2, " + 
					 "	ideaworks.user T3 " + 
					 "where " + 
					 "	T1.id = ? and " +
					 "	T1.id = T2.chatid and " +
					 "	T2.userid = T3.id and " +
					 "	T1.isDeleted = 0 ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_chatid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONArray members = new JSONArray();
	
		while(rs_stmt.next()) {
			JSONObject member = new JSONObject();
			member.put("userid", rs_stmt.getString("userid"));
			member.put("nickname", rs_stmt.getString("nickname"));
			member.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("logo"));
			
			members.put(member);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "chatid: " + p_chatid, "getUserChatMembers success"));
		return buildResponse(OK, members);
	}
	
	/*
	 * private internal functions
	 * */
	private JSONObject createMessage(int chatid, String creator, String msg) throws Exception
	{
		JSONObject returnMsg = new JSONObject();
		
		//1. 创建消息
		String sql = "insert into " +
					  "	ideaworks.im_msg (" + 
					  "		chatid, " + 
					  "		creator, " + 
					  "		msg " + 
					  "	) values ( ?, ?, ? )";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, chatid, creator, msg);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		sql= "select " + 
			 "	T1.id, " + 
			 "	T1.chatid, " + 
			 "	T1.creator as creator_id, " + 
			 "	T2.nickname as creator_nickname, " + 
			 "	T2.logo as creator_logo, " + 
			 "	T1.msg, " + 
			 "	T1.time " + 
			 "from " +
			 "	ideaworks.im_msg T1, " + 
			 "	ideaworks.user T2 " + 
			 "where " + 
			 "	T1.chatid = ? and " +
			 "	T1.creator = ? and " + 
			 "	T1.msg = ? and " + 
			 "	T1.creator = T2.id and " + 
			 "	T1.isDeleted = 0 " +
			 "order by " + 
			 "	time desc " + 
			 "limit 1";
		stmt = DBUtil.getInstance().createSqlStatement(sql, chatid, creator, msg);
		int current_msgid = 0;
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			JSONObject creatorObj = new JSONObject();
			creatorObj.put("userid", rs_stmt.getString("creator_id"));
			creatorObj.put("nickname", rs_stmt.getString("creator_nickname"));
			creatorObj.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creator_logo"));
			
			returnMsg.put("msgid", rs_stmt.getInt("id"));
			returnMsg.put("chatid", rs_stmt.getInt("chatid"));
			returnMsg.put("creator", creatorObj);
			returnMsg.put("msg", rs_stmt.getString("msg"));
			returnMsg.put("time", rs_stmt.getTimestamp("time").getTime());
			
			current_msgid = rs_stmt.getInt("id");
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//2. 获取chat成员
		ArrayList<String> members = new ArrayList<String>();
		sql = "select userid from ideaworks.im_chat_user where chatid = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, chatid);
		rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			members.add(rs_stmt.getString("userid"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//3. 发送消息给chat成员
		sql = "insert into " +
			  "	ideaworks.im_msg_user (" + 
			  "		msgid, " + 
			  "		userid, " +
			  "		isread " +
			  "	) values ( ?, ?, ? )";
		stmt = DBUtil.getInstance().createSqlStatement(sql);
		for(int i = 0;i<members.size();i++) {
			stmt.setObject(1, current_msgid);
			stmt.setObject(2, members.get(i));
			stmt.setObject(3, members.get(i).equals(creator) ? 1 : 0); //creator的消息为已读，其他人为未读
			stmt.addBatch();
			
			if(i%BULK_INSERTER_NO == 0 || i == members.size() - 1) {
				stmt.executeBatch();
			}
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//4. 修改chat的最近修改时间
		sql = "update " +
			  "	ideaworks.im_chat " + 
			  "set " + 
			  "	lastmodifytime = ? " + 
			  "where " + 
			  "	id = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, new Date(), chatid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return returnMsg;
	}
	
	private void markChatMessageRead(String p_userid, int p_chatid) throws SQLException
	{
		//mark chat message read
		String sql = "update " +
					 "	ideaworks.im_msg_user " + 
					 "set " + 
					 "	isread = 1 " + 
					 "where " + 
					 "	userid = ? and " + 
					 "	msgid in ( " + 
					 "		select id from ideaworks.im_msg where chatid = ? " + 
					 "	) ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid, p_chatid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
	}
}