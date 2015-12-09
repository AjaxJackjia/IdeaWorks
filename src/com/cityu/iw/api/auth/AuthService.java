package com.cityu.iw.api.auth;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.api.BaseService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Util;


@Path("/auth")
public class AuthService extends BaseService {
	@Context HttpServletRequest request;
	
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject getLoginInfo(JSONObject login) throws Exception
	{
		String sql = "select * from ideaworks.user where id = ?";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, login.get("userid"));
		ResultSet rs_stmt = stmt.executeQuery();
		//1. get password from db by id;
		String db_password = "";
		
		while(rs_stmt.next()) {
			db_password = rs_stmt.getString("password");
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//2. validate password && generate token
		if(db_password.equals(login.get("password"))) {
			//generate token by md5 using id and password
			String token = Util.md5(login.get("userid").toString() + login.get("password").toString());
			
			if(token == null) {
				login.put("msg", "token miss match");
				login.put("password", "*******");
			}else{
				login.put("msg", "ok");
				request.getSession().setAttribute("token", token);
				login.put("password", "*******");
			}
		}else{
			login.put("msg", "Username or password incorrect!");
			login.put("password", "*******");
		}
		
		return login;
	}
	
	@POST
	@Path("/password")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject changePassword(
			@FormParam("userid") String p_userid, 
			@FormParam("oldpassword") String p_old_password,
			@FormParam("newpassword") String p_new_password ) throws Exception
	{
		JSONObject result = new JSONObject();
		//check param
		if((p_userid == null || p_userid.equals("")) && 
		   (p_old_password == null || p_old_password.equals("")) && 
		   (p_new_password == null || p_new_password.equals("")) ) {
			result.put("ret", "-1");
			result.put("msg", "parameter invalid");
			return result;
		}
		
		//check old password
		String sql = "select * from ideaworks.user where id = ?";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
		ResultSet rs_stmt = stmt.executeQuery();
		//get password from db by id;
		String db_password = "";
		
		while(rs_stmt.next()) {
			db_password = rs_stmt.getString("password");
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//validate password && generate token
		if(db_password.equals(p_old_password)) {
			sql = "update ideaworks.user set password = ? where id = ? ";
			stmt = DBUtil.getInstance().createSqlStatement(sql, p_new_password, p_userid);
			stmt.execute();
			DBUtil.getInstance().closeStatementResource(stmt);
			
			result.put("ret", "0");
			result.put("msg", "ok");
		}else{
			result.put("ret", "-2");
			result.put("msg", "old password invalid");
		}
		
		return result;
	}
}