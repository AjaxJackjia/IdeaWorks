package com.cityu.iw.api;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.cityu.iw.db.DBUtil;
import com.cityu.iw.model.User;


@Path("/users")
public class UserService extends BaseService {

	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public List<User> getUsers() throws Exception
	{
		String sql = "select * from ideaworks.user";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql);
		ResultSet rs_stmt = stmt.executeQuery();
		
		List<User> list = new ArrayList<User>();
		
		while(rs_stmt.next()) {
			User user = new User();
			
			user.setId(rs_stmt.getString("id"));
			user.setNickname(rs_stmt.getString("nickname"));
			user.setSignature(rs_stmt.getString("signature"));
			user.setRealname(rs_stmt.getString("realname"));
			user.setPhone(rs_stmt.getString("phone"));
			user.setEmail(rs_stmt.getString("email"));
			
			list.add(user);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return list;
	}
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public User getUsersById(@PathParam("id") String p_id) throws Exception
	{
		System.out.println("user: " + p_id);
		
		String sql = "select * from ideaworks.user where id = ?";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_id);
		ResultSet rs_stmt = stmt.executeQuery();
		
		User user = new User();
		
		while(rs_stmt.next()) {
			user.setId(rs_stmt.getString("id"));
			user.setNickname(rs_stmt.getString("nickname"));
			user.setSignature(rs_stmt.getString("signature"));
			user.setRealname(rs_stmt.getString("realname"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return user;
	}
}