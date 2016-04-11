package com.cityu.iw.api;

import java.net.URL;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Util;


public class BaseService
{
	private static final String SESSION_PRIVATE_KEY = "IdeaWorks";
	public static final int OK = 1;
	public static final int PARAMETER_INVALID = 2;
	public static final int TOKEN_INVALID = 3;
	public static final int INTERNAL_ERROR = 4;
	
    public Response buildResponse(int responseType, Object p_result) throws JSONException
    {
    	ResponseBuilder builder = null;
    	
    	switch(responseType)
    	{
    	case OK:
    		if(p_result == null) {
    			JSONObject ok_response = new JSONObject();
        		ok_response.put("ret", "200");
        		ok_response.put("msg", "ok");
        		builder = Response.status(Status.OK).entity(ok_response).type("application/json");
    		}else{
    			builder = Response.status(Status.OK).entity(p_result).type("application/json");
    		}
    		break;
    	case PARAMETER_INVALID:
    		JSONObject parameter_invalid = new JSONObject();
    		parameter_invalid.put("ret", "400");
    		parameter_invalid.put("msg", "Parameter invalid!");
    		builder = Response.status(Status.BAD_REQUEST).entity(parameter_invalid).type("application/json");
    		break;
    	case TOKEN_INVALID:
    		JSONObject token_invalid = new JSONObject();
    		token_invalid.put("ret", "401");
    		token_invalid.put("msg", "Session time out!");
    		builder = Response.status(Status.UNAUTHORIZED).entity(token_invalid).type("application/json");
    		break;
    	case INTERNAL_ERROR:
    		JSONObject internal_error = new JSONObject();
    		internal_error.put("ret", "500");
    		internal_error.put("msg", "Server busy!");
    		builder = Response.status(Status.INTERNAL_SERVER_ERROR).entity(internal_error).type("application/json");
    		break;
    	default:
    		JSONObject ok_response = new JSONObject();
    		ok_response.put("ret", "200");
    		ok_response.put("msg", "ok");
    		builder = Response.status(Status.OK).entity(ok_response).type("application/json");
    		break;
    	}
		
		return builder.build();
    }
    
    public String generateToken(String userid, String password) {
    	return Util.md5(userid + password + SESSION_PRIVATE_KEY);
    }
    
    public boolean validateToken(String p_id, String p_token) throws SQLException {
    	//session token 过期
    	if(p_token == null) {
    		return false;
    	}
    	
    	//校验session token的准确性
    	String sql = "select * from ideaworks.user where id = ?";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_id);
		ResultSet rs_stmt = stmt.executeQuery();
		String db_password = "";
		while(rs_stmt.next()) {
			db_password = rs_stmt.getString("password");
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
    	String genToken = generateToken(p_id, db_password);
    	
    	return genToken == null ? false : genToken.equals(p_token);
    }
    
	//获取webapp的绝对路径, 通过class所在的目录推断而得
    //例如: xxxx/Ideaworks/
	public String getWebAppAbsolutePath() {
		URL resource = getClass().getResource("/");
		String path = resource.getPath();
		return path.replace("WEB-INF/classes/", "");
	}
}