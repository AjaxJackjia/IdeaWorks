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


@Path("/users/{userid}/projects/{projectid}/files")
public class ProjectFileService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(ProjectFileService.class);
	
	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getUserProjectFiles(@PathParam("userid") String p_userid, @PathParam("projectid") int p_projectid) throws Exception
	{
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.projectid, " + 
					 "	T1.filename, " + 
					 "	T1.creator, " + 
					 "	T1.createtime, " + 
					 "	T1.description, " + 
					 "	T2.nickname as creatorNickname, " + 
					 "	T2.logo as creatorLogo " + 
					 "from " +
					 "	ideaworks.file T1, " + 
					 "	ideaworks.user T2 " + 
					 "where " + 
					 "	T1.projectid = ? and " + 
					 "	T1.creator = T2.id " + 
					 "order by " + 
					 "	createtime desc";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONArray files = new JSONArray();
	
		while(rs_stmt.next()) {
			JSONObject file = new JSONObject();
			file.put("fileid", rs_stmt.getInt("id"));
			file.put("projectid", rs_stmt.getInt("projectid"));
			file.put("filename", rs_stmt.getString("filename"));
			file.put("url", Config.PROJECT_FILE_BASE_DIR + rs_stmt.getString("filename"));
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator"));
			creator.put("nickname", rs_stmt.getString("creatorNickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
			file.put("creator", creator);
			file.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			file.put("description", rs_stmt.getString("description"));

			files.put(file);
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return files;
	}
}