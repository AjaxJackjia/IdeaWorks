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
	@Path("/{topicid}/messages")
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
}