package com.cityu.iw.api.user;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
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
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.api.BaseService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;
import com.cityu.iw.util.FileUtil;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataBodyPart;
import com.sun.jersey.multipart.FormDataMultiPart;
import com.sun.jersey.multipart.FormDataParam;

@Path("/users/{userid}/projects/{projectid}/files")
public class ProjectFileService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(ProjectFileService.class);
	private static HashMap<String, String> SUPPORT_MIME_FILE_TYPE; //支持上传的文件类型
	@Context HttpServletRequest request;
	
	public ProjectFileService() {
		SUPPORT_MIME_FILE_TYPE = new HashMap<String, String>();
		//file type
		SUPPORT_MIME_FILE_TYPE.put("doc", "application/msword");
		SUPPORT_MIME_FILE_TYPE.put("docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
		SUPPORT_MIME_FILE_TYPE.put("xls", "application/vnd.ms-exce");
		SUPPORT_MIME_FILE_TYPE.put("xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		SUPPORT_MIME_FILE_TYPE.put("ppt", "application/vnd.ms-powerpoint");
		SUPPORT_MIME_FILE_TYPE.put("pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
		SUPPORT_MIME_FILE_TYPE.put("pdf", "application/pdf");
		SUPPORT_MIME_FILE_TYPE.put("zip", "application/zip");
		SUPPORT_MIME_FILE_TYPE.put("rar", "application/x-rar");
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
	public Response getUserProjectFiles(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}

		//check param
		if((p_userid == null || p_userid.equals("")) || p_projectid == 0) {
			return buildResponse(PARAMETER_INVALID, null);
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
		
		return buildResponse(OK, files);
	}
	
	@GET
	@Path("/{fileid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserProjectFilesById(
			@PathParam("userid") String p_userid, 
			@PathParam("projectid") int p_projectid, 
			@PathParam("fileid") int p_fileid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}

		//check param
		if((p_userid == null || p_userid.equals("")) || p_projectid == 0 || p_fileid == 0) {
			return buildResponse(PARAMETER_INVALID, null);
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
		
		return buildResponse(OK, file);
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
		if((p_userid == null || p_userid.equals("")) || 
			p_projectid == 0 || p_fileid == 0) {
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
	@Consumes(MediaType.MULTIPART_FORM_DATA)  
	public Response createUserProjectFiles(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			FormDataMultiPart form ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
				
		/*
		 * Step 1. 获取参数
		 * */
		//获取文件流  
	    FormDataBodyPart filePart = form.getField("attachment");
	    InputStream fileInputStream = filePart.getValueAs(InputStream.class);
	    FormDataContentDisposition formDataContentDisposition = filePart.getFormDataContentDisposition();
	    
	    //获取表单的其他数据  
		FormDataBodyPart filesizePart = form.getField("filesize");
		FormDataBodyPart filetypePart = form.getField("filetype");
		FormDataBodyPart filenamePart = form.getField("filename");
		FormDataBodyPart creatorPart = form.getField("creator[userid]");
	    FormDataBodyPart descriptionPart = form.getField("description");
	    
	    long filesize = Long.parseLong(filesizePart.getValue());
	    String filetype = filetypePart.getValue();
	    String filename = filenamePart.getValue();
	    String creator = creatorPart.getValue();
	    String description = descriptionPart.getValue();
	    
	    /*
		 * Step 2. 校验参数 (description字段可为空)
		 * */
		if((p_projectid == 0) || (filesize == 0) ||
		   (p_userid == null || p_userid.equals("")) ||
		   (filetype == null || filetype.equals("")) ||
		   (filename == null || filename.equals("")) ||
		   (creator == null || creator.equals("")) ) {
			return buildResponse(PARAMETER_INVALID, null);
		}
		
		/*
		 * Step 3. 将文件写入server
		 * */
	    String fileLocation = Config.WEBCONTENT_DIR + Config.PROJECT_FILE_BASE_DIR + "prj_" + p_projectid + "/" + URLDecoder.decode(filename, "utf-8");
		boolean writeLFlag = FileUtil.create(fileInputStream, fileLocation);
	    if(!writeLFlag) { //若写入磁盘失败，则直接返回空
			return null;
		}
	    
		/*
		 * Step 4. 将文件记录写入DB（若文件存在，则会强制覆盖之前的记录）
		 * */
	    String sqlCheck = "select * from ideaworks.file where filename = ? ";
		String sqlInsert = "insert into " +
							 "	ideaworks.file (" + 
							 "		projectid, " + 
							 "		filename, " + 
							 "		filesize, " + 
							 "		filetype, " + 
							 "		creator, " + 
							 "		description " + 
							 "	) values ( ?, ?, ?, ?, ?, ? )";
		String sqlUpdate = "update " +
							 "	ideaworks.file " + 
							 "set " + 
							 "	projectid = ?, " + 
							 "	filename = ?, " + 
							 "	filesize = ?, " + 
							 "	filetype = ?, " + 
							 "	creator = ?, " + 
							 "	description = ? " + 
							 "where " + 
							 "	id = ? ";
		PreparedStatement stmtCheck = DBUtil.getInstance().createSqlStatement(sqlCheck, filename);
		ResultSet rs_stmt = stmtCheck.executeQuery();
		int fileid = -1;
		while(rs_stmt.next()) {
			fileid = rs_stmt.getInt("id");
		}
		DBUtil.getInstance().closeStatementResource(stmtCheck);
		
		PreparedStatement stmt = null;
		if(fileid == -1) {
			stmt = DBUtil.getInstance().createSqlStatement(sqlInsert, p_projectid, filename, filesize, filetype, creator, description);
		}else{
			stmt = DBUtil.getInstance().createSqlStatement(sqlUpdate, p_projectid, filename, filesize, filetype, creator, description, fileid);
		}
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		//record activity
		JSONObject info = new JSONObject();
		info.put("title", filename);
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.UPLOAD, Config.Entity.FILE, info);
		
		//通知该project中的所有成员
		ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.UPLOAD, Config.Entity.FILE, info);
		
		return null;
	}
	
	@DELETE
	@Path("/{fileid}")	
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUserProjectFiles(
			@PathParam("userid") String p_userid,
			@PathParam("projectid") int p_projectid,
			@PathParam("fileid") int p_fileid ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
				
		//check param
		if((p_projectid == 0) || (p_fileid == 0) ||
		   (p_userid == null || p_userid.equals("")) ) {
			return buildResponse(PARAMETER_INVALID, null);
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
		FileUtil.delete(fileLocation);
		
		//record activity
		JSONObject info = new JSONObject();
		info.put("title", filename);
		//param: projectid, operator, action, entity, title
		ProjectActivityService.recordActivity(p_projectid, p_userid, Config.Action.DELETE, Config.Entity.FILE, info);
		
		//通知该project中的所有成员
		ProjectNotificationService.notifyProjectAllMembers(p_projectid, p_userid, Config.Action.DELETE, Config.Entity.FILE, info);
				
		return null;
	}
}