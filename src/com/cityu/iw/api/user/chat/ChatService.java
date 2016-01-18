package com.cityu.iw.api.user.chat;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.api.BaseService;
import com.cityu.iw.api.user.UserService;
import com.cityu.iw.api.user.project.ProjectActivityService;
import com.cityu.iw.api.user.project.ProjectNotificationService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;


@Path("/users/{userid}/chats")
public class ChatService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(ChatService.class);
	private static final int BULK_INSERTER_NO = 50;
	private static final String DEFAULT_CREATE_CHAT_MSG = "DEFAULT_CREATE_CHAT_MSG";
	@Context HttpServletRequest request;
	
	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserChatlistRequest(@PathParam("userid") String p_userid) throws Exception
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
					 "	T1.id, " + 
					 "	T1.type, " + 
					 "	T1.title, " + 
					 "	T1.createtime, " + 
					 "	T1.lastmodifytime, " + 
					 "	T1.tousertype " + 
					 "from " +
					 "	ideaworks.im_chat T1, " + 
					 "	ideaworks.im_chat_user T2 " + 
					 "where " + 
					 "	T1.id = T2.chatid and " + 
					 "	T2.userid = ? and " +
					 "	T1.isDeleted = 0 " +
					 "order by " + 
					 "	lastmodifytime asc";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONArray list = new JSONArray();
	
		while(rs_stmt.next()) {
			JSONObject chat = new JSONObject();
			chat.put("chatid", rs_stmt.getInt("id"));
			chat.put("title", rs_stmt.getString("title"));
			chat.put("type", rs_stmt.getString("type"));
			chat.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			chat.put("lastmodifytime", rs_stmt.getTimestamp("lastmodifytime").getTime());
			chat.put("tousertype", UserService.getUserType(rs_stmt.getInt("tousertype")));
	
			list.put(chat);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
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
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals(""))) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.type, " + 
					 "	T1.title, " + 
					 "	T1.createtime, " + 
					 "	T1.lastmodifytime, " + 
					 "	T1.tousertype " + 
					 "from " +
					 "	ideaworks.im_chat T1, " + 
					 "	ideaworks.im_chat_user T2 " + 
					 "where " + 
					 "	T1.id = T2.chatid and " + 
					 "	T2.userid = ? and " +
					 "	T2.chatid = ? and " + 
					 "	T1.isDeleted = 0 ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid, p_chatid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONObject chat = new JSONObject();
	
		while(rs_stmt.next()) {
			chat.put("chatid", rs_stmt.getInt("id"));
			chat.put("title", rs_stmt.getString("title"));
			chat.put("type", rs_stmt.getString("type"));
			chat.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			chat.put("lastmodifytime", rs_stmt.getTimestamp("lastmodifytime").getTime());
			chat.put("tousertype", UserService.getUserType(rs_stmt.getInt("tousertype")));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return buildResponse(OK, chat);
	}
	
	@POST
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createChat(
			@PathParam("userid") String p_userid,
			@FormParam("type") String p_type, 
			@FormParam("title") String p_title, 
			@FormParam("tousertype") int p_tousertype,
			@FormParam("members") String p_members ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_title == null || p_title.equals("")) ||
		   (p_userid == null || p_userid.equals("")) ||
		   (p_type == null || p_type.equals("")) ||
		   (p_members == null || p_members.equals("")) ) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//1. 创建chat
		String sql = "insert into " +
					 "	ideaworks.im_chat (" + 
					 "		type, " + 
					 "		title, " + 
					 "		tousertype " + 
					 "	) values ( ?, ?, ? )";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_type, p_title, p_tousertype);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//2. 返回最新的chat
		JSONObject chat = new JSONObject();
		sql = "select * from ideaworks.im_chat where type = ? and title = ? and tousertype = ? order by createtime desc limit 1";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_type, p_title, p_tousertype);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			chat.put("chatid", rs_stmt.getInt("id"));
			chat.put("title", rs_stmt.getString("title"));
			chat.put("type", rs_stmt.getString("type"));
			chat.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			chat.put("lastmodifytime", rs_stmt.getTimestamp("lastmodifytime").getTime());
			chat.put("tousertype", UserService.getUserType(rs_stmt.getInt("tousertype")));
		}
		DBUtil.getInstance().closeStatementResource(stmt);

		//3. 添加chat成员
		String[] members = p_members.split(",");
		sql = "insert into " +
			  "	ideaworks.im_chat_user (" + 
			  "		chatid, " + 
			  "		userid " + 
			  "	) values ( ?, ? )";
		stmt = DBUtil.getInstance().createSqlStatement(sql);
		for(int i = 0;i<members.length;i++) {
			stmt.setObject(1, chat.getInt("chatid"));
			stmt.setObject(2, members[i]);
			stmt.addBatch();
			
			if(i%BULK_INSERTER_NO == 0 || i == members.length - 1) {
				stmt.executeBatch();
			}
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//4. “创建chat”消息
		createMessage(chat.getInt("chatid"), p_userid, DEFAULT_CREATE_CHAT_MSG);
	
		return buildResponse(OK, chat);
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
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if(p_userid == null || p_userid.equals("")) {
			return buildResponse(PARAMETER_INVALID, null);
		}

		//删除chat, 更新标志位
		String sql = "update from " +
					 "	ideaworks.im_chat " + 
					 "set " + 
					 "	isDeleted = 1 " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_chatid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
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
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals(""))) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//1. 标记chat信息为已读
		markChatMessageRead(p_userid, p_chatid);
		
		//2. 获取chat信息
		String sql = "select " + 
					 "	T1.id, " + 
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
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONArray messages = new JSONArray();
	
		while(rs_stmt.next()) {
			JSONObject message = new JSONObject();
			
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator_id"));
			creator.put("nickname", rs_stmt.getString("creator_nickname"));
			creator.put("logo", rs_stmt.getString("creator_logo"));
			
			message.put("msgid", rs_stmt.getInt("id"));
			message.put("creator", creator);
			message.put("msg", rs_stmt.getString("msg"));
			message.put("time", rs_stmt.getTimestamp("time").getTime());
	
			messages.put(message);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
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
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if((p_userid == null || p_userid.equals("")) ||
		   (p_msg == null || p_msg.equals("")) ) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		//创建消息
		createMessage(p_chatid, p_userid, p_msg);
		
		return buildResponse(OK, null);
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
			return buildResponse(TOKEN_INVALID, null);
		}
		
		//check param
		if(p_userid == null || p_userid.equals("")) {
			return buildResponse(PARAMETER_INVALID, null);
		}

		//删除chat message, 标记messsage已删除标识为1
		String sql = "update from " +
					 "	ideaworks.im_msg " + 
					 "set " + 
					 "	isDeleted = 1 " + 
					 "where " + 
					 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_messageid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return null;
	}
	
	/*
	 * private internal functions
	 * */
	private void createMessage(int chatid, String creator, String msg) throws SQLException
	{
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
		
		sql = "select * from ideaworks.im_msg where chatid = ? and creator = ? and msg = ? order by time desc limit 1";
		stmt = DBUtil.getInstance().createSqlStatement(sql, chatid, creator, msg);
		int current_msgid = 0;
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
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
			  "		chatid, " + 
			  "		userid " + 
			  "	) values ( ?, ? )";
		stmt = DBUtil.getInstance().createSqlStatement(sql);
		for(int i = 0;i<members.size();i++) {
			stmt.setObject(1, current_msgid);
			stmt.setObject(2, members.get(i));
			stmt.addBatch();
			
			if(i%BULK_INSERTER_NO == 0 || i == members.size() - 1) {
				stmt.executeBatch();
			}
		}
		DBUtil.getInstance().closeStatementResource(stmt);
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