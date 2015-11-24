package com.cityu.iw.api;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Util;


public class BaseService
{
    public Response buildResponse(Object p_result, String p_mimeType, java.util.Date p_expires)
    {
        ResponseBuilder builder = Response.ok(p_result, p_mimeType);
        if (p_expires != null)
        {
            builder.expires(p_expires);
        }
        return builder.build();
    }
    
    public boolean validateToken(String p_id, String p_token) throws SQLException {
    	String sql = "select * from ideaworks.user where id = ?";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_id);
		ResultSet rs_stmt = stmt.executeQuery();
		String db_password = "";
		while(rs_stmt.next()) {
			db_password = rs_stmt.getString("password");
		}
    	String genToken = Util.md5(p_id + db_password);
    	
    	return genToken == null ? false : genToken.equals(p_token);
    }
}