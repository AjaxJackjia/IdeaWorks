package com.cityu.iw.util;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

public class MailUtil {
	private static final Logger LOGGER = Logger.getLogger(MailUtil.class);
	private static final String MAIL_USERID = "ideaworks2016@163.com";
	private static final String MIAL_PASSWORD = "twvxzbxzbioftwqo";
	
	public static void sendMailTo(String p_email, JSONObject mailInfo) throws MessagingException, JSONException {
		//check param
		if(p_email.equals("")) {
			return ;
		}
		
		Properties props = new Properties();  
        // 设置邮件服务器主机名  
        props.setProperty("mail.smtp.host", "smtp.163.com");
        // 发送服务器需要身份验证  
        props.setProperty("mail.smtp.auth", "true");  
        
        MyAuthenticator myauth = new MyAuthenticator(MAIL_USERID, MIAL_PASSWORD);
        Session session = Session.getDefaultInstance(props, myauth);
          
        // 创建邮件对象  
        Message msg = new MimeMessage(session);  
        // 设置发件人  
        msg.setFrom(new InternetAddress(MAIL_USERID));
        // 设置收件人
        msg.addRecipient(Message.RecipientType.TO, new InternetAddress(p_email));
        // 设置主题
        msg.setSubject(mailInfo.getString("subject"));  
        // 设置邮件内容  
        msg.setText(mailInfo.getString("content"));
        
        msg.saveChanges();
        Transport.send(msg);
	}
}

class MyAuthenticator extends javax.mail.Authenticator {
	private String strUser;
	private String strPwd;
	
	public MyAuthenticator(String user, String password) {
		this.strUser = user;
		this.strPwd = password;
	}

	protected PasswordAuthentication getPasswordAuthentication() {
		return new PasswordAuthentication(strUser, strPwd);
	}
}
