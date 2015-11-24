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

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;


@Path("/projects")
public class ProjectService extends BaseService {

	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getProjects() throws Exception
	{
		//TODO 每次请求都需要校验token的合法性；
		//validateToken();
		
		String sql = "select * from ideaworks.project order by createtime desc";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql);
		ResultSet rs_stmt = stmt.executeQuery();
		
		JSONArray list = new JSONArray();
		
		while(rs_stmt.next()) {
			JSONObject project = new JSONObject();
			
			project.put("projectid", rs_stmt.getInt("id"));
			project.put("title", rs_stmt.getString("title"));
			project.put("creator", rs_stmt.getString("creator"));
			project.put("advisor", rs_stmt.getString("advisor"));
			project.put("abstractContent", rs_stmt.getString("abstract"));
			project.put("status", rs_stmt.getInt("status"));
			project.put("security", rs_stmt.getInt("security"));
			project.put("logo", Config.PROJECT_IMG_BASE_DIR + rs_stmt.getString("logo"));
			project.put("createtime", rs_stmt.getInt("createtime"));
			project.put("modifytime", rs_stmt.getInt("modifytime"));
			project.put("isDeleted", 0);
			
			list.put(project);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return list;
	}
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject getProjectsById(@PathParam("id") int p_id) throws Exception
	{
		String sql = "select * from ideaworks.project where id = ?";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_id);
		ResultSet rs_stmt = stmt.executeQuery();
		
		JSONObject project = new JSONObject();
		
		while(rs_stmt.next()) {
			project.put("projectid", rs_stmt.getInt("id"));
			project.put("title", rs_stmt.getString("title"));
			project.put("creator", rs_stmt.getString("creator"));
			project.put("advisor", rs_stmt.getString("advisor"));
			project.put("abstractContent", rs_stmt.getString("abstract"));
			project.put("status", rs_stmt.getInt("status"));
			project.put("security", rs_stmt.getInt("security"));
			project.put("logo", Config.PROJECT_IMG_BASE_DIR + rs_stmt.getString("logo"));
			project.put("createtime", rs_stmt.getInt("createtime"));
			project.put("modifytime", rs_stmt.getInt("modifytime"));
			project.put("isDeleted", 0);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return project;
	}
}