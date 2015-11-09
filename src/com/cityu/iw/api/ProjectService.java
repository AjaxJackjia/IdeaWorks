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
import com.cityu.iw.model.Project;
import com.cityu.iw.util.Util;


@Path("/projects")
public class ProjectService extends BaseService {

	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Project> getProjects() throws Exception
	{
		//TODO 每次请求都需要校验token的合法性；
		validateToken();
		
		String sql = "select * from ideaworks.project";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql);
		ResultSet rs_stmt = stmt.executeQuery();
		
		List<Project> list = new ArrayList<Project>();
		
		while(rs_stmt.next()) {
			Project project = new Project();
			
			project.setId(rs_stmt.getInt("id"));
			project.setTitle(rs_stmt.getString("title"));
			project.setCreator(rs_stmt.getString("creator"));
			project.setAdvisor(rs_stmt.getString("advisor"));
			project.setAbstractContent(rs_stmt.getString("abstract"));
			project.setStatus(rs_stmt.getInt("status"));
			project.setSecurity(rs_stmt.getInt("security"));
			project.setLogo(Util.PROJECT_IMG_BASE_DIR + rs_stmt.getString("logo"));
			project.setCreatetime(rs_stmt.getTimestamp("createtime"));
			project.setModifytime(rs_stmt.getTimestamp("modifytime"));
			project.setIsDeleted(rs_stmt.getInt("isDeleted"));
			
			list.add(project);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return list;
	}
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Project getProjectsById(@PathParam("id") int p_id) throws Exception
	{
		String sql = "select * from ideaworks.project where id = ?";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_id);
		ResultSet rs_stmt = stmt.executeQuery();
		
		Project project = new Project();
		
		while(rs_stmt.next()) {
			project.setId(rs_stmt.getInt("id"));
			project.setTitle(rs_stmt.getString("title"));
			project.setCreator(rs_stmt.getString("creator"));
			project.setAdvisor(rs_stmt.getString("advisor"));
			project.setAbstractContent(rs_stmt.getString("abstract"));
			project.setStatus(rs_stmt.getInt("status"));
			project.setSecurity(rs_stmt.getInt("security"));
			project.setLogo(Util.PROJECT_IMG_BASE_DIR + rs_stmt.getString("logo"));
			project.setCreatetime(rs_stmt.getTimestamp("createtime"));
			project.setModifytime(rs_stmt.getTimestamp("modifytime"));
			project.setIsDeleted(rs_stmt.getInt("isDeleted"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return project;
	}
}