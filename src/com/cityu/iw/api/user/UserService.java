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
}