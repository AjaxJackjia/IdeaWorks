package com.cityu.iw.api.project;

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

import com.cityu.iw.api.BaseService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;


@Path("/projects")
public class ProjectService extends BaseService {

	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getProjects() throws Exception
	{
		String sql = "select " + 
					 "	T2.id, " + 
					 "	T2.title, " + 
					 "	T2.creator, " + 
					 "	T4.nickname as creatorNickname, " +
					 "	T4.logo as creatorLogo, " +
					 "	T2.advisor, " + 
					 "	T3.nickname as advisorNickname, " +
					 "	T3.logo as advisorLogo, " +
					 "	T2.abstract, " + 
					 "	T2.status, " + 
					 "	T2.security, " + 
					 "	T2.logo, " + 
					 "	T2.createtime, " +
					 "	T2.modifytime " +
					 "from " + 
					 "	ideaworks.project T2, " + 
					 "	ideaworks.user T3, " + 
					 "	ideaworks.user T4 " + 
					 "where " + 
					 "	T3.id = T2.advisor and " + 
					 "	T4.id = T2.creator and " + 
					 "	T2.isDeleted = 0 " + 
					 "order by " + 
					 "	T2.createtime asc";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql);
		ResultSet rs_stmt = stmt.executeQuery();
		
		JSONArray list = new JSONArray();
		
		while(rs_stmt.next()) {
			JSONObject project = new JSONObject();
			
			project.put("projectid", rs_stmt.getInt("id"));
			project.put("title", rs_stmt.getString("title"));
			project.put("status", rs_stmt.getInt("status"));
			project.put("security", rs_stmt.getInt("security"));
			project.put("logo", Config.PROJECT_IMG_BASE_DIR + rs_stmt.getString("logo"));
			project.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			project.put("modifytime", rs_stmt.getTimestamp("modifytime").getTime());
			
			int security = rs_stmt.getInt("security");
			if(security == 0) { //0为project公开
				JSONObject creator = new JSONObject();
				creator.put("userid", rs_stmt.getString("creator"));
				creator.put("nickname", rs_stmt.getString("creatorNickname"));
				creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
				project.put("creator", creator);
				
				JSONObject advisor = new JSONObject();
				advisor.put("userid", rs_stmt.getString("advisor"));
				advisor.put("nickname", rs_stmt.getString("advisorNickname"));
				advisor.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("advisorLogo"));
				project.put("advisor", advisor);
				
				project.put("abstractContent", rs_stmt.getString("abstract"));
			}
			
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
		String sql = "select " + 
					 "	T2.id, " + 
					 "	T2.title, " + 
					 "	T2.creator, " + 
					 "	T4.nickname as creatorNickname, " +
					 "	T4.logo as creatorLogo, " +
					 "	T2.advisor, " + 
					 "	T3.nickname as advisorNickname, " +
					 "	T3.logo as advisorLogo, " +
					 "	T2.abstract, " + 
					 "	T2.status, " + 
					 "	T2.security, " + 
					 "	T2.logo, " + 
					 "	T2.createtime, " +
					 "	T2.modifytime " +
					 "from " + 
					 "	ideaworks.project T2, " + 
					 "	ideaworks.user T3, " + 
					 "	ideaworks.user T4 " + 
					 "where " + 
					 "	T2.id = ? and " + 
					 "	T3.id = T2.advisor and " + 
					 "	T4.id = T2.creator and " + 
					 "	T2.isDeleted = 0 ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_id);
		ResultSet rs_stmt = stmt.executeQuery();
		
		JSONObject project = new JSONObject();
		
		while(rs_stmt.next()) {
			project.put("projectid", rs_stmt.getInt("id"));
			project.put("title", rs_stmt.getString("title"));
			project.put("status", rs_stmt.getInt("status"));
			project.put("security", rs_stmt.getInt("security"));
			project.put("logo", Config.PROJECT_IMG_BASE_DIR + rs_stmt.getString("logo"));
			project.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			project.put("modifytime", rs_stmt.getTimestamp("modifytime").getTime());
			
			int security = rs_stmt.getInt("security");
			if(security == 0) { //0为project公开
				JSONObject creator = new JSONObject();
				creator.put("userid", rs_stmt.getString("creator"));
				creator.put("nickname", rs_stmt.getString("creatorNickname"));
				creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
				project.put("creator", creator);
				
				JSONObject advisor = new JSONObject();
				advisor.put("userid", rs_stmt.getString("advisor"));
				advisor.put("nickname", rs_stmt.getString("advisorNickname"));
				advisor.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("advisorLogo"));
				project.put("advisor", advisor);
				
				project.put("abstractContent", rs_stmt.getString("abstract"));
			}
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return project;
	}
}