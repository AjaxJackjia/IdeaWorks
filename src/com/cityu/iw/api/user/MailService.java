package com.cityu.iw.api.user;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.api.BaseService;
import com.cityu.iw.api.user.chat.ChatService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;
import com.cityu.iw.util.RequestUtil;
import com.cityu.iw.util.mail.MailBean;
import com.cityu.iw.util.mail.MailSender;

@Path("/users/{userid}/mail/")
public class MailService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(MailService.class);
	//email request list
	public static final String EMAIL_REQ_FORGET_PASSWORD 			= "forget-password";
	public static final String EMAIL_REQ_IM_CREATE_GROUP 			= "im-create-group";
	public static final String EMAIL_REQ_IM_CREATE_ANNOUNCEMENT 	= "im-create-announcement";
	
	@Context HttpServletRequest request;
	
	@POST
	@Path(EMAIL_REQ_FORGET_PASSWORD)
	public void sendForgetPasswordMail(
			@PathParam("userid") String p_userid,
			@FormParam("toEmail") String p_toEmail, 
			@FormParam("newPwd") String p_newPwd ) throws Exception
	{
		//check param
		if((p_userid == null || p_userid.equals("")) ||
		   (p_toEmail == null || p_toEmail.equals("")) ||
		   (p_newPwd == null || p_newPwd.equals("")) ) {
			//log
			System.out.println("validate param error!");
		}
		
		//send email
		String title = "[ideaworks] Password reset confirm email";
		String toAddress = p_toEmail;
		StringBuilder content = new StringBuilder();
		content.append("Dear " + p_userid + ", <br/>");
		content.append("You have reset your password. <br/>");
		content.append("The new password is <b>" + p_newPwd + "</b>. <br/>");
		content.append("Please login in IdeaWorks in your new password. Thank you. <br/><br/>");
		content.append("Best Regards, <br/>");
		content.append("IdeaWorks Development Team");
		
		try {
			sendEmail(title, toAddress, content.toString());
			System.out.println(p_userid + " forget password test successfully!");
		} catch (MessagingException e) {
			System.out.println(p_userid + " forget password test error!");
		}
	}
	
	@POST
	@Path(EMAIL_REQ_IM_CREATE_GROUP)
	public void sendIMCreateGroupMail(
			@FormParam("creator") String p_creator,
			@FormParam("title") String p_title, 
			@FormParam("members") String p_members ) throws Exception
	{
		//check param
		if((p_creator == null || p_creator.equals("")) ||
		   (p_title == null || p_title.equals("")) ||
		   (p_members == null || p_members.equals("")) ) {
			//log
			System.out.println("validate param error!");
		}
		
		//send email
		String title = "[ideaworks] Internal Message - New Group Notice";
		JSONArray userinfos = getUserEmails(p_members);
		//get creator info
		JSONObject creator = null;
		for(int index = 0; index<userinfos.length(); index++) {
			JSONObject user = userinfos.getJSONObject(index);
			if(p_creator.equals(user.get("id"))) {
				creator = user;
			}
		}
		
		for(int index = 0; index<userinfos.length(); index++) {
			JSONObject user = userinfos.getJSONObject(index);
			if(user.getString("id").equals(creator.getString("id"))) continue; //若为creator，则不发送通知邮件
			if(Integer.parseInt(user.getString("sync")) == 0) continue; //若用户设置不接收系统邮件，则不发送通知邮件
			
			StringBuilder content = new StringBuilder();
			content.append("Dear " + getNameWithId(user.getString("id"), user.getString("nickname")) + ", <br/>");
			content.append(getNameWithId(creator.getString("id"), creator.getString("nickname")) + " have created an Internal Message Group named <b>" + p_title + "</b>. <br/>");
			content.append("And you have been invited to discuss in it. There are already <b>" + userinfos.length() + "</b> members in it. <br/>");
			content.append("You can login in IdeaWorks to chat with your partners. Thank you. <br/><br/>");
			content.append("Best Regards, <br/>");
			content.append("IdeaWorks Development Team");
			
			try {
				sendEmail(title, user.getString("email"), content.toString());
				LOGGER.info(getNameWithId(user.getString("id"), user.getString("nickname")) + "|" + user.getString("email") + " Internal Message - New Group Notice successfully!");
			} catch (MessagingException e) {
				LOGGER.info(getNameWithId(user.getString("id"), user.getString("nickname")) + "|" + user.getString("email") + " Internal Message - New Group Notice error!");
			}
		}
	}
	
	@POST
	@Path(EMAIL_REQ_IM_CREATE_ANNOUNCEMENT)
	public void sendIMCreateAnnouncementMail(
			@FormParam("creator") String p_creator,
			@FormParam("title") String p_title, 
			@FormParam("tousertype") String p_tousertype,
			@FormParam("content") String p_content ) throws Exception
	{
		//check param
		if((p_creator == null || p_creator.equals("")) ||
		   (p_title == null || p_title.equals("")) ||
		   (p_tousertype == null || p_tousertype.equals("")) || 
		   (p_content == null || p_content.equals("")) ) {
			//log
			System.out.println("validate param error!");
		}
		
		//send email
		String title = "[ideaworks] Internal Message - New Announcement Notice";
		JSONArray userinfos = getUserEmailsByUserType(p_tousertype);
		//get creator info
		JSONObject creator = getCreatorProfile(p_creator);
		
		for(int index = 0; index<userinfos.length(); index++) {
			JSONObject user = userinfos.getJSONObject(index);
			if(user.getString("id").equals(creator.getString("id"))) continue; //若为creator，则不发送通知邮件
			if(Integer.parseInt(user.getString("sync")) == 0) continue; //若用户设置不接收系统邮件，则不发送通知邮件
			
			StringBuilder content = new StringBuilder();
			content.append("Dear " + getNameWithId(user.getString("id"), user.getString("nickname")) + ", <br/>");
			content.append(getNameWithId(creator.getString("id"), creator.getString("nickname")) + " have created an Internal Message Announcement named <b>" + p_title + "</b>. <br/>");
			content.append("The detail of announcement is :<br/>");
			content.append("<div style='white-space: pre-wrap;font-weight: 600;'>" + p_content + "</div> <br/><br/>");
			content.append("You can login in IdeaWorks to check this announcement. Thank you. <br/><br/>");
			content.append("Best Regards, <br/>");
			content.append("IdeaWorks Development Team");
			
			try {
				sendEmail(title, user.getString("email"), content.toString());
				LOGGER.info(getNameWithId(user.getString("id"), user.getString("nickname")) + "|" + user.getString("email") + " Internal Message - New Announcement Notice successfully!");
			} catch (MessagingException e) {
				LOGGER.info(getNameWithId(user.getString("id"), user.getString("nickname")) + "|" + user.getString("email") + " Internal Message - New Announcement Notice error!");
			}
		}
	}
	
	/*
	 * private methods
	 * */
	private String getNameWithId(String id, String nickname) {
		return nickname + " (" + id + ")";
	}
	
	//params: userid is the id of creator
	private JSONObject getCreatorProfile(String userid) throws Exception {
		JSONObject userinfo = new JSONObject();
		String sql = "select id, nickname, email, sync from ideaworks.user where id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, userid);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			userinfo.put("id", rs_stmt.getString("id"));
			userinfo.put("nickname", rs_stmt.getString("nickname"));
			userinfo.put("email", rs_stmt.getString("email"));
			userinfo.put("sync", rs_stmt.getString("sync"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return userinfo;
	}
	
	//params: users is "aaa,bbb,ccc", where aaa,bbb,ccc is userid
	private JSONArray getUserEmails(String users) throws Exception {
		//param handling
		String[] user_array = users.split(",");
		
		String[] sql_placeholder = users.split(",");
		for(int i = 0;i<sql_placeholder.length;i++) {
			sql_placeholder[i] = "?";
		}
		String joined_sql_placeholder = StringUtils.join(sql_placeholder, ",");
		
		JSONArray userinfo = new JSONArray();
		String sql = "select id, nickname, email, sync from ideaworks.user where id in ( " + joined_sql_placeholder + " )";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql);
		for(int index = 0;index<user_array.length;index++) {
			stmt.setObject(index+1, user_array[index]);
		}
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			JSONObject user = new JSONObject();
			user.put("id", rs_stmt.getString("id"));
			user.put("nickname", rs_stmt.getString("nickname"));
			user.put("email", rs_stmt.getString("email"));
			user.put("sync", rs_stmt.getString("sync"));
			
			userinfo.put(user);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return userinfo;
	}
	
	//params: usertype is configed in Config file
	private JSONArray getUserEmailsByUserType(String usertype) throws Exception {
		//param handling
		int type = Integer.parseInt(usertype) < 10 ? Integer.parseInt(usertype) : Config.UserType.OTHERS.getValue();
		
		JSONArray userinfo = new JSONArray();
		String sql = "select id, nickname, email, sync from ideaworks.user where usertype = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, type);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			JSONObject user = new JSONObject();
			user.put("id", rs_stmt.getString("id"));
			user.put("nickname", rs_stmt.getString("nickname"));
			user.put("email", rs_stmt.getString("email"));
			user.put("sync", rs_stmt.getString("sync"));
			
			userinfo.put(user);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return userinfo;
	}
	
	private void sendEmail(String title, String toAddress, String content) throws Exception {
		MailBean mail = new MailBean();
		mail.setToAddress(toAddress);
		mail.setSubject(title);
		mail.setContent(content);
		
		MailSender mailSender = MailSender.getInstance();
		mailSender.send(mail);
	}
}
