package com.cityu.iw.api.user;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URLEncoder;
import java.net.URLDecoder;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
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
	private static HashMap<String, String> SUPPORT_MIME_FILE_TYPE; //支持上传的文件类型
	
	public ProjectFileService() {
		SUPPORT_MIME_FILE_TYPE = new HashMap<String, String>();
		//file type
		SUPPORT_MIME_FILE_TYPE.put("doc", "application/msword");
		SUPPORT_MIME_FILE_TYPE.put("docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
		SUPPORT_MIME_FILE_TYPE.put("xls", "application/vnd.ms-exce");
		SUPPORT_MIME_FILE_TYPE.put("xls", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		SUPPORT_MIME_FILE_TYPE.put("ppt", "application/vnd.ms-powerpoint");
		SUPPORT_MIME_FILE_TYPE.put("pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
		SUPPORT_MIME_FILE_TYPE.put("pdf", "application/pdf");
		SUPPORT_MIME_FILE_TYPE.put("zip", "application/zip");
		SUPPORT_MIME_FILE_TYPE.put("rar", "application/x-rar-compressed");
		SUPPORT_MIME_FILE_TYPE.put("txt", "text/plain");	
		//image type
		SUPPORT_MIME_FILE_TYPE.put("gif", "image/gif");
		SUPPORT_MIME_FILE_TYPE.put("jpeg", "image/jpeg");
		SUPPORT_MIME_FILE_TYPE.put("jpg", "image/jpeg");
		SUPPORT_MIME_FILE_TYPE.put("png", "image/png");
	}
			
	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray getUserProjectFiles(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid) throws Exception
	{
		//check param
		if((p_userid == null || p_userid.equals("")) && p_projectid == 0) {
			return null;
		}
		
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.projectid, " + 
					 "	T1.filename, " + 
					 "	T1.filesize, " + 
					 "	T1.filetype, " + 
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
					 "	createtime asc";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONArray files = new JSONArray();
	
		while(rs_stmt.next()) {
			JSONObject file = new JSONObject();
			file.put("fileid", rs_stmt.getInt("id"));
			file.put("projectid", rs_stmt.getInt("projectid"));
			file.put("filename", rs_stmt.getString("filename"));
			file.put("filesize", rs_stmt.getString("filesize"));
			file.put("filetype", rs_stmt.getString("filetype"));
			String fileUrl = "/api/users/" + p_userid + "/projects/" + p_projectid + "/files/" + rs_stmt.getInt("id") + "/download";
			file.put("url", fileUrl);
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
	
	@GET
	@Path("/{fileid}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject getUserProjectFilesById(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid, 
			@PathParam("fileid") int p_fileid ) throws Exception
	{
		//check param
		if((p_userid == null || p_userid.equals("")) && p_projectid == 0 && p_fileid == 0) {
			return null;
		}
		
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.projectid, " + 
					 "	T1.filename, " + 
					 "	T1.filesize, " + 
					 "	T1.filetype, " + 
					 "	T1.creator, " + 
					 "	T1.createtime, " + 
					 "	T1.description, " + 
					 "	T2.nickname as creatorNickname, " + 
					 "	T2.logo as creatorLogo " + 
					 "from " +
					 "	ideaworks.file T1, " + 
					 "	ideaworks.user T2 " + 
					 "where " + 
					 "	T1.id = ? and " + 
					 "	T1.creator = T2.id ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_fileid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		JSONObject file = new JSONObject();
	
		while(rs_stmt.next()) {
			file.put("fileid", rs_stmt.getInt("id"));
			file.put("projectid", rs_stmt.getInt("projectid"));
			file.put("filename", rs_stmt.getString("filename"));
			file.put("filesize", rs_stmt.getString("filesize"));
			file.put("filetype", rs_stmt.getString("filetype"));
			String fileUrl = "/api/users/" + p_userid + "/projects/" + p_projectid + "/files/" + rs_stmt.getInt("id") + "/download";
			file.put("url", fileUrl);
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator"));
			creator.put("nickname", rs_stmt.getString("creatorNickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
			file.put("creator", creator);
			file.put("createtime", rs_stmt.getTimestamp("createtime").getTime());
			file.put("description", rs_stmt.getString("description"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		return file;
	}
	
	@GET
	@Path("/{fileid}/download")
	@Produces(MediaType.APPLICATION_OCTET_STREAM) //返回方式为流
	public byte[] downloadUserProjectFilesById(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid, 
			@PathParam("fileid") int p_fileid,
			@Context HttpServletRequest request,
			@Context HttpServletResponse response) throws Exception
	{
		//check param
		if((p_userid == null || p_userid.equals("")) && 
			p_projectid == 0 && p_fileid == 0) {
			return null;
		}
		
		String sql = "select " + 
					 "	T1.id, " + 
					 "	T1.projectid, " + 
					 "	T1.filename, " + 
					 "	T1.filesize, " + 
					 "	T1.filetype, " + 
					 "	T1.creator, " + 
					 "	T1.createtime, " + 
					 "	T1.description, " + 
					 "	T2.nickname as creatorNickname, " + 
					 "	T2.logo as creatorLogo " + 
					 "from " +
					 "	ideaworks.file T1, " + 
					 "	ideaworks.user T2 " + 
					 "where " + 
					 "	T1.id = ? and " + 
					 "	T1.creator = T2.id ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_fileid);
		ResultSet rs_stmt = stmt.executeQuery();
		
		//result
		String fileName = "", filetype = "";
		while(rs_stmt.next()) {
			fileName = rs_stmt.getString("filename");
			filetype = rs_stmt.getString("filetype");
		}
		DBUtil.getInstance().closeStatementResource(stmt);
		
		if(fileName.length() > 0) {
			String fileLocation = Config.WEBCONTENT_DIR + Config.PROJECT_FILE_BASE_DIR + "prj_" + p_projectid + "/" + URLDecoder.decode(fileName, "utf-8");
			FileInputStream fis = new FileInputStream(new File(fileLocation));
			byte[] byteArray = new byte[fis.available()];
			fis.read(byteArray);
			response.setHeader("Content-Disposition","attachment;filename=" + URLEncoder.encode(fileName, "utf-8"));//为文件命名
			response.addHeader("content-type", filetype);
			return byteArray;
		}else{
			return null;
		}
	}
	
	@POST
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject createUserProjectFiles(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@FormParam("title") String p_title, 
			@FormParam("creator[userid]") String p_creator,
			@FormParam("description") String p_description ) throws Exception
	{
		//check param
		if((p_projectid == 0) && 
		   (p_title == null || p_title.equals("")) && 
		   (p_creator == null || p_creator.equals("")) && 
		   (p_description == null || p_description.equals("")) ) {
			return null;
		}
		
		//1. create milestone
		String sql = "insert into " +
					 "	ideaworks.milestone (" + 
					 "		projectid, " + 
					 "		title, " + 
					 "		creator, " + 
					 "		time, " + 
					 "		description " + 
					 "	) values ( ?, ?, ?, ?, ? )";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, 
									p_projectid, p_title, p_creator, new Date(), p_description);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//2. 返回最新的milestone
		sql =
			 "select " + 
			 "	T1.id, " + 
			 "	T1.projectid, " + 
			 "	T1.title, " + 
			 "	T1.creator, " + 
			 "	T1.time, " + 
			 "	T1.description, " + 
			 "	T2.nickname as creatorNickname, " + 
			 "	T2.logo as creatorLogo " + 
			 "from " +
			 "	ideaworks.milestone T1, " + 
			 "	ideaworks.user T2 " + 
			 "where " + 
			 "	T1.projectid = ? and " + 
			 "	T1.creator = ? and " + 
			 "	T1.creator = T2.id " + 
			 "order by id desc limit 1 ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_projectid, p_creator);
		ResultSet rs_stmt = stmt.executeQuery();
		
		JSONObject milestone = new JSONObject();
		
		while(rs_stmt.next()) {
			milestone.put("milestoneid", rs_stmt.getInt("id"));
			milestone.put("projectid", rs_stmt.getInt("projectid"));
			milestone.put("title", rs_stmt.getString("title"));
			JSONObject creator = new JSONObject();
			creator.put("userid", rs_stmt.getString("creator"));
			creator.put("nickname", rs_stmt.getString("creatorNickname"));
			creator.put("logo", Config.USER_IMG_BASE_DIR + rs_stmt.getString("creatorLogo"));
			milestone.put("creator", creator);
			milestone.put("time", rs_stmt.getTimestamp("time").getTime());
			milestone.put("description", rs_stmt.getString("description"));
		}
		DBUtil.getInstance().closeStatementResource(stmt);

		//record activity
		String msg = p_title;
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(p_projectid, p_userid, msg,
				ProjectActivityService.Action.CREATE, 
				ProjectActivityService.Entity.MILESTONE);
		
		return milestone;
	}
	
	@DELETE
	@Path("/{fileid}")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject deleteUserProjectFiles(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@PathParam("fileid") int p_fileid ) throws Exception
	{
		//check param
		if((p_projectid == 0) && (p_fileid == 0) &&
		   (p_userid == null || p_userid.equals("")) ) {
			return null;
		}
				
		//查询要删除的file信息
		String filename = "";
		String sql = 
			     "select " + 
				 "	* " + 
				 "from " +
				 "	ideaworks.file " + 
				 "where " + 
				 "	id = ? ";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_fileid);
		ResultSet rs_stmt = stmt.executeQuery();
		while(rs_stmt.next()) {
			filename = rs_stmt.getString("filename");
		}
		
		//删除db中file记录
		sql = "delete from " +
			 "	ideaworks.file " + 
			 "where " + 
			 "	id = ? ";
		stmt = DBUtil.getInstance().createSqlStatement(sql, p_fileid);
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//删除file文件
		String fileLocation = Config.WEBCONTENT_DIR + Config.PROJECT_FILE_BASE_DIR + "prj_" + p_projectid + "/" + URLDecoder.decode(filename, "utf-8");
		File file = new File(filename);     
        if(file.isFile() && file.exists()){     
            file.delete();
        }
		
		//record activity
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(p_projectid, p_userid, filename,
				ProjectActivityService.Action.DELETE, 
				ProjectActivityService.Entity.FILE);
				
		return null;
	}
}