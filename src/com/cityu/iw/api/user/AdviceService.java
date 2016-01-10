package com.cityu.iw.api.user;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
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


@Path("/users/{userid}/advice")
public class AdviceService extends BaseService {
	private static final Logger LOGGER = Logger.getLogger(AdviceService.class);
	@Context HttpServletRequest request;
	
	@POST
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Response proposeNewAdvice(
			@PathParam("userid") String p_userid,
			@FormParam("advice") String p_advice ) throws Exception
	{
		//每次请求都需要校验token的合法性；
		String token = (String) request.getSession().getAttribute("token");
		if(!validateToken(p_userid, token)) {
			return buildResponse(TOKEN_INVALID, null);
		}
		
		JSONObject result = new JSONObject();
		//Step 1. check param
		if((p_userid == null || p_userid.equals("")) || 
		   (p_advice == null || p_advice.equals(""))) {
			result.put("ret", "-1");
			result.put("msg", "parameter invalid");
			return buildResponse(PARAMETER_INVALID, result);
		}
		
		//Step 2. create new advice
		String sql = "insert into " +
					 "	ideaworks.advice ( userid, content, time ) " +
					 "values (?, ?, ?)";
		PreparedStatement stmt = DBUtil.getInstance().createSqlStatement(sql, p_userid, p_advice, new Date());
		stmt.execute();
		DBUtil.getInstance().closeStatementResource(stmt);
		
		result.put("ret", "0");
		result.put("msg", "ok");
		return buildResponse(OK, result);
	}
}