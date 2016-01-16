package com.cityu.iw.api.user.chat;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
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
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;


@Path("/users/{userid}/chat")
public class ChatService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(ChatService.class);
	@Context HttpServletRequest request;
	
	@GET
	@Path("/chatlist")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserChatlist(@PathParam("userid") String p_userid) throws Exception
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
				
		JSONArray list = new JSONArray();
		
			JSONObject chat1 = new JSONObject();
			chat1.put("chatid", "1"); //sort - concat
			chat1.put("title", "jackjia & test chat");
			chat1.put("type", "group");
			chat1.put("userid", "jackjia");
			chat1.put("createtime", 1452435636000l);
			chat1.put("modifytime", 1452435636000l);
			//chat.put("isDeleted", 0);
			
			JSONObject chat2 = new JSONObject();
			chat2.put("chatid", "2");
			chat2.put("title", "test");
			chat2.put("type", "group");
			chat2.put("userid", "jackjia");
			chat2.put("createtime", 1452435636000l);
			chat2.put("modifytime", 1452435636000l);
			//chat.put("isDeleted", 0);
			
			JSONObject chat3 = new JSONObject();
			chat3.put("chatid", "3");
			chat3.put("title", "test-announcement");
			chat3.put("type", "announcement");
			chat3.put("userid", "jackjia");
			chat3.put("createtime", 1452435636000l);
			chat3.put("modifytime", 1452435636000l);
			//chat.put("isDeleted", 0);
			
			list.put(chat1);
			list.put(chat2);
			list.put(chat3);
		
		return buildResponse(OK, list);
	}
}