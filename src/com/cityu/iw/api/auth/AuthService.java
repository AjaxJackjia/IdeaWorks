package com.cityu.iw.api.auth;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
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
}