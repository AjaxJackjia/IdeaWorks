package com.cityu.iw.api.auth;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.cityu.iw.api.BaseService;
import com.cityu.iw.db.DBUtil;
import com.cityu.iw.util.Config;
import com.cityu.iw.util.RequestUtil;
import com.cityu.iw.util.Util;


@Path("/auth")
public class AuthService extends BaseService {
	private static final String CURRENT_SERVICE = "AuthService";
	private static final Log FLOW_LOGGER = LogFactory.getLog("FlowLog");
	private static final Log ERROR_LOGGER = LogFactory.getLog("ErrorLog");
	
	private static final String DEFAULT_USER_LOGO = "default_user_logo.jpg";
	@Context HttpServletRequest request;
	@Context UriInfo uriInfo;
	
	@POST
	@Path("/login")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject login(
			@FormParam("userid") String p_userid, 
			@FormParam("password") String p_password ) throws JSONException 
	{
		JSONObject result = new JSONObject();
		//check param
		if((p_userid == null || p_userid.equals("")) ||
		   (p_password == null || p_password.equals("")) ) {
			result.put("ret", "-1");
			result.put("msg", "parameter invalid");
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE,p_userid, "login parameter invalid!"));
			
			return result;
		}
		
		try{
			String sql = "select * from ideaworks.user where id = ?";
			PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
			ResultSet rs_stmt = stmt.executeQuery();
			//1. get password from db by id;
			String db_password = "",
				   nickname = "",
				   userlogo = "",
				   userlang = "";
			
			while(rs_stmt.next()) {
				db_password = rs_stmt.getString("password");
				nickname = rs_stmt.getString("nickname");
				userlogo = Config.USER_IMG_BASE_DIR + rs_stmt.getString("logo");
				userlang = rs_stmt.getString("language");
			}
			DBUtil.getInstance().closeStatementResource(stmt);
			
			//2. validate password && generate token
			if(db_password.equals(p_password)) {
				//generate token by md5 using id and password
				String token = generateToken(p_userid, db_password);
				
				if(token == null) {
					result.put("ret", "-2");
					result.put("msg", "token miss match");
					result.put("userid", p_userid);
					result.put("password", "*******");
					
					ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "login token miss match"));
				}else{
					result.put("ret", "0");
					result.put("msg", "ok");
					request.getSession().setAttribute("token", token);
					result.put("userid", p_userid);
					result.put("password", "*******");
					result.put("nickname", nickname);
					result.put("userlogo", userlogo);
					result.put("userlang", userlang);
					
					FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "login successfully"));
				}
			}else{
				result.put("ret", "-3");
				result.put("msg", "Username or password incorrect!");
				result.put("userid", p_userid);
				result.put("password", "*******");
				
				ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "login password incorrect"));
			}
		}catch (Exception ex) {
			result.put("ret", "-4");
			result.put("msg", "Server busy!");
			
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "login failed", ex.getMessage()));
		}
		
		return result;
	}
	
	@POST
	@Path("/signup")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject signup(
			@FormParam("username") String p_username, 
			@FormParam("password") String p_password,
			@FormParam("usertype") int p_usertype, 
			@FormParam("email") String p_email ) throws JSONException
	{
		JSONObject result = new JSONObject();
		//check param
		if((p_username == null || p_username.equals("")) || 
		   (p_password == null || p_password.equals("")) || 
		   (p_email == null || p_email.equals(""))) {
			result.put("ret", "-1");
			result.put("msg", "parameter invalid");
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_username, "sign up parameter invalid!"));
			
			return result;
		}
		
		try{
			// Step 1. Check id whether signed up
			String sql = "select id from ideaworks.user where id = ?";
			PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_username);
			ResultSet rs_stmt = stmt.executeQuery();
			String id = "";
			while(rs_stmt.next()) {
				id = rs_stmt.getString("id");
			}
			DBUtil.getInstance().closeStatementResource(stmt);
			
			if(!id.equals("")) {
				result.put("ret", "-3");
				result.put("msg", "This username has been signed up! Plase change another one!");
				FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_username, "This username has been signed up"));
				
				return result;
			}
			
			// Step 2. create user
			String notifications = "{\"project\":true,\"member\":true,\"milestone\":true,\"forum\":true,\"discussion\":true,\"file\":true}"; //淇℃伅閫氱煡璁剧疆
			int privacy = 2;			//默认profile组内可见
			int sync = 1;				//默认使用email同步通知
			String language = "en-us";  //默认语言为英语
			
			sql = "insert into " +
						 "	ideaworks.user (" + 
						 "		id, " + 
						 "		password, " + 
						 "		nickname, " +
						 "		email, " + 
						 "		logo, " +
						 "		usertype, " + 
						 "		notifications, " + 
						 "		privacy, " + 
						 "		sync, " + 
						 "		language " + 
						 "	) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
			stmt = DBUtil.getInstance().createSqlStatement(sql, 
					p_username, p_password, p_username, p_email, DEFAULT_USER_LOGO, p_usertype, 
					notifications, privacy, sync, language );
			stmt.execute();
			DBUtil.getInstance().closeStatementResource(stmt);
			
			//Step 3. return result
			sql = "select id from ideaworks.user where id = ?";
			stmt = DBUtil.getInstance().createSqlStatement(sql, p_username);
			rs_stmt = stmt.executeQuery();
			id = "";
			while(rs_stmt.next()) {
				id = rs_stmt.getString("id");
			}
			DBUtil.getInstance().closeStatementResource(stmt);
			
			if(id.equals("")) throw new Exception("no id");
			result.put("ret", "0");
			result.put("msg", "ok");
			FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_username, "signed up successfully"));
		}catch(Exception ex) {
			result.put("ret", "-2");
			result.put("msg", "sign up failed! Please try again later!");
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_username, "sign up failed", ex.getMessage()));
		}
		
		return result;
	}
	
	@POST
	@Path("/password")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject changePassword(
			@FormParam("userid") String p_userid, 
			@FormParam("oldpassword") String p_old_password,
			@FormParam("newpassword") String p_new_password ) throws JSONException
	{
		JSONObject result = new JSONObject();
		//check param
		if((p_userid == null || p_userid.equals("")) && 
		   (p_old_password == null || p_old_password.equals("")) && 
		   (p_new_password == null || p_new_password.equals("")) ) {
			result.put("ret", "-1");
			result.put("msg", "parameter invalid");
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "change password parameter invalid!"));
			
			return result;
		}
		
		try{
			//check old password
			String sql = "select password from ideaworks.user where id = ?";
			PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
			ResultSet rs_stmt = stmt.executeQuery();
			//get password from db by id;
			String db_password = "";
			
			while(rs_stmt.next()) {
				db_password = rs_stmt.getString("password");
			}
			DBUtil.getInstance().closeStatementResource(stmt);
			
			//validate password && generate token
			if(db_password.equals(p_old_password)) {
				sql = "update ideaworks.user set password = ? where id = ? ";
				stmt = DBUtil.getInstance().createSqlStatement(sql, p_new_password, p_userid);
				stmt.execute();
				DBUtil.getInstance().closeStatementResource(stmt);
				
				result.put("ret", "0");
				result.put("msg", "ok");
				//update token 
				String token = generateToken(p_userid, p_new_password);
				request.getSession().setAttribute("token", token);
				FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "change password successfully"));
			}else{
				result.put("ret", "-2");
				result.put("msg", "old password invalid");
				ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "old password invalid"));
			}
		}catch(Exception ex) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "change password", ex.getMessage()));
		}
		
		return result;
	}
	
	@POST
	@Path("/forget")
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject forgetPassword(
			@FormParam("userid") String p_userid,
			@FormParam("email") String p_email ) throws JSONException
	{
		JSONObject result = new JSONObject();
		//check param
		if((p_userid == null || p_userid.equals("")) && 
		   (p_email == null || p_email.equals("")) ) {
			result.put("ret", "-1");
			result.put("msg", "parameter invalid");
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "forget password parameter invalid!"));
			
			return result;
		}
		
		try{
			//1. check user email whether is valid
			String sql = "select email from ideaworks.user where id = ?";
			PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid);
			ResultSet rs_stmt = stmt.executeQuery();
			String db_email = "";
			while(rs_stmt.next()) {
				db_email = rs_stmt.getString("email");
			}
			DBUtil.getInstance().closeStatementResource(stmt);
			
			//validate email && generate new password
			if(db_email.equals(p_email)) {
				String newPwd = Util.generateRandomString(6);
				sql = "update ideaworks.user set password = ? where id = ? ";
				stmt = DBUtil.getInstance().createSqlStatement(sql, Util.md5(newPwd), p_userid);
				stmt.execute();
				DBUtil.getInstance().closeStatementResource(stmt);
				
				//send email to user
				HashMap<String, String> params = new HashMap<String, String>();
				params.put("toEmail", db_email);
				params.put("newPwd", newPwd);
				RequestUtil.postWithoutResult(uriInfo.getBaseUri().toURL() + "users/jackjia/mail/forget-password", params);
				
				result.put("ret", "0");
				result.put("msg", "ok");
				FLOW_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "get new password successfully through forget password function"));
			}else{
				result.put("ret", "-2");
				result.put("msg", "username or email address is invalid!");
				ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "username or email address is invalid in forget password function"));
			}
		}catch(Exception ex) {
			ERROR_LOGGER.info(Util.logJoin(CURRENT_SERVICE, p_userid, "get new password failed through forget password function", ex.getMessage()));
		}
		
		return result;
	}
}